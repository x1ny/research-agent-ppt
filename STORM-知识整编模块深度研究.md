# STORM 知识整编模块（Knowledge Curation）深度研究

> 承接 [STORM核心流程与代码解析.md](STORM核心流程与代码解析.md) 的第三节，这里只深挖"阶段一"。
> 源码：[knowledge_curation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py) / [persona_generator.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py) / [callback.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/callback.py) / [storm_dataclass.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py) / [utils.py](reference-projects/storm/knowledge_storm/utils.py)

---

## 0. 一句话定位

知识整编要回答一个问题：**topic 这个字符串，怎么变成一堆"有来源、可引用"的信息片段？**

STORM 的答案不是"让一个 agent 自己想办法查资料"，而是搭了一台**流水线机器**：先固定生成几个"编辑视角"，再让每个视角去跑一段**结构完全相同、轮数有限**的模拟采访对话，采访过程中每一次"回答"背后都是一个**四步写死的检索子流程**。整段代码里，LLM 从没有被赋予"决定接下来做什么"的权力——它只被反复调用去完成"提一个问题" / "把问题拆成查询词" / "读材料写一段回答"这类边界很窄的子任务。

---

## 1. 顶层入口：`StormKnowledgeCurationModule.research()`

[knowledge_curation.py:347-393](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:347)

```python
def research(self, topic, ground_truth_url, callback_handler,
             max_perspective=0, disable_perspective=True, return_conversation_log=False):
    # 1. 定视角（写死一步）
    considered_personas = [""] if disable_perspective else \
        self._get_considered_personas(topic, max_num_persona=max_perspective)

    # 2. 每个视角并发跑一段对话（写死一步）
    conversations = self._run_conversation(
        conv_simulator=self.conv_simulator, topic=topic,
        ground_truth_url=ground_truth_url,
        considered_personas=considered_personas,
        callback_handler=callback_handler)

    # 3. 汇总成证据表（写死一步）
    information_table = StormInformationTable(conversations)
    return information_table, StormInformationTable.construct_log_dict(conversations)
```

三步严格顺序执行，没有任何一步是"LLM 决定要不要跳过 / 要不要重来"。这是整个知识整编阶段最外层的骨架，下面四节分别放大每一环。

---

## 2. 视角生成：`StormPersonaGenerator` —— 怎么"找角度"

[persona_generator.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py)

这里有一个很巧的设计：**不凭空让 LLM"想几个角色"，而是先给它看真实维基百科同类页面的目录，再据此归纳角色**。

```python
class CreateWriterWithPersona(dspy.Module):
    def forward(self, topic, draft=None):
        # 第一步：找相关维基页面（LLM 只负责给 URL 列表）
        related_topics = self.find_related_topic(topic=topic).related_topics
        urls = [s[s.find("http"):] for s in related_topics.split("\n") if "http" in s]

        # 第二步：抓取这些页面的目录（纯代码，requests + BeautifulSoup，不经过 LLM）
        examples = []
        for url in urls:
            title, toc = get_wiki_page_title_and_toc(url)   # 见下方
            examples.append(f"Title: {title}\nTable of Contents: {toc}")

        # 第三步：让 LLM 根据这些目录归纳出几个编辑角色
        gen_persona_output = self.gen_persona(
            topic=topic, examples="\n----------\n".join(examples)).personas
        ...
```

`get_wiki_page_title_and_toc`（[persona_generator.py:10-45](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py:10)）是纯 Python 爬虫：请求页面、用 `h2~h6` 标签重建目录层级、过滤掉"Contents / See also / References"等噪声章节。这一步完全不调用 LLM，只是为下一步的"归纳视角"提供结构化材料——**用真实文档结构做先验，而不是让模型凭参数记忆瞎猜**。

两个 Signature：

```python
class FindRelatedTopic(dspy.Signature):
    """我在写一个关于 [topic] 的维基百科页面，请推荐几个密切相关的维基百科页面……请把 url 分行列出。"""
    topic = dspy.InputField(...)
    related_topics = dspy.OutputField(...)

class GenPersona(dspy.Signature):
    """你需要挑选一组维基百科编辑者，一起完成这个主题的完整文章。每人代表不同的视角/角色/立场……
    参考格式：1. 简述编辑者1：描述\n2. 简述编辑者2：描述\n..."""
    topic = dspy.InputField(...)
    examples = dspy.InputField(prefix="Wiki page outlines of related topics for inspiration:\n")
    personas = dspy.OutputField(...)
```

最后 `StormPersonaGenerator.generate_persona`（[persona_generator.py:134-140](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py:134)）总是在结果前面强制插入一个兜底角色：

```python
default_persona = "Basic fact writer: Basic fact writer focusing on broadly covering the basic facts about the topic."
considered_personas = [default_persona] + personas.personas[:max_num_persona]
```

**设计要点**：即使"找相关页面"这步失败（没抓到任何 URL、抓取超时），`examples` 会退化成 `["N/A"]`，`GenPersona` 依然能跑（虽然质量会打折扣）；即使视角生成整体质量不理想，也永远有一个"基础事实视角"兜底，保证下游不会拿到空列表。

---

## 3. 对话模拟：`ConvSimulator` —— 谁在跟谁聊，怎么收场

[knowledge_curation.py:25-81](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:25)

```python
def forward(self, topic, persona, ground_truth_url, callback_handler):
    dlg_history = []
    for _ in range(self.max_turn):                      # 硬上限：轮数封顶
        user_utterance = self.wiki_writer(topic=topic, persona=persona,
                                           dialogue_turns=dlg_history).question
        if user_utterance.startswith("Thank you so much for your help!"):
            break                                        # 软终止：模型自己喊停
        expert_output = self.topic_expert(topic=topic, question=user_utterance,
                                           ground_truth_url=ground_truth_url)
        dlg_history.append(DialogueTurn(...))
        callback_handler.on_dialogue_turn_end(dlg_turn=dlg_history[-1])
    return dspy.Prediction(dlg_history=dlg_history)
```

两道终止保险：**模型可以提前说"谢谢"结束，但代码永远不允许超过 `max_conv_turn` 轮**——即便 LLM 完全不配合、一直提问不喊停，外层循环也会在固定次数后强制收尾。这正是"workflow 兜底 agent 式自由度"的典型手法：把 LLM 的自主性限制在一个有硬边界的容器里。

`WikiWriter`（提问方）的上下文管理值得单独看：

```python
def forward(self, topic, persona, dialogue_turns, draft_page=None):
    conv = []
    for turn in dialogue_turns[:-4]:                    # 4轮以前的历史：只留占位符
        conv.append(f"You: {turn.user_utterance}\nExpert: Omit the answer here due to space limit.")
    for turn in dialogue_turns[-4:]:                     # 最近4轮：保留完整问答
        conv.append(f"You: {turn.user_utterance}\nExpert: {ArticleTextProcessing.remove_citations(turn.agent_utterance)}")
    conv = ArticleTextProcessing.limit_word_count_preserve_newline("\n".join(conv), 2500)  # 再兜底裁剪词数
    ...
```

三层防护：①滑动窗口只保留最近 4 轮完整内容，②更早的轮次压缩成一句占位符而不是整段删除（保留"聊过什么"的痕迹），③即便如此还超预算，再用 `limit_word_count_preserve_newline` 硬裁到 2500 词——**不是等 prompt 爆掉才处理，而是三层递进式地主动控制成本**。

两个 Signature 分别对应"有 persona"和"无 persona（兜底视角）"两种提问方式：

```python
class AskQuestionWithPersona(dspy.Signature):
    """你是一位经验丰富的维基百科作者，除了这个身份，你在研究这个主题时还有specific focus。
    现在你在和专家聊天获取信息。问出好问题以获得更有用的信息。
    当你没有更多问题时，说"Thank you so much for your help!"结束对话。
    一次只问一个问题，不要重复问过的问题。"""
    topic = dspy.InputField(...)
    persona = dspy.InputField(...)
    conv = dspy.InputField(...)
    question = dspy.OutputField(...)
```

"结束语必须完全匹配 `Thank you so much for your help!`"这行 prompt 指令直接对应 `ConvSimulator.forward` 里的字符串前缀匹配判断——**prompt 措辞和代码判断逻辑是强耦合设计的一对**，这也是 dspy 风格代码里很常见但容易被忽略的细节。

---

## 4. 回答生成：`TopicExpert` —— 一个只有四步的微型 workflow

[knowledge_curation.py:181-244](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:181)

这是全模块信息密度最高的一段代码，本质上是**套在大 workflow 里的一个更小的 workflow**：

```python
def forward(self, topic, question, ground_truth_url):
    # ① 拆问题成检索式
    queries = self.generate_queries(topic=topic, question=question).queries
    queries = [q.strip().strip('"') for q in queries.split("\n")][: self.max_search_queries]

    # ② 检索（多线程，见下方 §5）
    searched_results = self.retriever.retrieve(list(set(queries)), exclude_urls=[ground_truth_url])

    if len(searched_results) > 0:
        # ③ 只取每条结果的第一个 snippet，拼接、限字数
        info = "\n\n".join(f"[{n+1}]: {r.snippets[0]}" for n, r in enumerate(searched_results))
        info = ArticleTextProcessing.limit_word_count_preserve_newline(info, 1000)
        # ④ 基于材料生成带引用的回答
        answer = self.answer_question(topic=topic, conv=question, info=info).answer
        answer = ArticleTextProcessing.remove_uncompleted_sentences_with_citations(answer)
    else:
        # 检索不到 —— 直接拒答，不让模型编
        answer = "Sorry, I cannot find information for this question. Please ask another question."

    return dspy.Prediction(queries=queries, searched_results=searched_results, answer=answer)
```

几个值得展开的细节：

- **① 生成查询词**用的是最简单的 `dspy.Predict(QuestionToQuery)`（没用 ChainOfThought），prompt 直接要求"逐行列出 query"，代码里再做字符串清洗（去掉列表符号、引号）。这是"能用简单方案就不用复杂方案"的取舍——拆查询词不需要推理链，直接生成即可。
- **② 检索结果去重**：`list(set(queries))` 说明如果多个查询词字面重复，只会真正发起一次检索请求。
- **③ "只取 top-1 snippet"是刻意简化**：源码注释直接写"Evaluate: Simplify this part by directly using the top 1 snippet"——本可以对每条结果的所有 snippet 做相关性排序，但工程上选择了最简单的截断策略，用 `limit_word_count_preserve_newline` 兜底控制总长度。
- **④ 拒答机制**是这一段最重要的抗幻觉设计：`if len(searched_results) > 0` 是唯一分支判断，检索为空就直接走死路径返回固定拒答文案，**不会把这句话也丢给 LLM 去"礼貌地编一段"**。
- `remove_uncompleted_sentences_with_citations`（[utils.py:367-](reference-projects/storm/knowledge_storm/utils.py:367)）处理的是另一个常见问题：LLM 输出可能在句子中间被截断（受 max_tokens 限制），如果这时候恰好截在引用号前面，会留下一个悬空的 `[3]` 没有对应句子。这个函数按"句末标点 + 可选引用号"识别完整句子，只保留到最后一个完整句子为止，同时把 `[1, 2, 3]` 这种分组引用拆成 `[1][2][3]` 并去重排序。

**这一整段回答的四步顺序（拆词→检索→截断→生成）跟外层 `run()` 的四阶段顺序是同一种设计哲学的两个尺度体现**：无论宏观流程还是微观子任务，STORM 都用固定步骤的代码去框住 LLM 的输出范围，LLM 只负责"在被限定好的输入输出接口里填内容"。

---

## 5. 并发编排：两层 `ThreadPoolExecutor`

知识整编阶段其实有**两层嵌套并发**，容易被忽略：

**外层**——`_run_conversation`（[knowledge_curation.py:286-345](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:286)）：N 个 persona 的对话并发跑，`max_workers = min(max_thread_num, len(considered_personas))`。

```python
with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
    future_to_persona = {executor.submit(run_conv, persona): persona for persona in considered_personas}
    for future in as_completed(future_to_persona):
        conv = future.result()
        conversations.append((persona, ArticleTextProcessing.clean_up_citation(conv).dlg_history))
```

代码里还专门处理了 Streamlit 前端集成的边界情况：`add_script_run_ctx(t)` 把线程池里的线程注册进 Streamlit 的日志上下文，否则前端连接时子线程里的 `st.write` 等调用会因为脱离主线程上下文而报错。

**内层**——`Retriever.retrieve`（[interface.py:288-319](reference-projects/storm/knowledge_storm/interface.py:288)）：同一轮对话里，`TopicExpert` 生成的多条 query 也是并发发出去的：

```python
with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_thread) as executor:
    results = list(executor.map(process_query, queries))
```

也就是说，一次完整的知识整编，理论并发粒度是 **persona 数 × 每轮 query 数**，但两层都各自受 `max_thread_num` 约束，不会无限制地打满线程池——这也是为什么 `STORMWikiRunnerArguments` 里有一条注释专门提醒"如果老遇到 rate limit 报错，考虑调小这个值"。

---

## 6. 数据清洗管道：`ArticleTextProcessing` 在这一阶段的三重用途

同一个工具类在知识整编的不同环节承担不同角色，容易被当成"随手调用的小工具"而忽略其系统性：

| 调用位置 | 方法 | 目的 |
|---|---|---|
| `WikiWriter.forward` 拼接历史对话时 | `remove_citations` | 防止上一轮回答里的 `[1][2]` 被当作"话题"混进下一轮提问的上下文，模型不会对着引用编号发问 |
| `WikiWriter.forward` / `TopicExpert.forward` 拼接材料后 | `limit_word_count_preserve_newline` | 三处独立的 token 预算阀门（对话历史 2500 词、检索材料 1000 词），保证不完整截断一行内容 |
| `TopicExpert.forward` 生成回答后 | `remove_uncompleted_sentences_with_citations` | 修掉因 max_tokens 截断产生的半句话和悬空引用号 |
| 一整段对话跑完之后 | `clean_up_citation`（[utils.py:428-452](reference-projects/storm/knowledge_storm/utils.py:428)） | 见下方 |

`clean_up_citation` 是"对话级"的最后一道清洗关卡，在 `_run_conversation` 里对每段刚跑完的对话统一执行一次：

```python
def clean_up_citation(conv):
    for turn in conv.dlg_history:
        if "References:" in turn.agent_utterance:                 # 砍掉模型自己加的"参考文献"尾巴
            turn.agent_utterance = turn.agent_utterance[: turn.agent_utterance.find("References:")]
        if "Sources:" in turn.agent_utterance:
            turn.agent_utterance = turn.agent_utterance[: turn.agent_utterance.find("Sources:")]
        turn.agent_utterance = turn.agent_utterance.replace("Answer:", "").strip()

        max_ref_num = max([int(x) for x in re.findall(r"\[(\d+)\]", turn.agent_utterance)], default=0)
        if max_ref_num > len(turn.search_results):                 # 引用号超出实际检索条数：多半是模型编号
            for i in range(len(turn.search_results), max_ref_num + 1):
                turn.agent_utterance = turn.agent_utterance.replace(f"[{i}]", "")

        turn.agent_utterance = ArticleTextProcessing.remove_uncompleted_sentences_with_citations(turn.agent_utterance)
```

"`max_ref_num > len(turn.search_results)` 就删掉超范围的引用号"这一行是另一处隐藏的抗幻觉设计：如果模型在回答里写了 `[5]` 但实际只检索到 3 条材料，`[5]` 大概率是模型自己瞎编的引用编号，直接物理删除而不是信任它。

---

## 7. 回调钩子：`BaseCallbackHandler`

[callback.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/callback.py) 定义了 8 个空方法（`pass`），知识整编阶段实际触发其中 4 个：

```
on_identify_perspective_start()   → research() 刚开始定视角时
on_identify_perspective_end(perspectives)  → 视角列表定下来之后
on_information_gathering_start()  → 开始跑对话之前
on_dialogue_turn_end(dlg_turn)    → 每一轮问答刚完成时（ConvSimulator 内部逐轮触发）
on_information_gathering_end()    → 全部对话跑完之后
```

这是一个标准的**观察者模式**：默认实现全是空操作，`STORMWikiRunner.run()` 里默认传入 `BaseCallbackHandler()`（什么也不做），但 Streamlit 前端可以继承这个类、重写这几个方法，实时把"正在生成第几个视角""正在问第几轮"推送到界面——**核心 pipeline 代码完全不知道、也不关心有没有前端在监听**，两者通过这一层薄薄的回调接口解耦。

---

## 8. 数据落地：`StormInformationTable` 的去重合并

[storm_dataclass.py:65-80](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:65)

```python
@staticmethod
def construct_url_to_info(conversations):
    url_to_info = {}
    for persona, conv in conversations:
        for turn in conv:
            for storm_info in turn.search_results:
                if storm_info.url in url_to_info:
                    url_to_info[storm_info.url].snippets.extend(storm_info.snippets)   # 同一 URL 合并 snippet
                else:
                    url_to_info[storm_info.url] = storm_info
    for url in url_to_info:
        url_to_info[url].snippets = list(set(url_to_info[url].snippets))               # 去重
    return url_to_info
```

多个 persona 各自跑自己的对话，很可能检索到同一个网页（比如都搜到了同一份政策文件）。这一步把整个知识整编阶段所有 persona 的检索结果按 URL 合并成一张全局证据表，为后面第三阶段"按章节做向量检索"提供统一的证据池。

---

## 9. 设计小结：知识整编也是"workflow"，不是"agent"

呼应 [Slide05StormCoreFlow.tsx](src/components/slides/Slide05StormCoreFlow.tsx) 里"run() 是确定性 workflow"的论点——把镜头拉近到这个子模块内部，结论依然成立，而且是**递归成立**的：

- 最外层 `research()`：定视角 → 跑对话 → 建证据表，三步硬编码顺序。
- 中层 `ConvSimulator.forward`：提问 → 回答，循环体固定，只是循环次数受"模型是否喊停"和"硬上限"共同控制。
- 内层 `TopicExpert.forward`：拆词 → 检索 → 截断 → 生成，四步硬编码顺序，唯一的分支是"检索有没有结果"这一个 if。

LLM 在这套结构里被调用了很多次（问什么问题、拆哪些查询词、怎么组织回答），但**从来没有被问过"接下来该做什么"**——那个问题的答案永远是 Python 代码里写好的下一行。这也是为什么 STORM 的知识整编阶段虽然"看起来像多轮自主对话"，本质上仍然是可预测、可重复、可断点续跑（`conversation_log.json` 落盘）的确定性流程，而不是一个自己规划步骤的 agent。

# STORM 核心主流程源码解析（PPT 讲解素材）

> 素材来源：[reference-projects/storm/knowledge_storm](reference-projects/storm/knowledge_storm)
> 目的：为 PPT 中"讲清 STORM 整体结构 + 配合真实代码讲解"提供内容底稿。当前只整理内容，未做成页面。
> 现有 [Slide04StormLineage.tsx](src/components/slides/Slide04StormLineage.tsx) 只给了四阶段的一句话概览，本文档是它的"源码放大版"，可用于新增/深化讲代码的那一页或几页。

---

## 一、整体架构一句话

STORM = **S**ynthesis of **T**opic **O**utlines through **R**etrieval and **M**ulti-perspective。
核心思路："先检索、后动笔"——线性四阶段流水线：

```
知识整编 (Knowledge Curation)
   → 大纲生成 (Outline Generation)
   → 文章生成 (Article Generation)
   → 文章润色 (Article Polish)
```

入口类是 **`STORMWikiRunner`**（[engine.py:171](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:171)），四个阶段各对应一个可插拔模块，模块之间通过两个核心数据结构传递状态：

- `StormInformationTable`：知识整编阶段收集到的"证据库"（对话记录 + url→信息 索引）
- `StormArticle`：贯穿大纲/生成/润色三个阶段的树形文章结构（章节树 + 引用表）

设计上大量使用抽象基类做关注点分离（下文第七节），每个阶段可以独立替换实现，比如把"逐段生成"换成"逐条要点生成"而不影响其它阶段。

---

## 二、入口与编排：`STORMWikiRunner`

### 2.1 五个 LLM 分工（体现"不同复杂度用不同模型"的成本/质量权衡）

[engine.py:21-124](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:21) `STORMWikiLMConfigs`：

```python
class STORMWikiLMConfigs(LMConfigs):
    def __init__(self):
        self.conv_simulator_lm = None   # 对话中"专家"回答用（可用便宜模型）
        self.question_asker_lm = None   # 对话中"提问"用（可用便宜模型）
        self.outline_gen_lm = None      # 大纲生成（建议强模型）
        self.article_gen_lm = None      # 正文生成（建议强模型）
        self.article_polish_lm = None   # 润色
```

驱动脚本里典型配置（[run_storm_wiki_gpt.py:71-87](reference-projects/storm/examples/storm_examples/run_storm_wiki_gpt.py:71)）：对话相关两个 LM 用 `gpt-3.5-turbo`，大纲/生成/润色三个用 `gpt-4o`——讲这一页时可以强调"分角色分配算力"这个成本意识。

### 2.2 构造：组装四个阶段模块

[engine.py:174-209](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:174)

```python
class STORMWikiRunner(Engine):
    def __init__(self, args, lm_configs, rm):
        super().__init__(lm_configs=lm_configs)
        self.retriever = Retriever(rm=rm, max_thread=args.max_thread_num)   # 检索后端包一层
        storm_persona_generator = StormPersonaGenerator(lm_configs.question_asker_lm)

        self.storm_knowledge_curation_module = StormKnowledgeCurationModule(
            retriever=self.retriever,
            persona_generator=storm_persona_generator,
            conv_simulator_lm=lm_configs.conv_simulator_lm,
            question_asker_lm=lm_configs.question_asker_lm,
            max_search_queries_per_turn=args.max_search_queries_per_turn,
            search_top_k=args.search_top_k,
            max_conv_turn=args.max_conv_turn,
            max_thread_num=args.max_thread_num,
        )
        self.storm_outline_generation_module = StormOutlineGenerationModule(
            outline_gen_lm=lm_configs.outline_gen_lm
        )
        self.storm_article_generation = StormArticleGenerationModule(
            article_gen_lm=lm_configs.article_gen_lm,
            retrieve_top_k=args.retrieve_top_k,
            max_thread_num=args.max_thread_num,
        )
        self.storm_article_polishing_module = StormArticlePolishingModule(
            article_gen_lm=lm_configs.article_gen_lm,
            article_polish_lm=lm_configs.article_polish_lm,
        )
```

一行代码对应一个阶段，构造函数就是整个流水线的"总装图"，很适合当作架构图的注释代码。

### 2.3 编排：`run()` —— 四个开关 + 断点续跑

[engine.py:341-441](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:341)（节选核心骨架）

```python
def run(self, topic, do_research=True, do_generate_outline=True,
        do_generate_article=True, do_polish_article=True, ...):

    information_table = None
    if do_research:
        information_table = self.run_knowledge_curation_module(...)

    outline = None
    if do_generate_outline:
        if information_table is None:                       # 断点续跑：磁盘加载上一阶段产物
            information_table = self._load_information_table_from_local_fs(
                os.path.join(self.article_output_dir, "conversation_log.json"))
        outline = self.run_outline_generation_module(information_table, ...)

    draft_article = None
    if do_generate_article:
        if information_table is None: ...   # 同样支持只跑这一步
        if outline is None:
            outline = self._load_outline_from_local_fs(...)
        draft_article = self.run_article_generation_module(outline, information_table, ...)

    if do_polish_article:
        if draft_article is None: ...
        self.run_article_polishing_module(draft_article, remove_duplicate=...)
```

**讲解要点**：四个阶段既可以一次串起来跑，也可以单独跑某一段（例如只重新生成正文），中间产物全部落盘为文件（`conversation_log.json` / `storm_gen_outline.txt` / `storm_gen_article.txt` / `url_to_info.json` ...），这是工程上很值得强调的一点——**每个阶段的输出都是可持久化、可复用的中间产物**，而不是纯内存管道。

### 2.4 驱动脚本（用户侧调用示例）

[run_storm_wiki_gpt.py:142-153](reference-projects/storm/examples/storm_examples/run_storm_wiki_gpt.py:142)

```python
runner = STORMWikiRunner(engine_args, lm_configs, rm)
topic = input("Topic: ")
runner.run(
    topic=topic,
    do_research=args.do_research,
    do_generate_outline=args.do_generate_outline,
    do_generate_article=args.do_generate_article,
    do_polish_article=args.do_polish_article,
)
runner.post_run()   # 落盘 run_config.json + llm_call_history.jsonl
runner.summary()    # 打印耗时 / token 用量 / 检索用量
```

三行代码即可跑通全流程，适合作为"整体架构"页的收尾代码块。

---

## 三、阶段一：知识整编（Knowledge Curation）—— 多视角角色扮演式对话

**核心机制**：不是让 LLM 直接对着主题检索，而是模拟"一群带不同视角的维基百科作者（WikiWriter）分别去采访一位专家（TopicExpert）"，通过多轮追问把信息挖深、挖全。

### 3.1 先生成"视角"（Persona）

[persona_generator.py:114-154](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py:114) `StormPersonaGenerator.generate_persona`：先读几篇相关主题的 Wikipedia 目录做参考（`FindRelatedTopic`），再据此生成几个"编辑者"角色（`GenPersona`），并总是加入一个默认的"Basic fact writer"兜底视角：

```python
def generate_persona(self, topic, max_num_persona=3):
    personas = self.create_writer_with_persona(topic=topic)
    default_persona = "Basic fact writer: Basic fact writer focusing on broadly covering the basic facts about the topic."
    considered_personas = [default_persona] + personas.personas[:max_num_persona]
    return considered_personas
```

### 3.2 单轮对话的两个角色

[knowledge_curation.py:25-125](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:25) `ConvSimulator.forward`：

```python
def forward(self, topic, persona, ground_truth_url, callback_handler):
    dlg_history = []
    for _ in range(self.max_turn):
        user_utterance = self.wiki_writer(topic=topic, persona=persona,
                                           dialogue_turns=dlg_history).question
        if user_utterance.startswith("Thank you so much for your help!"):
            break                                    # 提问方主动结束对话
        expert_output = self.topic_expert(topic=topic, question=user_utterance,
                                           ground_truth_url=ground_truth_url)
        dlg_history.append(DialogueTurn(
            agent_utterance=expert_output.answer,
            user_utterance=user_utterance,
            search_queries=expert_output.queries,
            search_results=expert_output.searched_results))
    return dspy.Prediction(dlg_history=dlg_history)
```

`WikiWriter`（提问方）用 `dspy.ChainOfThought(AskQuestionWithPersona)` 生成问题，并做了上下文裁剪：只保留最近 4 轮的完整问答，更早的轮次压缩成占位文本，避免 prompt 无限增长（[knowledge_curation.py:102-113](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:102)）。

`TopicExpert`（回答方）是本阶段真正做检索的地方，四步走（[knowledge_curation.py:204-244](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:204)）：

```python
def forward(self, topic, question, ground_truth_url):
    # 1. 把问题拆成若干检索 query
    queries = self.generate_queries(topic=topic, question=question).queries
    queries = [q.strip().strip('"') for q in queries.split("\n")][: self.max_search_queries]
    # 2. 检索（内部多线程并发）
    searched_results = self.retriever.retrieve(list(set(queries)), exclude_urls=[ground_truth_url])
    # 3. 拼接检索片段、限制长度
    info = "\n\n".join(f"[{n+1}]: {r.snippets[0]}" for n, r in enumerate(searched_results))
    info = ArticleTextProcessing.limit_word_count_preserve_newline(info, 1000)
    # 4. 基于检索到的信息生成带来源标注的回答
    answer = self.answer_question(topic=topic, conv=question, info=info).answer
    return dspy.Prediction(queries=queries, searched_results=searched_results, answer=answer)
```

若检索不到任何结果，专家会直接回答"无法回答"而不是凭空编造（[knowledge_curation.py:239-240](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:239)）——这是 STORM 抑制幻觉的一个关键设计点，很适合在 PPT 里点出来。

### 3.3 多视角并发编排

[knowledge_curation.py:347-393](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:347) `StormKnowledgeCurationModule.research`：

```python
def research(self, topic, ground_truth_url, callback_handler,
             max_perspective=0, disable_perspective=True, return_conversation_log=False):
    considered_personas = self._get_considered_personas(topic, max_num_persona=max_perspective)
    conversations = self._run_conversation(                 # 每个 persona 一个线程，并发跑完整对话
        conv_simulator=self.conv_simulator, topic=topic,
        ground_truth_url=ground_truth_url,
        considered_personas=considered_personas,
        callback_handler=callback_handler)
    information_table = StormInformationTable(conversations)
    return information_table, StormInformationTable.construct_log_dict(conversations)
```

`_run_conversation` 内部用 `ThreadPoolExecutor` 把 N 个 persona 的对话并发跑完（[knowledge_curation.py:317-345](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:317)）。最终产物 `StormInformationTable` 把所有对话中检索到的 `url → Information（含多个snippets）` 去重合并成一张统一的证据表（[storm_dataclass.py:65-80](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:65)）。

---

## 四、阶段二：大纲生成（Outline Generation）—— 先验大纲 + 检索精炼

**核心机制**：不是直接把所有对话丢给模型生成大纲，而是先让模型"凭已有知识"写一版基线大纲，再用对话内容去修订它——这样可以避免检索到的碎片信息打乱大纲的整体结构。

[outline_generation.py:84-125](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py:84) `WriteOutline.forward`：

```python
def forward(self, topic, dlg_history, old_outline=None, callback_handler=None):
    conv = "\n".join(f"Wikipedia Writer: {t.user_utterance}\nExpert: {t.agent_utterance}"
                      for t in trimmed_dlg_history)
    conv = ArticleTextProcessing.limit_word_count_preserve_newline(conv, 5000)

    if old_outline is None:
        old_outline = self.draft_page_outline(topic=topic).outline        # 第一步：仅凭参数知识生成基线大纲
    outline = self.write_page_outline(topic=topic, old_outline=old_outline, conv=conv).outline  # 第二步：结合对话修订
    return dspy.Prediction(outline=outline, old_outline=old_outline)
```

`StormOutlineGenerationModule.generate_outline`（[outline_generation.py:22-72](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py:22)）把阶段一所有 persona 的对话拼接起来喂给上面这个模块，同时返回两份大纲：

```python
concatenated_dialogue_turns = sum([conv for (_, conv) in information_table.conversations], [])
result = self.write_outline(topic=topic, dlg_history=concatenated_dialogue_turns, ...)
article_with_outline_only = StormArticle.from_outline_str(topic=topic, outline_str=result.outline)        # 精炼大纲
article_with_draft_outline_only = StormArticle.from_outline_str(topic=topic, outline_str=result.old_outline)  # 基线大纲
```

驱动脚本会把两份大纲都落盘（`direct_gen_outline.txt` vs `storm_gen_outline.txt`），方便做"检索前 vs 检索后"的对比讲解。大纲格式是纯 Markdown 标题层级（`#`/`##`/`###`），由 `StormArticle.from_outline_str`（[storm_dataclass.py:437-474](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:437)）解析成章节树。

---

## 五、阶段三：文章生成（Article Generation）—— 按章节并发写作 + 引用编号

**核心机制**：大纲的每个一级章节独立、并发地生成内容；每个章节先从阶段一收集的证据库里做一次"局部检索"（和阶段一的网络检索是两回事，这里是本地向量检索），再让模型带引用地写作，最后统一合并回文章树并重排引用编号。

### 5.1 局部证据检索：向量相似度而非关键词

[storm_dataclass.py:109-145](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:109) `StormInformationTable.retrieve_information`：

```python
def prepare_table_for_retrieval(self):
    self.encoder = SentenceTransformer("paraphrase-MiniLM-L6-v2")
    self.encoded_snippets = self.encoder.encode(self.collected_snippets)   # 把阶段一所有snippet预先embedding

def retrieve_information(self, queries, search_top_k):
    for query in queries:                                                  # queries 就是该章节的大纲路径
        encoded_query = self.encoder.encode(query)
        sim = cosine_similarity([encoded_query], self.encoded_snippets)[0]
        top_k_idx = np.argsort(sim)[-search_top_k:][::-1]
        ...
    return list(selected_url_to_info.values())
```

即：阶段一是"广度检索"（互联网搜索引擎，按 persona 提问驱动），阶段三是"精确复用"（本地向量库，按章节标题驱动）——两次检索的目的和实现完全不同，是很好的对比点。

### 5.2 并发生成 + 写作 Prompt

[article_generation.py:53-133](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:53) `StormArticleGenerationModule.generate_article`（核心骨架）：

```python
def generate_article(self, topic, information_table, article_with_outline, callback_handler=None):
    information_table.prepare_table_for_retrieval()
    sections_to_write = article_with_outline.get_first_level_section_names()

    with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_thread_num) as executor:
        future_to_sec_title = {}
        for section_title in sections_to_write:
            if section_title.lower() in ("introduction",) or section_title.lower().startswith(("conclusion", "summary")):
                continue                                    # 引言/结论不单独生成，交给后面的"润色"阶段写导语
            section_query = article_with_outline.get_outline_as_list(root_section_name=section_title)
            future_to_sec_title[executor.submit(
                self.generate_section, topic, section_title, information_table,
                section_outline="\n".join(...), section_query=section_query)] = section_title
        section_output_dict_collection = [f.result() for f in as_completed(future_to_sec_title)]

    article = copy.deepcopy(article_with_outline)
    for section_output_dict in section_output_dict_collection:
        article.update_section(parent_section_name=topic,
                                current_section_content=section_output_dict["section_content"],
                                current_section_info_list=section_output_dict["collected_info"])
    article.post_processing()          # 剪空节点 + 引用重新排序
    return article
```

单个章节的生成逻辑（`generate_section` → `ConvToSection.forward`，[article_generation.py:144-159](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:144)）要求模型带内联引用 `[1][2]`：

```python
class WriteSection(dspy.Signature):
    """Write a Wikipedia section based on the collected information.
    Use [1], [2], ..., [n] in line ... """
    info = dspy.InputField(prefix="The collected information:\n")
    topic = dspy.InputField(prefix="The topic of the page: ")
    section = dspy.InputField(prefix="The section you need to write: ")
    output = dspy.OutputField(prefix="Write the section with proper inline citations...")
```

### 5.3 引用编号如何全局统一

各章节各自独立生成，引用编号 `[1][2]...` 在每个线程里都是"从1开始"的局部编号，合并回文章树时必须重新映射成全局唯一编号。这一步在 `StormArticle.update_section → _merge_new_info_to_references`（[storm_dataclass.py:174-207](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:174)）完成：把每个章节用到的 `Information` 去重后追加进全局 `reference["url_to_unified_index"]`，并把该章节文本里的局部引用号替换成全局号。这是一个容易被忽略但很值得讲的"工程细节"：**多线程并发生成 + 事后合并引用编号**。

---

## 六、阶段四：文章润色（Article Polish）—— 写导语 + 可选去重

[article_polish.py:75-102](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_polish.py:75) `PolishPageModule.forward`：两次独立的 LM 调用：

```python
def forward(self, topic, draft_page, polish_whole_page=True):
    with dspy.settings.context(lm=self.write_lead_engine):
        lead_section = self.write_lead(topic=topic, draft_page=draft_page).lead_section   # 1) 写导语/摘要段

    if polish_whole_page:
        with dspy.settings.context(lm=self.polish_engine):
            page = self.polish_page(draft_page=draft_page).page                          # 2)（可选）通读全文去重
    else:
        page = draft_page
    return dspy.Prediction(lead_section=lead_section, page=page)
```

`PolishPage` 这个 Signature 的 prompt 说得很直白："找出文章里重复的信息并删除，但不要删任何非重复内容，保留引用标记和标题层级"（[article_polish.py:68-69](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_polish.py:68)）——因为分章节并发生成，不同章节之间内容重叠是常见问题，这一步是对第五阶段并发写作副作用的补救。

`StormArticlePolishingModule.polish_article`（[article_polish.py:29-53](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_polish.py:29)）把导语段插到文章最前面（`insert_to_front`，见 [storm_dataclass.py:233-238](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:233)），再调用 `post_processing()` 做最后一次"剪空节点 + 按文中出现顺序重排引用号"（[storm_dataclass.py:374-412](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:374) `reorder_reference_index`）。

---

## 七、贯穿全流程的关键抽象（可选，讲"为什么这么设计"）

定义于 [interface.py](reference-projects/storm/knowledge_storm/interface.py)：

| 抽象类 | 作用 | 行号 |
|---|---|---|
| `Engine` | 定义四个阶段方法 + `run()` 的抽象基类；`apply_decorators()` 用反射给所有 `run_*` 方法自动挂上计时/用量统计装饰器 | 485-563 |
| `LMConfigs` | 语言模型配置的抽象基类（约定属性名以 `_lm` 结尾即会被自动纳入统计） | 427-482 |
| `Retriever` | 检索后端的统一包装，内部多线程并发调用具体的 `rm`（`dspy.Retrieve` 子类） | 260-319 |
| `Information` | 全流程统一的"证据"单元：`url / title / description / snippets / citation_uuid` | 41-133 |
| `KnowledgeCurationModule / OutlineGenerationModule / ArticleGenerationModule / ArticlePolishingModule` | 四个阶段各自的抽象接口，`Storm*Module` 是其默认实现 | 322-408 |
| `Article` | 树形文章结构的抽象基类，`ArticleSectionNode` 是节点 | 136-257 |

**讲解落点**：四个阶段接口独立、可插拔——比如公司自己的方案完全可以复用 `KnowledgeCurationModule` 的检索/整编思路，但把 `ArticleGenerationModule` 换成"按要点生成"而不是"按维基百科段落生成"，这也是当前 `research-agent-ppt` 项目在做的事情（对照 [Slide09CoStorm.tsx](src/components/slides/Slide09CoStorm.tsx) 里的五步流程）。

---

## 八、完整数据流时序（文字版，可用来画流程图）

```
topic
  │
  ▼ [阶段一 知识整编]
  StormPersonaGenerator.generate_persona(topic) → [persona_1..persona_n]
  N 个 persona 并发跑 ConvSimulator（WikiWriter ⇄ TopicExpert，最多 max_conv_turn 轮）
  每轮 TopicExpert 内部：生成query → Retriever.retrieve()（多线程网络检索）→ 生成带引用回答
    → StormInformationTable（url_to_info 全局证据表）
  │
  ▼ [阶段二 大纲生成]
  拼接所有 persona 的对话历史
  WriteOutline：先生成基线大纲(draft_page_outline) → 再据对话精炼(write_page_outline)
    → StormArticle（只有章节树，无正文）
  │
  ▼ [阶段三 文章生成]
  StormInformationTable.prepare_table_for_retrieval()（对所有snippet做embedding）
  按一级章节并发：
    该章节标题/路径 → 向量检索 Top-K 相关snippet → ConvToSection 写作（带局部引用编号）
  合并所有章节 → StormArticle.update_section（引用编号局部→全局映射）
  post_processing()：剪空节点 + 引用重排
    → StormArticle（完整正文 + 全局引用表）
  │
  ▼ [阶段四 文章润色]
  WriteLeadSection：基于全文生成导语段，插入文章最前
  （可选）PolishPage：通读全文，删除跨章节重复内容
  post_processing()：再次剪空节点 + 引用重排
    → 最终 StormArticle（含摘要 / 正文 / 引用列表）
```

---

## 九、给 PPT 分页的建议节奏（仅建议，未落地页面）

1. **整体架构页**（可在现有 [Slide04StormLineage.tsx](src/components/slides/Slide04StormLineage.tsx) 基础上加一层"代码入口"）：`STORMWikiRunner.__init__` 的四行组装代码 + `run()` 的四个开关，强调"每阶段产物可落盘、可单独重跑"。
2. **知识整编页**：`ConvSimulator.forward` 的对话循环 + `TopicExpert.forward` 的四步检索逻辑，强调"多视角 persona + 检索不到就拒答"两个抗幻觉设计。
3. **大纲生成页**：`old_outline`（基线）vs `outline`（精炼）两份大纲对比，强调"先验知识打底、检索内容精炼"的顺序设计。
4. **文章生成页**：并发按章节生成 + 向量检索 + 引用编号全局合并三个点，可配一张"局部引用号→全局引用号"映射的示意图。
5. **文章润色页**：两次 LM 调用（导语 / 去重）+ `reorder_reference_index`，强调这是对"并发生成导致的重复"的收尾修补。
6.（可选）**架构抽象页**：`interface.py` 里五个抽象基类的表格，落到"这套架构对我们自己方案的启发是模块可替换"。

---

## 附：本文档引用的源码文件一览

- [knowledge_storm/storm_wiki/engine.py](reference-projects/storm/knowledge_storm/storm_wiki/engine.py) — `STORMWikiRunner` / `STORMWikiLMConfigs` / `STORMWikiRunnerArguments`
- [knowledge_storm/interface.py](reference-projects/storm/knowledge_storm/interface.py) — 五个抽象基类 + `Information` / `Retriever` / `Engine`
- [knowledge_storm/storm_wiki/modules/knowledge_curation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py) — 阶段一
- [knowledge_storm/storm_wiki/modules/persona_generator.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/persona_generator.py) — 视角生成
- [knowledge_storm/storm_wiki/modules/outline_generation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py) — 阶段二
- [knowledge_storm/storm_wiki/modules/article_generation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py) — 阶段三
- [knowledge_storm/storm_wiki/modules/article_polish.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_polish.py) — 阶段四
- [knowledge_storm/storm_wiki/modules/storm_dataclass.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py) — `StormInformationTable` / `StormArticle`
- [examples/storm_examples/run_storm_wiki_gpt.py](reference-projects/storm/examples/storm_examples/run_storm_wiki_gpt.py) — 端到端调用示例

（Co-STORM 多智能体变体不在本次范围内，详见 [knowledge_storm/collaborative_storm](reference-projects/storm/knowledge_storm/collaborative_storm)，与现有 [Slide08StormDialogue.tsx](src/components/slides/Slide08StormDialogue.tsx) 中的示意对话相关。）

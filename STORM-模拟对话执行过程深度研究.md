# STORM 模拟对话（ConvSimulator）执行过程深度研究

> 承接 [STORM-知识整编模块深度研究.md](STORM-知识整编模块深度研究.md) 第 3、4 节，这里把镜头再拉近一级：
> 只看**一个 persona 的一场对话**，从 `conv_simulator(...)` 被调用的那一刻开始，到它 `return` 为止，逐轮拆解运行时序。
> 源码：[knowledge_curation.py:25-244](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:25)

---

## 0. 参与者只有两个，状态只有一份

```python
class ConvSimulator(dspy.Module):
    def __init__(self, topic_expert_engine, question_asker_engine, retriever,
                 max_search_queries_per_turn, search_top_k, max_turn):
        super().__init__()
        self.wiki_writer = WikiWriter(engine=question_asker_engine)   # 提问方
        self.topic_expert = TopicExpert(engine=topic_expert_engine, ...)  # 回答方
        self.max_turn = max_turn
```

整场对话只有 `wiki_writer`（提问）和 `topic_expert`（回答）两个角色，共享的唯一状态是 `dlg_history: List[DialogueTurn]`——这是一个在 `forward()` 局部作用域里从空列表开始、逐轮 `append` 的列表，不是存在数据库或某个全局对象里的"记忆"。对话结束，这个状态也就随着函数返回而消失（外层只保留了返回值本身）。

`DialogueTurn` 这个数据结构本身很简单（[storm_dataclass.py:14-26](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:14)）：一轮 = 一个问题字符串 + 一个回答字符串 + 这轮用了哪些检索 query + 检索到了哪些 `Information`。

---

## 1. 主循环：`ConvSimulator.forward` 逐行拆解

[knowledge_curation.py:47-81](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:47)

```python
def forward(self, topic, persona, ground_truth_url, callback_handler):
    dlg_history: List[DialogueTurn] = []
    for _ in range(self.max_turn):                                   # ← 硬性步数上限
        user_utterance = self.wiki_writer(
            topic=topic, persona=persona, dialogue_turns=dlg_history  # ← 每轮把当前全部历史喂给提问方
        ).question
        if user_utterance == "":
            logging.error("Simulated Wikipedia writer utterance is empty.")
            break                                                     # ← 异常终止：模型没吐出问题
        if user_utterance.startswith("Thank you so much for your help!"):
            break                                                     # ← 正常终止：模型自己喊停
        expert_output = self.topic_expert(
            topic=topic, question=user_utterance, ground_truth_url=ground_truth_url
            # ↑ 注意：这里只传了 topic 和这一个 question，没有传 dlg_history！
        )
        dlg_turn = DialogueTurn(
            agent_utterance=expert_output.answer,
            user_utterance=user_utterance,
            search_queries=expert_output.queries,
            search_results=expert_output.searched_results,
        )
        dlg_history.append(dlg_turn)                                  # ← 更新共享状态
        callback_handler.on_dialogue_turn_end(dlg_turn=dlg_turn)       # ← 每轮结束立刻回调一次
    return dspy.Prediction(dlg_history=dlg_history)
```

这九行代码里，藏着一个执行过程上很容易被忽略、但概念上很重要的不对称：

> **"对话历史"这个概念，只单向存在于提问方（WikiWriter）这一侧。回答方（TopicExpert）在执行时完全看不到 `dlg_history`，它每次被调用时只拿到孤零零的一个 `question` 字符串。**

也就是说，"专家记得我们聊过什么"这件事，在这套实现里其实并不存在——专家每次回答都是一次**全新的、无记忆的**检索+生成，唯一让对话显得连贯的原因，是提问方每次都在看着历史提出一个新问题，而问题本身的措辞里通常会隐式携带上下文（比如"那乡镇呢？"这种指代，依赖问题句子本身把指代对象说清楚，专家才能答对——如果提问方生成的问题本身指代不清，专家会因为读不到历史而答偏）。这是一个**执行时的架构选择，不是bug**：专家的输入输出边界被刻意收窄到"给一个问题、给一个话题，独立完成一次检索问答"，让 `TopicExpert.forward` 保持无状态、可并发、可单测。

---

## 2. 提问方执行细节：`WikiWriter.forward`

[knowledge_curation.py:95-125](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:95)

```python
def forward(self, topic, persona, dialogue_turns, draft_page=None):
    conv = []
    for turn in dialogue_turns[:-4]:                 # 第5轮及更早：压缩成占位符
        conv.append(f"You: {turn.user_utterance}\nExpert: Omit the answer here due to space limit.")
    for turn in dialogue_turns[-4:]:                 # 最近4轮：保留完整问答（去掉引用号）
        conv.append(f"You: {turn.user_utterance}\nExpert: {ArticleTextProcessing.remove_citations(turn.agent_utterance)}")
    conv = "\n".join(conv)
    conv = conv.strip() or "N/A"                     # 第1轮：dialogue_turns 是空列表 → conv 变成字面量 "N/A"
    conv = ArticleTextProcessing.limit_word_count_preserve_newline(conv, 2500)

    with dspy.settings.context(lm=self.engine):
        if persona is not None and len(persona.strip()) > 0:
            question = self.ask_question_with_persona(topic=topic, persona=persona, conv=conv).question
        else:
            question = self.ask_question(topic=topic, persona=persona, conv=conv).question

    return dspy.Prediction(question=question)
```

**执行时间线上的关键点**：

- 第 1 轮调用时 `dialogue_turns == []`，两个 for 循环都不产生任何内容，`conv` 最终变成字符串 `"N/A"`——也就是说第一个问题的生成，prompt 里的"对话历史"字段字面量就是"N/A"，模型完全靠 `topic` + `persona` 两个字段来问出第一个问题。
- 从第 5 轮开始，`dialogue_turns[:-4]` 才会有内容，更早的轮次不是被删除，而是被替换成一句"Omit the answer here due to space limit."占位符——**问题本身还留着，只是回答被折叠**，这样模型依然知道"这个问题问过了、不要重复问"，但不会占用大量 token 去回顾旧答案。
- `if persona is not None and len(persona.strip()) > 0` 这个分支判断，在整场对话里每一轮都会重新执行一次——但 `persona` 参数在一场对话里从头到尾是常量（同一个 persona 跑完整场对话），所以这其实是一次"每轮都重复计算、但结果永远不变"的判断，不影响正确性，只是执行上有一点点冗余。
- 有一处小代码瑕疵值得指出：走 `else` 分支（无 persona，也就是默认兜底视角）时，代码依然写的是 `self.ask_question(topic=topic, persona=persona, conv=conv)`，把 `persona=""` 也传了进去——但 `AskQuestion` 这个 Signature 根本没有声明 `persona` 这个输入字段（见下方）。dspy 在绑定输入时按字段名匹配，多传的这个 `persona` 参数对没有该字段的 Signature 而言基本是无效的，实际不会影响 prompt 内容，但属于"传了个没人用的参数"这种可以清理但无伤大雅的历史遗留写法。

两个 Signature（决定"提问方式"的 prompt 契约）：

```python
class AskQuestion(dspy.Signature):
    """你是一位经验丰富的维基百科作者。你正在和一位专家聊天，为你想贡献的主题获取信息。
    提出好问题以获得更多与主题相关的有用信息。
    当你没有更多问题要问时，说"Thank you so much for your help!"来结束对话。
    请一次只问一个问题，不要重复问过的问题。你的问题应该和你想写的主题相关。"""

    topic = dspy.InputField(prefix="你想写的主题：", format=str)
    conv = dspy.InputField(prefix="对话历史：\n", format=str)
    question = dspy.OutputField(format=str)


class AskQuestionWithPersona(dspy.Signature):
    """你是一位经验丰富的维基百科作者，并且想编辑一个特定的页面。除了维基百科作者这个身份之外，
    你在研究这个主题时还带着特定的关注点。
    现在，你正在和一位专家聊天以获取信息。提出好问题以获得更多有用信息。
    当你没有更多问题要问时，说"Thank you so much for your help!"来结束对话。
    请一次只问一个问题，不要重复问过的问题。你的问题应该和你想写的主题相关。"""

    topic = dspy.InputField(prefix="你想写的主题：", format=str)
    persona = dspy.InputField(prefix="除了维基百科作者身份之外，你的人设是：", format=str)
    conv = dspy.InputField(prefix="对话历史：\n", format=str)
    question = dspy.OutputField(format=str)
```

"当你没有更多问题时，说'Thank you so much for your help!'"这句话，和主循环里 `user_utterance.startswith("Thank you so much for your help!")` 的字符串前缀判断是**强耦合的一对**——如果哪天有人改了 prompt 里的措辞而忘了同步改判断逻辑，终止机制就会失效（对话会一直问到 `max_turn` 硬上限才停，而不是模型主动喊停）。

---

## 3. 回答方执行细节：`TopicExpert.forward`（在对话循环里被调用的那一刻）

[knowledge_curation.py:204-244](reference-projects/storm/knowledge_storm/storm_wiki/modules/knowledge_curation.py:204)——这部分内部四步逻辑在上一份文档已经拆过，这里只强调"它在对话执行时序里扮演什么角色"：

```python
expert_output = self.topic_expert(topic=topic, question=user_utterance, ground_truth_url=ground_truth_url)
```

从主循环的视角看，这是一次**同步阻塞调用**：`for` 循环走到这一行会一直等，直到 `TopicExpert.forward` 内部完成"拆查询词 → 并发检索 → 截断材料 → 生成回答"这一整套四步子流程才会往下走。也就是说，**"一轮对话"在时间上远不是"问一句、答一句"这么简单**——每一次"答一句"背后，是一次独立的检索发生（内部还有 §4 提到的 query 级并发），单轮耗时主要由这次检索+生成决定，而不是提问本身。

`QuestionToQuery` 和 `AnswerQuestion` 这两个 Signature 翻译：

```python
class QuestionToQuery(dspy.Signature):
    """你想用 Google 搜索来回答这个问题。你会在搜索框里输入什么？
    请按以下格式写出你要用的查询词：
    - 查询词 1
    - 查询词 2
    ...
    - 查询词 n"""

    topic = dspy.InputField(prefix="你正在讨论的主题：", format=str)
    question = dspy.InputField(prefix="你想回答的问题：", format=str)
    queries = dspy.OutputField(format=str)


class AnswerQuestion(dspy.Signature):
    """你是一位能有效利用信息的专家。你正在和一位想写这个主题维基百科页面的作者聊天。
    你已经收集了相关信息，现在要用这些信息来组织一段回应。
    尽量让你的回应信息量最大，确保每一句话都有收集到的信息支撑。如果[收集到的信息]和[主题]或[问题]
    没有直接关系，就基于现有信息给出最相关的回答。如果实在无法给出合适的回答，就回复"我无法基于现有信息回答这个问题"，
    并说明有哪些局限或缺口。"""

    topic = dspy.InputField(prefix="你正在讨论的主题：", format=str)
    conv = dspy.InputField(prefix="问题：\n", format=str)
    info = dspy.InputField(prefix="收集到的信息：\n", format=str)
    answer = dspy.OutputField(
        prefix="现在给出你的回应。（尽量使用尽可能多不同的来源，不要编造。）\n", format=str
    )
```

---

## 4. 终止条件的实际执行顺序

一场对话到底会跑几轮，取决于三个检查的**执行先后顺序**（顺序本身就是设计的一部分）：

```
for _ in range(max_turn):          ← 外层硬上限：无论如何最多跑这么多轮
    生成 question
    if question == "":             ← 检查①：模型什么都没吐出来，异常退出
        break
    if question.startswith("Thank you..."):  ← 检查②：模型主动说不问了，正常退出
        break
    调用 TopicExpert 生成 answer   ← 只有跑过前两个检查才会真的发起一次检索
    dlg_history.append(...)
    callback_handler.on_dialogue_turn_end(...)
```

检查①和②都发生在"是否要调用专家、是否要多花一次检索成本"之前——**代码优先判断要不要继续，再决定要不要付出检索的代价**，这也是成本控制上的一个小心思：如果模型已经决定不问了，就不会再多打一次不必要的检索请求。

---

## 5. 一次具体的执行轨迹（以"XX市防汛工作方案"+"执行职责视角"为例）

假设 `max_conv_turn=3`，`persona="执行职责视角：关注具体谁负责、如何分工、执行边界在哪里"`，走一遍完整时序：

**第 1 轮**
- `WikiWriter.forward` 收到 `dialogue_turns=[]` → `conv` 变成字面量 `"N/A"` → 模型看到的"对话历史"字段是空的，只能纯粹依据 `topic` + `persona` 提问，比如生成："这类防汛政策通常涉及哪些部门和主要任务？"
- `TopicExpert.forward` 收到这一句 `question`（不知道这是"第几轮"、不知道是什么 persona 问的）→ 拆成检索词 → 并发检索 → 生成回答："通常涉及应急管理、水利、气象、住建等部门……"
- `dlg_history` 从 `[]` 变成 `[turn1]`，`on_dialogue_turn_end(turn1)` 触发一次回调。

**第 2 轮**
- `WikiWriter.forward` 这次收到 `dialogue_turns=[turn1]`——因为轮数 ≤ 4，两个 for 循环里第一个（`[:-4]`）依然是空的，第二个（`[-4:]`）会拿到 `[turn1]`，`conv` 变成一句完整的"You: ...\nExpert: ..."。模型看着这一轮的回答继续追问，比如："在较高等级响应下，乡镇一级具体承担什么职责？"——注意这句追问依赖的是**提问方读到的历史**，专家侧完全不知道"乡镇"这个话题是从上一轮的"部门职责"延伸出来的，它只会拿到这句独立的新问题去检索。
- `dlg_history` 变成 `[turn1, turn2]`。

**第 3 轮（`max_turn` 打满）**
- 同样流程再跑一次，`for` 循环在这轮跑完后，`range(3)` 耗尽，循环自然结束——不需要模型主动喊"谢谢"，硬上限先到了。
- 如果模型在第 3 轮就直接说了"Thank you so much for your help!"，则会在检查②那里提前 `break`，专家侧甚至不会被调用这一轮。

**返回**：`dspy.Prediction(dlg_history=[turn1, turn2, turn3])` 交回给 `_run_conversation`，在那里统一执行一次 `ArticleTextProcessing.clean_up_citation(conv)`（对整场对话做收尾清洗，不是逐轮清洗——参见上一份文档 §6），才正式存进 `StormInformationTable`。

---

## 6. 设计小结：为什么这仍然是"流程"而不是"agent 自主决策"

三个关键事实拼在一起看：

1. **提问方每轮只做一件写死的事**：读历史、问一个问题。它从不决定"这是不是最后一轮"（那是硬上限的事），也不规划"接下来要问哪几个方向"——每轮都是只看当前历史的一次性决策，没有任何显式的多步规划。
2. **回答方是完全无状态的**：它甚至不知道自己在"对话"里，每次调用都是独立的"给一个问题、查资料、写答案"，天然可并发、可单测、可替换。
3. **循环体本身是硬编码的**：谁先谁后、什么时候停、停了之后清洗什么，全部是 `for` 循环 + `if` 分支 + 函数调用序列，LLM 只是被嵌入在这个固定骨架里的两个"内容生成器"。

整场"模拟对话"给人的观感是"两个角色在自由交流"，但拆开执行过程看，它其实是**一个没有全局规划、只靠"局部历史 → 生成下一个问题"贪心递推、并且被硬轮数上限兜底的确定性循环**——跟 ReAct 那种"模型自己判断该不该继续、该调用什么工具"的自主 agent 循环，在控制权归属上是完全相反的两种设计。

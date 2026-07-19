# STORM 大纲生成模块（Outline Generation）深度研究

> 承接 [STORM核心流程与代码解析.md](STORM核心流程与代码解析.md) 第四节，这里深挖"阶段二"。
> 源码：[outline_generation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py) / [storm_dataclass.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py) / [utils.py](reference-projects/storm/knowledge_storm/utils.py)

---

## 0. 一句话原理

阶段二要解决的问题：**几十轮零散的问答记录，怎么变成一份有层次结构的文章大纲？**

STORM 的做法不是"一步到位让模型读完所有对话直接产出大纲"，而是拆成**先验 → 精炼**两次独立的 LLM 调用：第一次完全不看任何检索材料，只凭模型自己的参数知识写一份"基线大纲"；第二次才把阶段一收集的全部对话喂进去，要求模型"在基线大纲的基础上改进"。这个顺序本身就是核心设计——**先让模型给出一个结构性直觉，再用真实材料去校正它，而不是让海量的检索材料从一开始就主导结构**。

---

## 1. 顶层入口：`StormOutlineGenerationModule.generate_outline`

[outline_generation.py:22-72](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py:22)

```python
def generate_outline(self, topic, information_table, old_outline=None,
                      callback_handler=None, return_draft_outline=False):
    if callback_handler is not None:
        callback_handler.on_information_organization_start()

    # 把所有persona的对话历史拍平成一条大列表，persona之间的界限在这里被抹掉了
    concatenated_dialogue_turns = sum(
        [conv for (_, conv) in information_table.conversations], []
    )
    result = self.write_outline(
        topic=topic, dlg_history=concatenated_dialogue_turns, callback_handler=callback_handler
    )
    article_with_outline_only = StormArticle.from_outline_str(topic=topic, outline_str=result.outline)
    article_with_draft_outline_only = StormArticle.from_outline_str(topic=topic, outline_str=result.old_outline)

    if not return_draft_outline:
        return article_with_outline_only
    return article_with_outline_only, article_with_draft_outline_only
```

`information_table.conversations` 的类型是 `List[Tuple[persona字符串, List[DialogueTurn]]]`——`sum([conv for (_, conv) in ...], [])` 这个写法（用 `sum` 累加多个列表，等价于 `list.extend` 循环）把每个 persona 各自的对话历史依次拼接成**一条不区分来源的大列表**。也就是说，到了大纲生成这一步，"这句话是哪个视角问出来的"这个信息已经不存在了，模型看到的只是一长串"作者问、专家答"的记录，没有视角标签。

`STORMWikiRunner.run_outline_generation_module` 调用这个方法时永远不传 `old_outline`（[engine.py:242-247](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:242)），所以实际跑主流程时，"基线大纲"这一步**每次都会重新生成**，不存在真正意义上的断点续跑（虽然方法签名支持传入 `old_outline` 跳过第一次调用，但目前没有任何调用点用到这个能力）。

---

## 2. 核心执行：`WriteOutline.forward` —— 两次调用，一次比一次"有依据"

[outline_generation.py:75-125](reference-projects/storm/knowledge_storm/storm_wiki/modules/outline_generation.py:75)

```python
class WriteOutline(dspy.Module):
    def __init__(self, engine):
        super().__init__()
        self.draft_page_outline = dspy.Predict(WritePageOutline)          # 第一次调用用的Signature
        self.write_page_outline = dspy.Predict(WritePageOutlineFromConv)  # 第二次调用用的Signature
        self.engine = engine

    def forward(self, topic, dlg_history, old_outline=None, callback_handler=None):
        # === 第一步：拼对话文本，做三重清洗 ===
        trimmed_dlg_history = []
        for turn in dlg_history:
            if "topic you" in turn.agent_utterance.lower() or "topic you" in turn.user_utterance.lower():
                continue                                    # 过滤掉"疑似模型把prompt指令泄露进正文"的轮次
            trimmed_dlg_history.append(turn)

        conv = "\n".join([
            f"Wikipedia Writer: {turn.user_utterance}\nExpert: {turn.agent_utterance}"
            for turn in trimmed_dlg_history
        ])
        conv = ArticleTextProcessing.remove_citations(conv)               # 去掉[1][2]这类引用号
        conv = ArticleTextProcessing.limit_word_count_preserve_newline(conv, 5000)  # 硬裁剪到5000词

        with dspy.settings.context(lm=self.engine):
            # === 第二步：如果没有现成的旧大纲，先生成一份"纯先验大纲" ===
            if old_outline is None:
                old_outline = ArticleTextProcessing.clean_up_outline(
                    self.draft_page_outline(topic=topic).outline    # 注意：这里只传了topic，没有conv！
                )
                if callback_handler:
                    callback_handler.on_direct_outline_generation_end(outline=old_outline)

            # === 第三步：拿这份先验大纲当基础，结合对话内容精炼出最终大纲 ===
            outline = ArticleTextProcessing.clean_up_outline(
                self.write_page_outline(topic=topic, old_outline=old_outline, conv=conv).outline
            )
            if callback_handler:
                callback_handler.on_outline_refinement_end(outline=outline)

        return dspy.Prediction(outline=outline, old_outline=old_outline)
```

**清洗环节**：`"topic you" in turn.agent_utterance.lower()` 这个过滤条件初看有点奇怪——它在防的是一种真实存在的模型失败模式：如果某一轮对话里模型不小心把 prompt 里的指令措辞（比如 `AskQuestion` signature 里"Topic you want to write"这句提示词本身）复述进了回答正文，这轮对话就会被认为"内容不干净"，直接整轮丢弃，不参与大纲生成的上下文。这是一种**针对已知失败模式的黑名单式过滤**，而不是通用的内容质量判断。

**两次 LLM 调用的输入差异是关键**：

| | 调用对象 | 输入 | 是否看得到检索材料 |
|---|---|---|---|
| 第一次（基线） | `self.draft_page_outline` | 只有 `topic` | ❌ 完全不看，纯模型参数知识 |
| 第二次（精炼） | `self.write_page_outline` | `topic` + `old_outline` + `conv`（全部对话历史） | ✅ 依据阶段一收集的真实材料 |

---

## 3. 一个容易看漏的 dspy 技巧：`old_outline` 明明是 OutputField，却被当参数传进去

两个 Signature 对比着看：

```python
class WritePageOutline(dspy.Signature):
    """Write an outline for a Wikipedia page.
    Here is the format of your writing:
    1. Use "#" Title" to indicate section title, "##" Title" to indicate subsection title, "###" Title" to indicate subsubsection title, and so on.
    2. Do not include other information.
    3. Do not include topic name itself in the outline.
    """
    topic = dspy.InputField(prefix="The topic you want to write: ", format=str)
    outline = dspy.OutputField(prefix="Write the Wikipedia page outline:\n", format=str)


class WritePageOutlineFromConv(dspy.Signature):
    """Improve an outline for a Wikipedia page. You already have a draft outline that covers the general
    information. Now you want to improve it based on the information learned from an information-seeking
    conversation to make it more informative.
    Here is the format of your writing:
    1. Use "#" Title" to indicate section title, "##" Title" to indicate subsection title, "###" Title" to indicate subsubsection title, and so on.
    2. Do not include other information.
    3. Do not include topic name itself in the outline.
    """
    topic = dspy.InputField(prefix="The topic you want to write: ", format=str)
    conv = dspy.InputField(prefix="Conversation history:\n", format=str)
    old_outline = dspy.OutputField(prefix="Current outline:\n", format=str)   # ← 是 OutputField
    outline = dspy.OutputField(
        prefix='Write the Wikipedia page outline (Use "#" Title" to indicate section title, ...):\n',
        format=str,
    )
```

调用代码是 `self.write_page_outline(topic=topic, old_outline=old_outline, conv=conv)`——`old_outline` 在 Signature 里声明的是 `OutputField`，却在调用时被当成关键字参数传了进去。这不是笔误，而是 dspy 一个不太直观但很实用的机制：**当你在调用时提供了某个"输出字段"的值，dspy 会把这个字段当作"已经完成的部分"直接渲染进 prompt，模型只需要接着往下补全剩下还没被赋值的输出字段**。

也就是说，实际发给模型的 prompt 大致长这样（示意）：

```
Improve an outline for a Wikipedia page. ...

The topic you want to write: XX市防汛工作方案
Conversation history:
Wikipedia Writer: ...
Expert: ...
（省略）
Current outline:
# 组织领导
# 响应流程
# 保障措施
Write the Wikipedia page outline (Use "#" Title" ...):
```

模型看到的"Current outline:"后面已经填好了第一次调用产出的基线大纲，它不需要（也不会）重新生成这部分，只需要接着"Write the Wikipedia page outline:"往后续写精炼版。**这是一种"把上一步的输出，伪装成这一步 prompt 里已完成的一部分"的技巧，本质上是单次调用内的两段式续写，而不是真正意义上的"多轮对话"或"工具调用"**——从 dspy 框架层面看，这依然是一次性的、无状态的单次生成调用。

---

## 4. 大纲解析：从一段 Markdown 文本变成一棵真正的树

大纲以纯文本形式生成（`# / ## / ###` 表示层级），但下游（阶段三按章节生成正文）需要的是一棵可以按节点遍历的树。这个转换发生在 `StormArticle.from_outline_str`（[storm_dataclass.py:437-474](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:437)）：

```python
@classmethod
def from_outline_str(cls, topic: str, outline_str: str):
    lines = [line.strip() for line in outline_str.split("\n") if line.strip()]

    instance = cls(topic)
    if lines:
        # 如果第一行就是"# 主题名"本身，去掉这一行，避免主题被当成第一个章节
        adjust_level = lines[0].startswith("#") and \
            lines[0].replace("#", "").strip().lower() == topic.lower().replace("_", " ")
        if adjust_level:
            lines = lines[1:]

        node_stack = [(0, instance.root)]   # 栈：(层级, 节点)，root永远是栈底
        for line in lines:
            level = line.count("#") - adjust_level
            section_name = line.replace("#", "").strip()
            if section_name == topic:
                continue
            new_node = ArticleSectionNode(section_name)

            # 核心逻辑：不断弹出栈顶，直到找到"比自己层级更浅"的父节点
            while node_stack and level <= node_stack[-1][0]:
                node_stack.pop()

            node_stack[-1][1].add_child(new_node)   # 挂到当前栈顶（父节点）下面
            node_stack.append((level, new_node))    # 自己入栈，等下一行来判断谁是自己的子节点
    return instance
```

这是一个标准的**单调栈构建树**算法：逐行扫描，遇到新标题时，先把栈里"层级不小于自己"的节点全部弹出（意味着它们的子树已经封闭，不会再有更深的子节点插进来），栈顶剩下的就是新节点该挂靠的父节点。整个过程是 O(n) 一遍扫描，不需要回溯或递归。

这一步之前还有一道格式清洗——`ArticleTextProcessing.clean_up_outline`（[utils.py:457-482](reference-projects/storm/knowledge_storm/utils.py:457)）：如果模型输出里意外把 `topic` 本身当一级标题重复写了一遍，会被清空重来（`if topic != "" and f"# {topic.lower()}" in stripped_line.lower(): output_lines = []`）；如果模型用 `- 要点` 这种 bullet 而不是 `#` 层级来表达子结构，会被自动升一级转换成 `#### ` 形式的子标题；最后还会用正则把"参考文献 / See also"这类模型有时会自作主张加上的章节整段砍掉。

---

## 5. 回调时序

阶段二触发的三个回调事件，执行顺序固定：

```
on_information_organization_start()        ← generate_outline() 一进来就触发
on_direct_outline_generation_end(outline)   ← 第一次LLM调用（纯先验大纲）产出后触发，仅当 old_outline 原本为 None 时才会执行到这里
on_outline_refinement_end(outline)          ← 第二次LLM调用（精炼大纲）产出后触发
```

第二个回调是有条件的——如果调用方直接传入了 `old_outline`（虽然目前主流程从没这么用过），第一次 LLM 调用会被跳过，`on_direct_outline_generation_end` 也就不会触发。这给"允许外部注入一份人工/历史大纲，跳过先验生成直接精炼"这种用法留了口子，即使当前 STORM 主流程没有用到。

---

## 6. 落盘产物：两份大纲，一份对比材料

回到 `STORMWikiRunner.run_outline_generation_module`（[engine.py:237-254](reference-projects/storm/knowledge_storm/storm_wiki/engine.py:237)）：

```python
def run_outline_generation_module(self, information_table, callback_handler=None):
    outline, draft_outline = self.storm_outline_generation_module.generate_outline(
        topic=self.topic, information_table=information_table,
        return_draft_outline=True, callback_handler=callback_handler,
    )
    outline.dump_outline_to_file(os.path.join(self.article_output_dir, "storm_gen_outline.txt"))
    draft_outline.dump_outline_to_file(os.path.join(self.article_output_dir, "direct_gen_outline.txt"))
    return outline
```

两份大纲都会落盘——`direct_gen_outline.txt`（纯先验、未看任何检索材料）和 `storm_gen_outline.txt`（结合了真实对话内容精炼后的最终版）。只有后者会被传入下一阶段（文章生成），前者纯粹是留作**对比材料**——这份文件本身在正常流程里不会被任何后续代码读取，它存在的唯一意义是让人事后能对比"模型凭记忆瞎猜的结构"和"结合检索材料修正后的结构"差异有多大，是一个面向调试/评估、而非面向流程功能的落盘产物。

---

## 7. 设计小结：两次调用，两种"确定性"

呼应本系列一直在强调的论点——阶段二依然是外层代码写死的固定序列（清洗对话 → 先验大纲 → 精炼大纲 → 落盘），但这里更值得强调的是一个**更细粒度的方法论**：把"一次性让模型综合所有信息给出最终结果"，拆成"**先给一个无依据的初稿，再用真实材料去修正**"这两步。这种拆分本身也是一种确定性设计——两次调用的输入边界、先后顺序、各自能看到什么信息，全部是代码写死的，模型在每一步里能做的事情都被收得很窄（第一次只能"凭空写大纲"，第二次只能"在给定大纲基础上用给定材料改写"），没有一步是"模型自己决定要不要看材料、要不要重新来一遍"。

这也是为什么"直接大纲 vs 精炼大纲"这个对比在方法论上是有意义的：它把"模型的参数知识贡献了多少结构"和"检索材料修正了多少结构"这两件事，用两次独立、边界清晰的调用显式区分开了，而不是混在一次不透明的生成里。

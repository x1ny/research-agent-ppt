# STORM 文章生成模块（Article Generation）深度研究

> 承接 [STORM核心流程与代码解析.md](STORM核心流程与代码解析.md) 第五节，这里深挖"阶段三"。
> 源码：[article_generation.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py) / [storm_dataclass.py](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py) / [utils.py](reference-projects/storm/knowledge_storm/utils.py)

---

## 0. 一句话原理

阶段三要解决的问题：**一份只有标题层级、没有正文的大纲 + 一堆散乱的检索证据，怎么变成一篇真正有内容、带引用的文章？**

STORM 的做法是：把大纲的每个一级章节看作一个**独立、并发、互不通信**的写作任务——每个章节各自从阶段一收集的全部证据里，用向量相似度重新挑出"跟自己这个章节最相关"的那一小撮材料，单独写成一段带引用的文字。写完之后再**单线程、顺序**地把这些并发产出的内容合并回同一棵文章树，同时把每个章节各自独立编号的引用号统一成全局唯一的编号。

---

## 1. 顶层入口：`generate_article`

[article_generation.py:53-133](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:53)

```python
def generate_article(self, topic, information_table, article_with_outline, callback_handler=None):
    information_table.prepare_table_for_retrieval()          # ① 把阶段一收集的所有snippet做embedding

    if article_with_outline is None:
        article_with_outline = StormArticle(topic_name=topic)

    sections_to_write = article_with_outline.get_first_level_section_names()

    section_output_dict_collection = []
    if len(sections_to_write) == 0:
        # 兜底路径：完全没有大纲的话，直接拿topic本身当唯一"章节"去写
        logging.error(f"No outline for {topic}. Will directly search with the topic.")
        section_output_dict = self.generate_section(
            topic=topic, section_name=topic, information_table=information_table,
            section_outline="", section_query=[topic],
        )
        section_output_dict_collection = [section_output_dict]
    else:
        # ② 正常路径：每个一级章节并发生成
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_thread_num) as executor:
            future_to_sec_title = {}
            for section_title in sections_to_write:
                if section_title.lower().strip() == "introduction":
                    continue                                  # 引言不在这里写
                if section_title.lower().strip().startswith("conclusion") or \
                   section_title.lower().strip().startswith("summary"):
                    continue                                  # 结论/摘要也不在这里写
                section_query = article_with_outline.get_outline_as_list(root_section_name=section_title, add_hashtags=False)
                queries_with_hashtags = article_with_outline.get_outline_as_list(root_section_name=section_title, add_hashtags=True)
                section_outline = "\n".join(queries_with_hashtags)
                future_to_sec_title[executor.submit(
                    self.generate_section, topic, section_title, information_table, section_outline, section_query
                )] = section_title
            for future in as_completed(future_to_sec_title):
                section_output_dict_collection.append(future.result())

    # ③ 合并阶段：单线程、顺序执行，不再并发
    article = copy.deepcopy(article_with_outline)
    for section_output_dict in section_output_dict_collection:
        article.update_section(
            parent_section_name=topic,
            current_section_content=section_output_dict["section_content"],
            current_section_info_list=section_output_dict["collected_info"],
        )
    article.post_processing()
    return article
```

**一个非常容易被忽略、但影响很大的行为**：`introduction` / `conclusion*` / `summary*` 这三类一级章节标题，会被**直接跳过，完全不生成内容**。它们在 `article_with_outline`（从大纲字符串解析出来的树）里是有节点的，但因为从未进入 `sections_to_write` 的处理循环，`update_section` 也就永远不会触碰这些节点，它们的 `content` 会一直是初始值 `None`。而 `post_processing()` 里的 `prune_empty_nodes()` 会把"内容为空且没有子节点"的节点整个删掉——**也就是说，如果大纲里出现了"引言/结论/摘要"这种标题，它们会在最终文章里被静默地整个删除，不会留下任何空白章节或占位符**。这是刻意为之：引言/摘要这一类内容被专门挪到了阶段四（文章润色）用 `WriteLeadSection` 单独生成，並插到全文最前面——阶段三和阶段四在这里是分工明确、不重叠的关系。

---

## 2. 单个章节怎么写：`generate_section`

[article_generation.py:33-51](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:33)

```python
def generate_section(self, topic, section_name, information_table, section_outline, section_query):
    collected_info: List[Information] = []
    if information_table is not None:
        collected_info = information_table.retrieve_information(
            queries=section_query, search_top_k=self.retrieve_top_k
        )
    output = self.section_gen(topic=topic, outline=section_outline, section=section_name, collected_info=collected_info)
    return {
        "section_name": section_name,
        "section_content": output.section,
        "collected_info": collected_info,
    }
```

这里的 `section_query` 和 `section_outline` 来自同一个方法 `get_outline_as_list` 的两种不同调用方式（[storm_dataclass.py:301-350](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:301)）：

```python
section_query = article_with_outline.get_outline_as_list(root_section_name=section_title, add_hashtags=False)
# → ["响应流程", "预警与研判", "人员转移", "灾情报送"]  纯文本列表，喂给"检索"

queries_with_hashtags = article_with_outline.get_outline_as_list(root_section_name=section_title, add_hashtags=True)
section_outline = "\n".join(queries_with_hashtags)
# → "# 响应流程\n## 预警与研判\n## 人员转移\n## 灾情报送"  带层级符号，喂给"写作"
```

同一份大纲子树，被"提炼成检索用的关键词列表"和"整理成带层级的写作提纲"两种形态，分别服务于 `retrieve_information`（检索）和 `WriteSection`（写作）两个不同目的。

---

## 3. 第二种检索：本地向量相似度，跟阶段一的网络搜索是两回事

[storm_dataclass.py:109-145](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:109)

```python
def prepare_table_for_retrieval(self):
    self.encoder = SentenceTransformer("paraphrase-MiniLM-L6-v2")
    self.collected_urls, self.collected_snippets = [], []
    for url, information in self.url_to_info.items():
        for snippet in information.snippets:
            self.collected_urls.append(url)
            self.collected_snippets.append(snippet)
    self.encoded_snippets = self.encoder.encode(self.collected_snippets)   # 把阶段一所有snippet预先embedding

def retrieve_information(self, queries, search_top_k):
    selected_urls, selected_snippets = [], []
    for query in queries:                                                  # 逐个章节标题/子标题做一次向量查询
        encoded_query = self.encoder.encode(query)
        sim = cosine_similarity([encoded_query], self.encoded_snippets)[0]
        for i in np.argsort(sim)[-search_top_k:][::-1]:                    # 取相似度最高的 top_k 个
            selected_urls.append(self.collected_urls[i])
            selected_snippets.append(self.collected_snippets[i])
    # 按url聚合、去重snippet，再深拷贝出一份局部的Information对象
    ...
    return list(selected_url_to_info.values())
```

对比一下阶段一 `TopicExpert` 里用的检索：那是**广度检索**——发起真实的网络搜索请求，为了回答"专家还不知道的问题"。这里的检索完全是**本地复用**——不发任何网络请求，纯粹是在阶段一已经收集好的证据池里，用句向量余弦相似度挑出"哪些材料的语义最贴近当前这个章节标题"。同一个词"检索"，在这两个阶段指的是完全不同的两套机制、两种目的。

`queries` 参数本身也值得注意：传进来的是**整个章节路径下所有子标题拼成的列表**（比如 `["响应流程", "预警与研判", "人员转移", "灾情报送"]`），每个子标题都单独做一次向量查询、各自取 `top_k`，最后再合并去重——不是把整个章节标题当一句话查一次，而是"章节标题 + 每个子标题"分别查、结果并集。

---

## 4. 并发写作：`ThreadPoolExecutor` + `as_completed`

[article_generation.py:91-123](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:91)

```python
with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_thread_num) as executor:
    future_to_sec_title = {}
    for section_title in sections_to_write:
        ...
        future_to_sec_title[executor.submit(self.generate_section, ...)] = section_title
    for future in as_completed(future_to_sec_title):
        section_output_dict_collection.append(future.result())
```

每个一级章节独立提交一个线程任务，`as_completed` 按"谁先跑完就先收谁的结果"的顺序收集——**章节生成的完成顺序是不确定的**（取决于每个章节各自的检索+生成耗时），`section_output_dict_collection` 里元素的实际顺序在每次运行中可能不一样。但这不影响最终文章的章节顺序，因为合并阶段是靠 `update_section(parent_section_name=topic, ...)` 按"这段内容属于哪个章节"来定位插入位置的（内部走 `find_section` 按名字查找），不是靠列表顺序——**并发只体现在"谁先写完"，最终文章的章节排列顺序始终由原始大纲树决定，不受并发完成顺序影响**。

**为什么合并阶段（`for section_output_dict in section_output_dict_collection: article.update_section(...)`）要退回单线程？** 因为这一步要在同一棵 `article` 树上做插入操作，多线程同时改同一个可变对象会有竞态风险。STORM 的做法是把"生成内容"（各自独立、可并发、互不干扰）和"写入共享结构"（必须串行、避免竞态）两个阶段彻底分开——线程池里的每个任务只负责算出一个"结果字典"、不触碰共享的 `article` 对象，等所有线程都跑完了，再统一在主线程里挨个合并进树。这是一个很标准的"并发计算 + 串行提交"模式。

---

## 5. 写作本体：`ConvToSection` + `WriteSection`

[article_generation.py:136-177](reference-projects/storm/knowledge_storm/storm_wiki/modules/article_generation.py:136)

```python
class ConvToSection(dspy.Module):
    def __init__(self, engine):
        super().__init__()
        self.write_section = dspy.Predict(WriteSection)     # 同样是 Predict，不是 ChainOfThought
        self.engine = engine

    def forward(self, topic, outline, section, collected_info):
        info = ""
        for idx, storm_info in enumerate(collected_info):
            info += f"[{idx + 1}]\n" + "\n".join(storm_info.snippets)   # 局部引用编号：从1开始，仅在本章节内有效
            info += "\n\n"
        info = ArticleTextProcessing.limit_word_count_preserve_newline(info, 1500)

        with dspy.settings.context(lm=self.engine):
            section = ArticleTextProcessing.clean_up_section(
                self.write_section(topic=topic, info=info, section=section).output
            )
        return dspy.Prediction(section=section)
```

`WriteSection`（已译）：

```python
class WriteSection(dspy.Signature):
    """根据收集到的信息撰写一个维基百科章节。
    写作格式如下：
        1. 使用"# 标题"表示章节标题，"## 标题"表示子章节标题，"### 标题"表示子子章节标题，以此类推。
        2. 在正文中使用 [1]、[2]、……、[n] 标注引用（例如"美国的首都是华盛顿特区。[1][3]"）。你不需要在结尾单独列一个"参考文献"或"来源"章节。
    """
    info = dspy.InputField(prefix="收集到的信息：\n")
    topic = dspy.InputField(prefix="页面的主题：")
    section = dspy.InputField(prefix="你需要撰写的章节：")
    output = dspy.OutputField(
        prefix="请撰写带有恰当内联引用的章节内容（以'# 章节标题'开头，不要包含页面主题，也不要尝试撰写其他章节）：\n"
    )
```

这里的引用编号 `[1] [2] ...` 是**局部编号**——每个章节各自独立地从 1 开始编号自己拿到的 `collected_info`，跟其他章节、跟最终文章毫无关系。这意味着如果两个章节都各自拿到了 3 条材料，它们生成的正文里都会各自出现 `[1][2][3]`，编号会撞车——这个问题要留到合并阶段才解决（见下一节）。

`clean_up_section`（[utils.py:506-538](reference-projects/storm/knowledge_storm/utils.py:506)）在这里做三件事：①去掉因 token 截断产生的不完整句子（复用 `remove_uncompleted_sentences_with_citations`）；②**过滤掉模型自己夹带的总结段落**——只要一段话以"Overall"/"In summary"/"In conclusion"开头，或者出现"# Summary"/"# Conclusion"这种子标题，就整段丢弃（而且一旦进入"总结区"，后面的段落也会持续跳过，直到遇到下一个真正的 `#` 标题）。这道清洗是在防一个已知的模型习惯：**明明只要求"写一个章节"，模型却经常会在结尾自己加一段总结/结论**，而这类内容不该出现在正文章节里（结论已经被划给阶段四单独处理）。

---

## 6. 合并回文章树：局部引用号 → 全局引用号

[storm_dataclass.py:174-299](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:174)

`update_section` 做的事情分三步：

```python
def update_section(self, current_section_content, current_section_info_list, parent_section_name=None):
    if current_section_info_list is not None:
        # ① 从生成的正文里，用正则把实际用到的引用号提取出来
        references = set(int(x) for x in re.findall(r"\[(\d+)\]", current_section_content))

        # 超出实际材料条数的引用号（模型编的号），直接从正文里删掉
        if references and max(references) > len(current_section_info_list):
            for i in range(len(current_section_info_list), max(references) + 1):
                current_section_content = current_section_content.replace(f"[{i}]", "")
                references.discard(i)

        # ② 只保留正文里真正被引用到的那些材料（没被引用到的材料，即使检索到了也不会进全局引用表）
        index_to_keep = [i - 1 for i in references]
        citation_mapping = self._merge_new_info_to_references(current_section_info_list, index_to_keep)

        # ③ 把正文里的局部编号，替换成全局编号
        current_section_content = ArticleTextProcessing.update_citation_index(current_section_content, citation_mapping)

    # ④ 把清洗、重编号后的正文，解析成子树并插入到文章树里
    article_dict = ArticleTextProcessing.parse_article_into_dict(current_section_content)
    self.insert_or_create_section(article_dict=article_dict, parent_section_name=parent_section_name, ...)
```

`_merge_new_info_to_references`（[storm_dataclass.py:174-207](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:174)）维护着整篇文章唯一一张全局映射表 `self.reference["url_to_unified_index"]`——同一个 URL 如果被多个章节各自引用到，只会占一个全局编号；`update_citation_index`（[utils.py:541-550](reference-projects/storm/knowledge_storm/utils.py:541)）负责把正文里的旧编号替换成新编号，用了一个小技巧防止"边替换边冲突"（比如要把 `[1]`→`[3]`、`[3]`→`[1]` 这种交叉映射时，先把所有旧编号换成 `__PLACEHOLDER_n__` 这种不会跟数字冲突的占位符，等所有旧编号都替换完了，再统一把占位符换成新编号，避免刚写进去的新 `[3]` 被后面的规则又当成旧编号 `[3]` 二次替换）。

**"没被正文引用到的材料，不会进最终引用表"** 这一点值得强调：`retrieve_information` 检索到的材料可能比正文实际引用的要多（检索是"广撒网"，写作时模型不一定用得上全部材料），但 `index_to_keep` 只保留正文里真正出现过引用号的那些——检索到但没被引用的材料，会被悄悄丢弃，不占用全局引用表的位置。

`parse_article_into_dict`（[utils.py:552-593](reference-projects/storm/knowledge_storm/utils.py:552)）用的是跟大纲解析（`from_outline_str`）几乎一样的"单调栈"思路，只是这次除了标题层级，还要顺带把每个标题下面的正文文字收集进 `content` 字段——因为 `WriteSection` 生成的一段文字里本身可能带 `##` 子标题（比如"响应流程"这个大章节，模型可能自己在正文里又细分出"预警与研判"、"人员转移"等子小节），`parse_article_into_dict` 把这整段markdown一次性解析成一棵带内容的子树，再由 `insert_or_create_section` 挂接到文章主树的正确位置上。

---

## 7. 收尾：`post_processing()`

[storm_dataclass.py:502-505](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:502)

```python
def post_processing(self):
    self.prune_empty_nodes()        # 删掉所有内容为空且无子节点的节点（包括被跳过的"引言/结论"节点）
    self.reorder_reference_index()  # 按引用在文中出现的先后顺序，重新给全局引用表编号
```

`reorder_reference_index`（[storm_dataclass.py:374-412](reference-projects/storm/knowledge_storm/storm_wiki/modules/storm_dataclass.py:374)）解决的是另一个由"章节并发生成、之后再顺序合并"带来的问题：即便合并阶段已经把每个章节的局部引用号统一成了全局编号，但**全局编号分配的先后顺序，取决于章节合并进树的顺序**（也就是 `as_completed` 返回结果的顺序，是不确定的），未必等于读者从头读到尾时"第一次遇到某个引用"的顺序。这一步做前序遍历，按内容里出现引用的实际先后顺序重新赋号，保证最终呈现给读者的 `[1][2][3]...` 是严格递增、符合阅读顺序的。

---

## 8. 设计小结：并发的边界划在哪里

这一阶段最值得提炼的一点，是它对"哪里能并发、哪里必须串行"划了一条很清楚的线：

- **可以并发**：每个章节各自"检索 + 生成"的过程——互不依赖、互不通信，谁先跑完谁先交结果。
- **必须串行**：往同一棵文章树上写数据、给全局引用表分配编号——这些操作会修改共享状态，一旦并发执行就会有竞态风险，所以被刻意收敛成"先并发算完所有结果，再单线程逐个合并"两阶段。

跟前两个阶段一样，模型在这里的自由度依然被限制得很窄：`WriteSection` 只被要求"照着给定的材料和大纲，写这一个章节，不要碰别的章节"，它不知道其他章节在写什么，也无法影响引用编号怎么分配、章节合并的顺序——那些全部是外层 Python 代码在掌控。唯一真正需要"智能"的地方，只有"这段材料怎么组织成通顺的段落、引用标注放在哪句话后面"这件事本身。

import { useState } from 'react'
import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

type TabId = 'overview' | 'section' | 'retrieve' | 'write' | 'merge'

const flows = [
  {
    id: 'overview' as const,
    label: '01 · 总流程',
    title: '从大纲树到完整文章',
    description: '阶段三把每个一级章节拆成独立任务：先并发完成“检索 + 写作”，再串行写回同一棵文章树。',
    points: ['先给阶段一的证据池做 embedding', '一级章节之间互不通信，可以并发生成', '最终合并顺序不受线程完成顺序影响'],
    code: `def generate_article(self, topic, information_table, article_with_outline,
                     callback_handler=None):
    # 先把阶段一收集的 snippets 做成可检索的向量池
    information_table.prepare_table_for_retrieval()

    sections_to_write = article_with_outline.get_first_level_section_names()
    section_output_dict_collection = []

    # 每个一级章节提交一个独立任务：检索 + 写作
    with concurrent.futures.ThreadPoolExecutor(
        max_workers=self.max_thread_num
    ) as executor:
        for section_title in sections_to_write:
            # Introduction / Conclusion / Summary 在这里跳过
            if section_title.lower().strip() == "introduction":
                continue
            if section_title.lower().strip().startswith(("conclusion", "summary")):
                continue
            executor.submit(self.generate_section, ...)

    # 所有章节完成后，单线程合并回同一棵文章树
    article = copy.deepcopy(article_with_outline)
    for result in section_output_dict_collection:
        article.update_section(...)
    article.post_processing()
    return article`,
  },
  {
    id: 'section' as const,
    label: '02 · 分章任务',
    title: '一个一级章节 = 一次独立写作任务',
    description: '同一棵大纲子树会被转换成两种形态：纯文本标题列表用于检索，带 # 层级的文本用于指导写作。',
    points: ['section_query：响应流程、人员转移……', 'section_outline：# 响应流程 / ## 人员转移……', '任务只返回结果字典，不直接修改共享文章树'],
    code: `def generate_section(self, topic, section_name, information_table,
                     section_outline, section_query):
    collected_info = []
    if information_table is not None:
        # 用当前章节及其子标题，筛选局部证据
        collected_info = information_table.retrieve_information(
            queries=section_query,
            search_top_k=self.retrieve_top_k,
        )

    # 把局部证据和当前章节交给章节写作模块
    output = self.section_gen(
        topic=topic,
        outline=section_outline,
        section=section_name,
        collected_info=collected_info,
    )
    return {
        "section_name": section_name,
        "section_content": output.section,
        "collected_info": collected_info,
    }`,
  },
  {
    id: 'retrieve' as const,
    label: '03 · 章节检索',
    title: '不是重新联网搜索，而是本地向量复用',
    description: '阶段一已经收集了证据；这里把所有 snippets 向量化，再按当前章节的每个标题做相似度查询。',
    points: ['阶段一：向外搜索，扩大证据池', '阶段三：在证据池内做局部筛选', '每个 query 取 top-k，最后按 URL 去重'],
    code: `def prepare_table_for_retrieval(self):
    self.encoder = SentenceTransformer("paraphrase-MiniLM-L6-v2")
    self.collected_urls, self.collected_snippets = [], []
    for url, information in self.url_to_info.items():
        for snippet in information.snippets:
            self.collected_urls.append(url)
            self.collected_snippets.append(snippet)
    # 全部证据只在这里预先编码一次
    self.encoded_snippets = self.encoder.encode(self.collected_snippets)

def retrieve_information(self, queries, search_top_k):
    selected_urls, selected_snippets = [], []
    for query in queries:
        encoded_query = self.encoder.encode(query)
        similarity = cosine_similarity(
            [encoded_query], self.encoded_snippets
        )[0]
        # 取当前标题最相似的 top-k 条 snippet
        for i in np.argsort(similarity)[-search_top_k:][::-1]:
            selected_urls.append(self.collected_urls[i])
            selected_snippets.append(self.collected_snippets[i])
    return self._group_and_deduplicate(selected_urls, selected_snippets)`,
  },
  {
    id: 'write' as const,
    label: '04 · LLM 写作',
    title: '章节模型只负责把证据写成带引用的正文',
    description: '每个章节独立调用一次 Predict：输入局部证据、页面主题和章节大纲，输出当前章节内容。',
    points: ['证据按本章节从 [1] 开始编号', '最多把 1500 词材料放入 Prompt', '明确禁止模型越界写其他章节'],
    code: `class WriteSection(dspy.Signature):
    """根据收集到的信息撰写一个维基百科章节。
    1. 使用 # / ## / ### 表示章节层级。
    2. 在正文中使用 [1]、[2] 标注引用。
    3. 不要单独撰写参考文献章节。
    """
    info = dspy.InputField(prefix="收集到的信息：\\n")
    topic = dspy.InputField(prefix="页面的主题：")
    section = dspy.InputField(prefix="你需要撰写的章节：")
    output = dspy.OutputField(
        prefix="请撰写带有恰当内联引用的章节内容：\\n"
    )

def forward(self, topic, outline, section, collected_info):
    info = ""
    for idx, storm_info in enumerate(collected_info):
        # 本章节的引用编号从 1 开始，暂时是局部编号
        info += f"[{idx + 1}]\\n" + "\\n".join(storm_info.snippets)
        info += "\\n\\n"
    info = limit_word_count_preserve_newline(info, 1500)
    return self.write_section(
        topic=topic, info=info, section=section
    ).output`,
  },
  {
    id: 'merge' as const,
    label: '05 · 合并收尾',
    title: '局部引用变全局引用，正文回到文章树',
    description: '写作任务结束后，代码负责做模型不应该负责的确定性工作：校正引用、解析 Markdown、合并节点、清理空章节。',
    points: ['删掉模型引用的不存在编号', '只把正文真正引用的材料加入全局引用表', '最后按文章阅读顺序重新编号'],
    code: `def update_section(self, current_section_content,
                    current_section_info_list, parent_section_name=None):
    # 从正文中提取本章节实际使用的局部引用号
    references = set(int(x) for x in re.findall(
        r"\\[(\\d+)\\]", current_section_content
    ))
    # 局部编号 → 全局编号；同一个 URL 只保留一份
    index_to_keep = [i - 1 for i in references]
    mapping = self._merge_new_info_to_references(
        current_section_info_list, index_to_keep
    )
    current_section_content = update_citation_index(
        current_section_content, mapping
    )

    # 把 Markdown 正文解析成子树，挂回当前章节
    article_dict = parse_article_into_dict(current_section_content)
    self.insert_or_create_section(
        article_dict=article_dict,
        parent_section_name=parent_section_name,
    )

def post_processing(self):
    self.prune_empty_nodes()
    self.reorder_reference_index()`,
  },
] as const

export default function Slide07_04ArticleGeneration() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const active = flows.find((flow) => flow.id === activeTab) ?? flows[0]

  return (
    <SlideShell>
      <Eyebrow>STORM 机制四 · 文章生成</Eyebrow>
      <SlideTitle>从大纲到正文：章节并发写作，再串行合并</SlideTitle>
      <Content className="justify-start gap-3">
        <div className="w-full max-w-[1440px] border-l-4 border-accent pl-5">
          <p className="m-0 text-[0.84rem] leading-[1.5] text-ink-2">
            阶段三不是让一个模型一次性写完整篇文章，而是围绕一级章节拆分任务；每个任务自己筛证据、写正文，最后由 Python 代码负责把结果合并回文章树。
          </p>
        </div>

        <div className="flex w-full max-w-[1440px] gap-2" role="tablist" aria-label="文章生成模块">
          {flows.map((flow) => (
            <button
              key={flow.id}
              className={`cursor-pointer rounded-full border px-4 py-2.5 font-mono text-[0.66rem] transition-colors ${
                activeTab === flow.id
                  ? 'border-accent-dim bg-accent-wash font-bold text-accent-deep'
                  : 'border-line bg-panel text-ink-2'
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === flow.id}
              onClick={() => setActiveTab(flow.id)}
            >
              {flow.label}
            </button>
          ))}
        </div>

        <div className="grid w-full max-w-[1440px] grid-cols-[1.12fr_0.88fr] items-start gap-8">
          <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-accent">SOURCE · 基于实际源码裁剪</span>
              <span className="font-mono text-[0.62rem] text-muted">{active.label}</span>
            </div>
            <CodeBlock
              code={active.code}
              fileLabel="storm_wiki/modules/article_generation.py · storm_dataclass.py"
              dense
              className="h-[600px]"
            />
          </section>

          <section className="min-w-0">
            <div className="mb-2 font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">
              {active.title}
            </div>
            <div className="rounded-xl border border-accent-dim bg-accent-wash px-6 py-5">
              <p className="m-0 text-[0.86rem] leading-[1.6] text-ink-2">{active.description}</p>
            </div>
            <div className="mt-5 rounded-xl border border-line bg-panel px-6 py-5">
              <div className="mb-4 font-mono text-[0.64rem] tracking-[0.07em] text-muted">这一段代码明确做了什么</div>
              <div className="flex flex-col gap-3">
                {active.points.map((point, index) => (
                  <div key={point} className="flex items-start gap-3 text-[0.78rem] leading-[1.5] text-ink-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-wash font-mono text-[0.62rem] text-accent-deep">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 border-t border-line pt-4 text-[0.74rem] leading-[1.5] text-muted">
              当前 Tab 展示的是代码真实边界：模型负责局部内容生成，线程调度、证据筛选、引用编号和文章树修改由外层 Python 负责。
            </div>
          </section>
        </div>
      </Content>
    </SlideShell>
  )
}

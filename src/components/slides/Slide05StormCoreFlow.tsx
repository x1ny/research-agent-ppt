import { Caption, CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const stages = [
  {
    num: '01',
    flag: 'do_research',
    method: 'run_knowledge_curation_module()',
    title: '知识整编',
    desc: '多视角角色扮演对话 + 网络检索，收集带来源的证据',
    output: 'conversation_log.json',
  },
  {
    num: '02',
    flag: 'do_generate_outline',
    method: 'run_outline_generation_module()',
    title: '大纲生成',
    desc: '先生成一版先验大纲，再用对话内容精炼',
    output: 'storm_gen_outline.txt',
  },
  {
    num: '03',
    flag: 'do_generate_article',
    method: 'run_article_generation_module()',
    title: '文章生成',
    desc: '按一级章节并发写作，带内联引用编号',
    output: 'storm_gen_article.txt',
  },
  {
    num: '04',
    flag: 'do_polish_article',
    method: 'run_article_polishing_module()',
    title: '文章润色',
    desc: '生成导语段，可选去除跨章节重复内容',
    output: 'storm_gen_article_polished.txt',
  },
] as const

const runCode = `def run(self, topic, do_research=True, do_generate_outline=True,
        do_generate_article=True, do_polish_article=True, ...):

    information_table = None
    if do_research:
        information_table = self.run_knowledge_curation_module(...)

    outline = None
    if do_generate_outline:
        if information_table is None:      # 断点续跑：从磁盘加载上一阶段产物
            information_table = self._load_information_table_from_local_fs(
                os.path.join(self.article_output_dir, "conversation_log.json"))
        outline = self.run_outline_generation_module(information_table, ...)

    draft_article = None
    if do_generate_article:
        if outline is None:
            outline = self._load_outline_from_local_fs(...)
        draft_article = self.run_article_generation_module(outline, information_table, ...)

    if do_polish_article:
        self.run_article_polishing_module(draft_article, remove_duplicate=...)`

export default function Slide05StormCoreFlow() {
  return (
    <SlideShell>
      <Eyebrow>方法论 · STORM 核心流程</Eyebrow>
      <SlideTitle>一次 run()，串起四个阶段</SlideTitle>
      <Content className="justify-start">
        <div className="grid w-full max-w-[1440px] grid-cols-[440px_1fr] items-start gap-14">
          <div className="relative pl-[54px] before:absolute before:top-[8px] before:bottom-[8px] before:left-[22px] before:w-[1.5px] before:bg-line before:content-['']">
            {stages.map((s, i) => (
              <div key={s.num} className={`relative ${i < stages.length - 1 ? 'pb-6' : ''}`}>
                <div
                  className={`absolute top-0 -left-[54px] flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 bg-panel font-mono text-[0.78rem] font-bold ${
                    i === stages.length - 1
                      ? 'border-line-2 text-muted'
                      : 'border-line-2 text-muted'
                  }`}
                >
                  {s.num}
                </div>
                <h4 className="m-0 mb-1 font-display text-[1.06rem]">{s.title}</h4>
                <div className="mb-1.5 font-mono text-[0.66rem] text-accent">
                  {s.flag} <span className="text-line-2">→</span>{' '}
                  <span className="text-ink-2">{s.method}</span>
                </div>
                <p className="m-0 mb-2 text-[0.8rem] leading-[1.5] text-ink-2">{s.desc}</p>
                {/* <div className="inline-block rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[0.62rem] text-muted">
                  → {s.output}
                </div> */}
              </div>
            ))}
          </div>
          <CodeBlock
            code={runCode}
            fileLabel="storm_wiki/engine.py · STORMWikiRunner.run()（节选 L341-441）"
            dense
          />
        </div>
        <Caption className="!mt-15 text-[0.86rem] leading-[1.55]">
          run() 本质是一段<b>确定性 workflow</b>：四个阶段的顺序和跳过逻辑由 Python if/else
          写死，对于比较结构化的任务，这种方案可能更容易得到想要的结果。
        </Caption>
      </Content>
    </SlideShell>
  )
}

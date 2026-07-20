import { Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const inspirations = [
  {
    number: '01',
    title: '先研究，再写作',
    description: '先扩展问题与证据，再组织内容，降低生成的盲目性。',
  },
  {
    number: '02',
    title: '多角色协作',
    description: '把检索、分析、写作、润色拆成边界清晰的专业任务。',
  },
  {
    number: '03',
    title: '大纲驱动生成',
    description: '先确定结构，再分章节展开，让复杂写作变得可控。',
  },
  {
    number: '04',
    title: '结构化工作流',
    description: '将复杂写作拆成研究、规划、生成、润色等连续环节。',
  },
]

const gaps = [
  {
    number: '01',
    title: '偏向研究型写作',
    description: '通用文章流程与公文的政策要求、行文规范仍有距离。',
  },
  {
    number: '02',
    title: '领域适配不足',
    description: '没有充分利用组织内部政策、历史材料和固定文风。',
  },
  {
    number: '03',
    title: '结构约束不够强',
    description: '难以严格覆盖不同文种的格式和必备内容要素。',
  },
  {
    number: '04',
    title: '思维相对陈旧',
    description: 'STORM 诞生于 2024 年，核心仍以固定流程串联 LLM。',
  },
]

function InsightList({
  items,
  tone,
}: {
  items: typeof inspirations
  tone: 'accent' | 'negative'
}) {
  const isNegative = tone === 'negative'

  return (
    <div className="grid grid-cols-2 gap-x-7 gap-y-6">
      {items.map((item) => (
        <div key={item.number} className="flex gap-3.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.58rem] font-bold ${
              isNegative ? 'bg-neg-wash text-neg-deep' : 'bg-accent-wash text-accent-deep'
            }`}
          >
            {item.number}
          </span>
          <div>
            <h3 className="m-0 font-display text-[0.92rem] font-bold text-ink">{item.title}</h3>
            <p className="m-0 mt-2 text-[0.72rem] leading-[1.55] text-ink-2">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Slide08StormInsight() {
  return (
    <SlideShell>
      <Eyebrow>STORM 复盘 · 设计启发</Eyebrow>
      <SlideTitle>从“会研究、会写作”到“公文场景改造”</SlideTitle>
      <Content className="justify-start gap-5">
        <div className="w-full max-w-[1440px] border-l-4 border-accent pl-5">
          <p className="m-0 text-[0.84rem] leading-[1.55] text-ink-2">
            STORM 给我们的价值，不只是一个写作流程，而是一套“拆分任务、组织证据、逐步生成”的 Agent 方法论；但公文场景还需要更强的场景适配。
          </p>
        </div>

        <div className="grid w-full max-w-[1440px] grid-cols-2 gap-5">
          <section className="rounded-xl border border-accent-dim bg-panel px-7 py-6">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-accent">KEEP · METHOD</span>
                <h2 className="m-0 mt-2 font-display text-[1.18rem] font-bold text-ink">STORM 带来的启发</h2>
              </div>
              <span className="rounded-md border border-accent-dim bg-accent-wash px-3 py-2 font-mono text-[0.62rem] text-accent-deep">
                可复用的方法论
              </span>
            </div>
            <InsightList items={inspirations} tone="accent" />
          </section>

          <section className="rounded-xl border border-neg-dim bg-panel px-7 py-6">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-neg-deep">EXTEND · DOMAIN</span>
                <h2 className="m-0 mt-2 font-display text-[1.18rem] font-bold text-ink">面向公文的不足</h2>
              </div>
              <span className="rounded-md border border-neg-dim bg-neg-wash px-3 py-2 font-mono text-[0.62rem] text-neg-deep">
                需要场景化补足
              </span>
            </div>
            <InsightList items={gaps} tone="negative" />
          </section>
        </div>

        <div className="grid w-full max-w-[1440px] grid-cols-[1fr_64px_1fr] items-stretch gap-4 rounded-xl border border-line bg-panel px-6 py-5">
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[0.61rem] tracking-[0.1em] text-muted">STORM METHOD</span>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {['任务拆分', '证据组织', '大纲驱动', '迭代生成'].map((item) => (
                <span key={item} className="rounded-md border border-line bg-panel-2 px-3 py-2 text-[0.7rem] text-ink-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center font-mono text-[1.8rem] text-accent">→</div>
          <div className="border-l border-line pl-6">
            <span className="font-mono text-[0.61rem] tracking-[0.1em] text-accent-deep">OUR OFFICIAL-DOCUMENT AGENT</span>
            <p className="m-0 mt-3 text-[0.82rem] font-bold leading-[1.5] text-ink">
              领域知识底座 <span className="text-muted">·</span> 文种结构约束 <span className="text-muted">·</span> 多Agent协作
            </p>
          </div>
        </div>

        <div className="w-full max-w-[1440px] text-center font-mono text-[0.68rem] text-muted">
          下一步：把 STORM 的通用写作能力，转化为面向公文业务的可控 Agent 流程 ↓
        </div>
      </Content>
    </SlideShell>
  )
}

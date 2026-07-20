import { Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const steps = [
  {
    number: '01',
    title: '生成摘要',
    description: '将文章主题与完整草稿交给 LLM，生成不超过四段的 summary。',
  },
  {
    number: '02',
    title: '可选去重',
    description: '开启 remove_duplicate 后，再调用一次 LLM 删除重复信息。',
  },
  {
    number: '03',
    title: '结构回写',
    description: '解析 Markdown 标题，恢复文章树并重新整理引用编号。',
  },
]

export default function Slide07_05ArticlePolish() {
  return (
    <SlideShell>
      <Eyebrow>STORM 机制四 · 文章润色</Eyebrow>
      <SlideTitle>文章生成之后：补摘要、去重复、稳结构</SlideTitle>
      <Content className="justify-start gap-8">
        <div className="w-full max-w-[1440px] border-l-4 border-accent pl-5">
          <p className="m-0 text-[0.9rem] leading-[1.6] text-ink-2">
            润色模块不重新检索资料，也不从零重写文章；它对已有初稿做轻量后处理，输出更适合作为最终成稿的版本。
          </p>
        </div>

        <div className="flex w-full max-w-[1440px] items-center gap-3">
          <div className="flex-1 rounded-xl border border-line bg-panel px-6 py-7">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-muted">INPUT</div>
            <div className="mt-3 font-display text-[1.25rem] font-bold text-ink">StormArticle 草稿</div>
            <div className="mt-2 text-[0.76rem] text-ink-2">主题 + 完整正文 + 原有引用</div>
          </div>
          <div className="font-mono text-[1.4rem] text-accent">→</div>
          <div className="flex-[1.3] rounded-xl border border-accent-dim bg-accent-wash px-6 py-7">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">POLISH PIPELINE</div>
            <div className="mt-3 font-display text-[1.25rem] font-bold text-ink">LLM 文本处理 + 程序结构恢复</div>
            <div className="mt-2 text-[0.76rem] text-ink-2">模型负责内容编辑，代码负责文章树和引用一致性</div>
          </div>
          <div className="font-mono text-[1.4rem] text-accent">→</div>
          <div className="flex-1 rounded-xl border border-line bg-panel px-6 py-7">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-muted">OUTPUT</div>
            <div className="mt-3 font-display text-[1.25rem] font-bold text-ink">最终文章</div>
            <div className="mt-2 text-[0.76rem] text-ink-2">summary 置顶 · 引用归一化</div>
          </div>
        </div>

        <div className="grid w-full max-w-[1440px] grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="rounded-xl border border-line bg-panel px-6 py-6">
              <div className="font-mono text-[0.72rem] text-accent">{step.number}</div>
              <div className="mt-3 font-display text-[1.12rem] font-bold text-ink">{step.title}</div>
              <p className="mt-3 mb-0 text-[0.78rem] leading-[1.6] text-ink-2">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[1440px] border-t border-line pt-5 font-mono text-[0.78rem] text-muted">
          公文 Agent 的润色方式可能需要更进一步的定制化设计。
        </div>
      </Content>
    </SlideShell>
  )
}

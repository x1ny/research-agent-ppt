import { Chip, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide01Title() {
  return (
    <SlideShell className="items-start justify-center">
      <Eyebrow>技术分享 · 内部预研</Eyebrow>
      <SlideTitle as="h1" className="text-[82px]">
        公文写作 Agent
      </SlideTitle>
      <HeadRule />
      <p className="m-0 mb-2 max-w-[62ch] text-[33.6px] leading-[1.7] text-ink-dim">
        技术探索与整体设计思路
      </p>
      <div className="mt-14 flex flex-wrap gap-6">
        <Chip variant="slate">汇报人 · ___</Chip>
        <Chip variant="slate">团队 · ___</Chip>
        <Chip variant="slate">2026</Chip>
      </div>
    </SlideShell>
  )
}

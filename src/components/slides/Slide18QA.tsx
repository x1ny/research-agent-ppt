import { Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide18QA() {
  return (
    <SlideShell style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
      <Eyebrow>谢谢</Eyebrow>
      <SlideTitle style={{ fontSize: '68px' }}>Q&A</SlideTitle>
      <HeadRule />
      <p className="m-0 mb-2 max-w-[62ch] text-[31.2px] leading-[1.7] text-ink-dim">欢迎提问与讨论</p>
    </SlideShell>
  )
}

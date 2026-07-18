import { Eyebrow, SlideShell, SlideTitle } from '../ui'

export default function Slide19QA() {
  return (
    <SlideShell style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
      <Eyebrow>谢谢</Eyebrow>
      <SlideTitle style={{ fontSize: '68px' }}>Q&A</SlideTitle>
      <p className="m-0 mb-2 max-w-[62ch] text-[31.2px] leading-[1.7] text-ink-2">欢迎提问与讨论</p>
    </SlideShell>
  )
}

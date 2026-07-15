import { Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide16NextResearch() {
  return (
    <SlideShell>
      <Eyebrow>收尾 · 上</Eyebrow>
      <SlideTitle>交给下一棒：润色与格式渲染</SlideTitle>
      <HeadRule />
      <Content>
        <div className="flex w-full flex-wrap gap-12">
          <div className="min-w-[280px] flex-1 rounded-[10px] border border-line border-l-[3px] border-l-dashed border-l-seal bg-bg-card px-[52px] py-12">
            <div className="font-mono text-[0.82rem] font-semibold text-ink-dim">NEXT → 润色 Agent</div>
            <h3 className="my-5 font-display text-[1.35rem]">生成 - 评审循环</h3>
            <p className="m-0 text-[1.02rem] leading-[1.75] text-ink-dim">
              评审 agent 按语体规范、句式凝练等维度挑问题，参照范文库的同类表述做"有据可依"的润色，而非凭感觉改写。
            </p>
          </div>
          <div className="min-w-[280px] flex-1 rounded-[10px] border border-line border-l-[3px] border-l-dashed border-l-bronze bg-bg-card px-[52px] py-12">
            <div className="font-mono text-[0.82rem] font-semibold text-ink-dim">NEXT → 格式渲染引擎</div>
            <h3 className="my-5 font-display text-[1.35rem]">确定性排版，非 LLM</h3>
            <p className="m-0 text-[1.02rem] leading-[1.75] text-ink-dim">
              docxtpl / python-docx，按 GB/T 9704-2012 处理版头、字体、层次序数——排版这件事，不交给模型自由发挥。
            </p>
          </div>
        </div>
      </Content>
    </SlideShell>
  )
}

import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide02WhyNotBareModel() {
  return (
    <SlideShell>
      <Eyebrow>问题 · 01</Eyebrow>
      <SlideTitle>为什么不能直接让"裸模型"写公文</SlideTitle>
      <HeadRule />
      <Content>
        <div className="grid w-full max-w-[1200px] grid-cols-2 gap-10">
          <div className="flex items-start gap-9 rounded-[10px] border border-line bg-bg-card px-12 py-11">
            <div className="shrink-0 font-display text-[2.2rem] font-bold leading-none text-seal">01</div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 mb-3 font-display text-[1.15rem]">事实幻觉</h3>
              <p className="m-0 text-[0.95rem] leading-[1.7] text-ink-dim">
                编造政策文号、编造数据、张冠李戴的部门职责。公文里的"合理编造"是<b className="text-seal">事故</b>，不是瑕疵。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-9 rounded-[10px] border border-line bg-bg-card px-12 py-11">
            <div className="shrink-0 font-display text-[2.2rem] font-bold leading-none text-seal">02</div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 mb-3 font-display text-[1.15rem]">格式与文种刚性</h3>
              <p className="m-0 text-[0.95rem] leading-[1.7] text-ink-dim">
                GB/T 9704-2012 版头、字体、层次序数，15 种法定文种各行文方向与惯用语——文种用错，文件直接作废。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-9 rounded-[10px] border border-line bg-bg-card px-12 py-11">
            <div className="shrink-0 font-display text-[2.2rem] font-bold leading-none text-seal">03</div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 mb-3 font-display text-[1.15rem]">文风偏离</h3>
              <p className="m-0 text-[0.95rem] leading-[1.7] text-ink-dim">
                公文要求庄重、简洁、规范，裸模型输出易口语化、冗长拖沓，语气基调与机关行文语体差距明显。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-9 rounded-[10px] border border-line bg-bg-card px-12 py-11">
            <div className="shrink-0 font-display text-[2.2rem] font-bold leading-none text-seal">04</div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 mb-3 font-display text-[1.15rem]">长文失控</h3>
              <p className="m-0 text-[0.95rem] leading-[1.7] text-ink-dim">
                直接生成长文时，模型缺乏对全文结构的整体把控，容易出现前後矛盾、重复啰嗦、主题漂移。
              </p>
            </div>
          </div>
        </div>
        <Caption className="mt-[60px]">
          结论 → 公文写作是一件基于严格的规则的一连串复杂的任务，必须有<b>Agent</b>的能力才能完成。
        </Caption>
      </Content>
    </SlideShell>
  )
}

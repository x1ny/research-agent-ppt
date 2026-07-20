import { Caption, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

export default function Slide14KbRounds() {
  return (
    <SlideShell>
      <Eyebrow>环节三 · 下</Eyebrow>
      <SlideTitle>大纲即方向盘 —— 与用户协同确认</SlideTitle>
      <Content>
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          <div className="flex items-center gap-4 border-b border-line px-8 py-6">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 font-mono text-[0.82rem] text-ink-2">大纲编辑器 · 待确认</span>
          </div>
          <div className="flex min-h-[230px]">
            <div className="w-[38%] border-r border-line p-9">
              <div className="mb-2.5 flex items-center gap-[18px] rounded-lg px-[11px] py-[9px] text-[0.98rem] text-ink-2">
                <span className="font-mono text-[0.85rem] text-ink-2 opacity-50">⋮⋮</span> 一、检查背景与依据
              </div>
              <div className="mb-2.5 flex items-center gap-[18px] rounded-lg border border-accent-dim bg-accent-wash px-[11px] py-[9px] text-[0.98rem] font-semibold text-ink">
                <span className="font-mono text-[0.85rem] text-ink-2 opacity-50">⋮⋮</span> 二、检查范围与内容
              </div>
              <div className="mb-2.5 flex items-center gap-[18px] rounded-lg px-[11px] py-[9px] text-[0.98rem] text-ink-2">
                <span className="font-mono text-[0.85rem] text-ink-2 opacity-50">⋮⋮</span> 三、组织实施
              </div>
              <div className="mb-2.5 flex items-center gap-[18px] rounded-lg px-[11px] py-[9px] text-[0.98rem] text-ink-2">
                <span className="font-mono text-[0.85rem] text-ink-2 opacity-50">⋮⋮</span> 四、工作要求
              </div>
            </div>
            <div className="flex-1 p-9">
              <div className="mb-3.5 mt-7 font-mono text-[0.76rem] uppercase tracking-[0.08em] text-ink-2">
                本段要点
              </div>
              <div className="mb-2.5 rounded-lg border border-line bg-bg px-[13px] py-[11px] text-[0.96rem] text-ink">
                明确检查对象、重点内容、执行方式与整改要求
              </div>
              <div className="mb-3.5 mt-7 font-mono text-[0.76rem] uppercase tracking-[0.08em] text-ink-2">
                子章节
              </div>
              <div className="flex items-center gap-4 py-2.5 text-[0.94rem]">（一）检查单位范围</div>
              <div className="flex items-center gap-4 py-2.5 text-[0.94rem]">（二）重点检查内容</div>
              <div className="flex items-center gap-4 py-2.5 text-[0.94rem]">（三）检查方式与标准</div>
              <div className="flex items-center gap-4 py-2.5 text-[0.94rem]">（四）问题整改与闭环</div>
            </div>
          </div>
        </div>
        <Caption>
          大纲错了，写得越细返工越大 → 设强制关卡，用户确认/编辑后才进入写作。
        </Caption>
      </Content>
    </SlideShell>
  )
}

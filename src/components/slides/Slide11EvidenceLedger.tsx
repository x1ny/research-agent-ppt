import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide11EvidenceLedger() {
  return (
    <SlideShell>
      <Eyebrow>环节二 · 检索与范文</Eyebrow>
      <SlideTitle>查询改写 —— 把用户意图翻译成检索任务</SlideTitle>
      <HeadRule />
      <Content>
        <div className="grid w-full max-w-[1500px] grid-cols-[1.05fr_34px_1.1fr_34px_1.35fr_34px_1.2fr] items-stretch gap-3">
          <div className="min-h-[320px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card p-[22px]">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              01 · User Intent
            </div>
            <h3 className="my-2 mb-3 font-display text-[1.12rem]">用户原话</h3>
            <div className="mt-4 border-l-[3px] border-l-slate bg-slate-tint px-4 py-3.5 font-display text-[0.92rem] leading-[1.65]">
              请写一份全市防汛工作方案。
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                文种不明确
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                主题明确
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                缺少结构要求
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center text-[1.45rem] text-bronze">→</div>
          <div className="min-h-[320px] rounded-[10px] border border-line border-l-4 border-l-bronze bg-bg-card-2 p-[22px]">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              02 · Task Parsing
            </div>
            <h3 className="my-2 mb-3 font-display text-[1.12rem]">任务理解</h3>
            <p className="m-0 text-[0.8rem] leading-[1.55] text-ink-dim">
              先把自然语言拆成检索时需要的关键维度：
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                文种：工作方案
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                主题：防汛
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                范围：全市
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                目标：部署任务
              </span>
              <span className="rounded-full border border-line bg-[rgba(255,255,255,0.3)] px-[9px] py-1.5 text-[0.68rem] text-slate">
                需找：依据 / 分工 / 响应 / 保障
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center text-[1.45rem] text-bronze">→</div>
          <div className="min-h-[320px] rounded-[10px] border border-line border-l-4 border-l-seal bg-bg-card p-[22px]">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              03 · Query Rewrite
            </div>
            <h3 className="my-2 mb-3 font-display text-[1.12rem]">生成多路检索式</h3>
            <div className="mt-3.5 flex flex-col gap-2">
              <div className="rounded-md bg-seal-tint px-[11px] py-[9px] font-mono text-[0.68rem] leading-[1.35] text-ink">
                <span className="text-seal">⌕ </span>防汛 工作方案 责任分工
              </div>
              <div className="rounded-md bg-seal-tint px-[11px] py-[9px] font-mono text-[0.68rem] leading-[1.35] text-ink">
                <span className="text-seal">⌕ </span>防汛应急预案 响应等级 乡镇职责
              </div>
              <div className="rounded-md bg-seal-tint px-[11px] py-[9px] font-mono text-[0.68rem] leading-[1.35] text-ink">
                <span className="text-seal">⌕ </span>防汛工作方案 保障措施 组织领导
              </div>
              <div className="rounded-md bg-seal-tint px-[11px] py-[9px] font-mono text-[0.68rem] leading-[1.35] text-ink">
                <span className="text-seal">⌕ </span>同类工作方案 结构 范文
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-[1.45rem] text-bronze">→</div>
          <div className="min-h-[320px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card p-[22px]">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              04 · Select Sources
            </div>
            <h3 className="my-2 mb-3 font-display text-[1.12rem]">筛选材料</h3>
            <p className="m-0 text-[0.8rem] leading-[1.55] text-ink-dim">
              合并多路结果，保留相关且可引用的材料。
            </p>
            <div className="mt-3 rounded-[7px] border border-line-soft px-3 py-2.5 text-[0.72rem] leading-[1.4]">
              <strong className="mb-0.5 block text-[0.74rem] text-ink">现行防汛应急预案</strong>
              <span className="font-mono text-[0.58rem] text-ink-dim">政策依据 · 职责分工 · 可回溯</span>
            </div>
            <div className="mt-2.5 rounded-[7px] border border-line-soft px-2.5 py-2 text-[0.72rem] leading-[1.4]">
              <strong className="mb-0.5 block text-[0.74rem] text-ink">XX市防汛工作方案</strong>
              <span className="font-mono text-[0.58rem] text-ink-dim">同文种 · 结构参考</span>
            </div>
            <div className="mt-2.5 flex items-start gap-2 border-b-0 py-0 text-[0.66rem] leading-[1.4]">
              <b className="shrink-0 text-bronze">出处</b>
              <span>文件名 · 文号 · 原文片段</span>
            </div>
          </div>
        </div>
        <Caption>
          查询改写只负责找到更相关的材料；假设摘要或改写结果不能作为事实依据，最终写作仍必须回到原文和引用。
        </Caption>
      </Content>
    </SlideShell>
  )
}

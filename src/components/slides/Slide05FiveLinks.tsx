import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide05FiveLinks() {
  return (
    <SlideShell>
      <Eyebrow>STORM 机制一</Eyebrow>
      <SlideTitle>视角引导提问</SlideTitle>
      <HeadRule />
      <Content className="justify-start gap-6">
        <div className="grid w-full max-w-[1400px] grid-cols-[1fr_38px_1.15fr_38px_1fr] items-stretch">
          <div className="min-h-[214px] rounded-[10px] border border-line border-l-4 border-l-accent-dim bg-panel px-[26px] py-[22px]">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-ink-2 uppercase">
              01 · 先找”同类文章”
            </div>
            <h3 className="my-2 mb-2 font-display text-[1.2rem]">相似主题文章</h3>
            <p className="mb-3.5 text-[0.82rem] leading-normal text-ink-2">
              不直接检索答案，而是先观察”这类文章通常怎么写”。
            </p>
            <div className="flex flex-col gap-[7px]">
              <div className="flex items-center gap-2.5 rounded-md border border-line-soft bg-[rgba(255,255,255,0.28)] px-2.5 py-2 text-[0.78rem]">
                <span className="font-mono text-[0.68rem] text-accent-dim">DOC</span>
                <span>同主题文章 A · 工作方案</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-md border border-line-soft bg-[rgba(255,255,255,0.28)] px-2.5 py-2 text-[0.78rem]">
                <span className="font-mono text-[0.68rem] text-accent-dim">DOC</span>
                <span>同主题文章 B · 专项报告</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-md border border-line-soft bg-[rgba(255,255,255,0.28)] px-2.5 py-2 text-[0.78rem]">
                <span className="font-mono text-[0.68rem] text-accent-dim">DOC</span>
                <span>同主题文章 C · 政策解读</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-ink-2 opacity-70">
            <svg className="h-[30px] w-[30px]">
              <use href="#ic-ar" />
            </svg>
          </div>
          <div className="min-h-[214px] rounded-[10px] border border-line border-l-4 border-l-accent bg-panel-2 px-[26px] py-[22px]">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-ink-2 uppercase">
              02 · 提取结构先验
            </div>
            <h3 className="my-2 mb-2 font-display text-[1.2rem]">从目录归纳覆盖维度</h3>
            <p className="mb-3.5 text-[0.82rem] leading-normal text-ink-2">
              TOC（Table of Contents）是前人对”应该覆盖什么”的结构化共识。
            </p>
            <div className="flex flex-col gap-0 border-t border-dashed border-line">
              <div className="flex items-center gap-2.5 border-b border-dashed border-line-soft py-[7px] text-[0.8rem]">
                <span className="w-[26px] font-mono text-[0.7rem] text-accent">01</span>
                <span>背景与政策依据</span>
                <span className="ml-auto font-mono text-[0.64rem] text-ink-2">共现 3/3</span>
              </div>
              <div className="flex items-center gap-2.5 border-b border-dashed border-line-soft py-[7px] text-[0.8rem]">
                <span className="w-[26px] font-mono text-[0.7rem] text-accent">02</span>
                <span>目标与重点任务</span>
                <span className="ml-auto font-mono text-[0.64rem] text-ink-2">共现 3/3</span>
              </div>
              <div className="flex items-center gap-2.5 border-b border-dashed border-line-soft py-[7px] text-[0.8rem]">
                <span className="w-[26px] font-mono text-[0.7rem] text-accent">03</span>
                <span>执行分工与保障</span>
                <span className="ml-auto font-mono text-[0.64rem] text-ink-2">共现 2/3</span>
              </div>
              <div className="flex items-center gap-2.5 border-b border-dashed border-line-soft py-[7px] text-[0.8rem]">
                <span className="w-[26px] font-mono text-[0.7rem] text-accent">04</span>
                <span>风险与评估机制</span>
                <span className="ml-auto font-mono text-[0.64rem] text-ink-2">归纳</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-ink-2 opacity-70">
            <svg className="h-[30px] w-[30px]">
              <use href="#ic-ar" />
            </svg>
          </div>
          <div className="min-h-[214px] rounded-[10px] border border-line border-l-4 border-l-accent-deep bg-panel px-[26px] py-[22px]">
            <div className="font-mono text-[0.68rem] tracking-[0.08em] text-ink-2 uppercase">
              03 · 视角驱动提问
            </div>
            <h3 className="my-2 mb-2 font-display text-[1.2rem]">把结构变成提问角色</h3>
            <p className="mb-3.5 text-[0.82rem] leading-normal text-ink-2">
              每个视角独立提问，避免单一角度越问越窄。
            </p>
            <div className="flex flex-wrap gap-[9px]">
              <span className="rounded-full border border-line-2 bg-panel-3 px-[11px] py-[7px] text-[0.73rem] text-muted">
                基础事实
              </span>
              <span className="rounded-full border border-line-2 bg-panel-3 px-[11px] py-[7px] text-[0.73rem] text-muted">
                政策依据
              </span>
              <span className="rounded-full border border-line-2 bg-panel-3 px-[11px] py-[7px] text-[0.73rem] text-muted">
                执行职责
              </span>
              <span className="rounded-full border border-line-2 bg-panel-3 px-[11px] py-[7px] text-[0.73rem] text-muted">
                影响与争议
              </span>
              <span className="rounded-full border border-line-2 bg-panel-3 px-[11px] py-[7px] text-[0.73rem] text-muted">
                风险合规
              </span>
            </div>
          </div>
        </div>
        <div className="grid w-full max-w-[1400px] grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-[10px] border border-line bg-panel px-6 py-[18px] text-center">
            <h4 className="m-0 mb-2.5 font-display text-[0.98rem]">从目录提炼提问角度</h4>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[0.7rem] text-ink-2">
              <b className="font-semibold text-accent-deep">目录反复出现”执行分工”</b>
              <span className="font-bold text-accent-dim">→</span>
              <b className="font-semibold text-accent-deep">执行职责视角</b>
              <span className="font-bold text-accent-dim">→</span>
              <span>谁负责？如何分工？权限边界是什么？</span>
            </div>
          </div>
          <div className="rounded-[10px] border border-line bg-panel px-6 py-[18px]">
            <h4 className="m-0 mb-2.5 font-display text-[0.98rem]">公文场景的改造</h4>
            <div className="flex items-start gap-2 text-[0.76rem] leading-[1.45] text-ink-2">
              <b className="shrink-0 text-muted">静态</b>
              <span>文种级视角库：政策、任务、分工、保障、合规</span>
            </div>
            <div className="mt-2 flex items-start gap-2 text-[0.76rem] leading-[1.45] text-ink-2">
              <b className="shrink-0 text-muted">动态</b>
              <span>范文补充主题特有视角：如防汛响应分级</span>
            </div>
          </div>
        </div>
        <Caption className="m-0 max-w-[76ch] text-center">
          好问题不是凭空生成的，而是由“相似文章的结构先验 + 多视角角色 + 检索结果”共同驱动。
        </Caption>
      </Content>
    </SlideShell>
  )
}

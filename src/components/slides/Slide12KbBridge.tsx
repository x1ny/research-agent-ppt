import { Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide12KbBridge() {
  return (
    <SlideShell>
      <Eyebrow>环节三 · 上</Eyebrow>
      <SlideTitle>范文解析：从成文样本提取结构骨架</SlideTitle>
      <HeadRule />
      <Content>
        <div className="grid w-full max-w-[1480px] grid-cols-[1.12fr_1fr_1fr] items-stretch gap-6">
          <div className="min-h-[470px] rounded-[10px] border border-line bg-bg-card px-[26px] py-6">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              01 · Source Sample
            </div>
            <h3 className="my-2 mb-[18px] font-display text-[1.18rem]">范文原文</h3>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                开头
              </span>
              <p className="m-0 font-display text-[0.88rem] leading-[1.6] text-ink">
                为进一步规范辖区消防安全检查工作，根据……有关规定，现将有关事项通知如下：
              </p>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                主体
              </span>
              <p className="m-0 font-display text-[0.88rem] leading-[1.6] text-ink">
                一、检查范围。本次检查覆盖……
                <br />
                二、检查内容。重点核查消防设施完好率、疏散通道畅通情况……
              </p>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                结尾
              </span>
              <p className="m-0 font-display text-[0.88rem] leading-[1.6] text-ink">
                请各单位对照上述要求抓紧自查，逾期未整改的将依法处置。特此通知。
              </p>
            </div>
          </div>
          <div className="min-h-[470px] rounded-[10px] border border-line border-t-4 border-t-bronze bg-bg-card-2 px-[26px] py-6">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              02 · Structural Analysis
            </div>
            <h3 className="my-2 mb-[18px] font-display text-[1.18rem]">段落功能</h3>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                开头功能
              </span>
              <p className="m-0 text-[0.82rem] leading-[1.6] text-ink">目的说明 + 政策依据 + 发文动作</p>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                主体关系
              </span>
              <p className="m-0 text-[0.82rem] leading-[1.6] text-ink">范围 → 内容 → 执行要求</p>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                结尾功能
              </span>
              <p className="m-0 text-[0.82rem] leading-[1.6] text-ink">提出执行要求 + 施加责任约束 + 结束语</p>
            </div>
          </div>
          <div className="min-h-[470px] rounded-[10px] border border-line border-t-4 border-t-seal bg-bg-card px-[26px] py-6">
            <div className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-dim uppercase">
              03 · Reusable Skeleton
            </div>
            <h3 className="my-2 mb-[18px] font-display text-[1.18rem]">可复用结构骨架</h3>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                开头骨架
              </span>
              <div className="rounded-[7px] border border-[rgba(166,51,42,0.2)] bg-[rgba(166,51,42,0.05)] px-3 py-2.5 font-display text-[0.84rem] leading-[1.55] text-ink">
                为进一步[工作目的]，根据[政策依据]，现将[事项]通知如下：
              </div>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                主体骨架
              </span>
              <div className="rounded-[7px] border border-[rgba(166,51,42,0.2)] bg-[rgba(166,51,42,0.05)] px-3 py-2.5 font-display text-[0.84rem] leading-[1.55] text-ink">
                一、[适用范围]
                <br />
                二、[重点任务 / 检查内容]
                <br />
                三、[工作要求]
              </div>
            </div>
            <div className="border-b border-dashed border-line-soft py-3.5 last:border-b-0">
              <span className="mb-[7px] inline-block rounded-full bg-seal-tint px-2 py-1 font-mono text-[0.62rem] text-seal">
                结尾骨架
              </span>
              <div className="rounded-[7px] border border-[rgba(166,51,42,0.2)] bg-[rgba(166,51,42,0.05)] px-3 py-2.5 font-display text-[0.84rem] leading-[1.55] text-ink">
                请[执行对象]按照[依据]抓好落实。[责任约束]。特此通知。
              </div>
            </div>
          </div>
        </div>
        <p className="mt-[22px] text-center text-[0.82rem] leading-[1.6] text-ink-dim">
          范文提供的是结构证据，不是可直接复制的文字。
          <br />
          <b className="font-bold text-ink">范文原文 → 段落功能 → 可复用结构骨架 → 新主题大纲</b>
        </p>
      </Content>
    </SlideShell>
  )
}

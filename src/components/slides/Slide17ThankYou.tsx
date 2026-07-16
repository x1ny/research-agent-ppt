import { Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide17ThankYou() {
  return (
    <SlideShell>
      <Eyebrow>收尾 · 下</Eyebrow>
      <SlideTitle>下一步值得研究的方向</SlideTitle>
      <HeadRule />
      <Content>
        <div className="grid w-full max-w-[1480px] grid-cols-4 gap-6 pt-7">
          <div className="relative min-w-0 max-w-none -rotate-[1.6deg] translate-y-1.5 rounded border border-line bg-panel px-[30px] py-[34px] shadow-[0_8px_18px_rgba(17,26,43,0.10)] before:absolute before:-top-[7px] before:left-1/2 before:h-[11px] before:w-[11px] before:-translate-x-1/2 before:rounded-full before:bg-accent before:shadow-[0_1px_3px_rgba(0,0,0,0.3)] before:content-['']">
            <div className="font-mono text-[0.82rem] font-bold text-accent-deep">01 / 业务认知</div>
            <h3 className="my-[18px] mb-3.5 font-display text-[1.15rem]">先弄清楚公文到底怎么写</h3>
            <p className="m-0 text-[0.82rem] leading-[1.65] text-ink-2">
              目前的设计仍然停留在想象层面。下一步要从真实公文和真实工作场景出发，弄清楚一份公文为什么要写、需要写哪些内容、由谁参与，以及从起草到审核、签发、流转的完整业务流程。
            </p>
          </div>
          <div className="relative min-w-0 max-w-none rotate-[1.1deg] -translate-y-1.5 rounded border border-line bg-panel px-[30px] py-[34px] shadow-[0_8px_18px_rgba(17,26,43,0.10)] before:absolute before:-top-[7px] before:left-1/2 before:h-[11px] before:w-[11px] before:-translate-x-1/2 before:rounded-full before:bg-accent before:shadow-[0_1px_3px_rgba(0,0,0,0.3)] before:content-['']">
            <div className="font-mono text-[0.82rem] font-bold text-accent-deep">02 / 框架吸收</div>
            <h3 className="my-[18px] mb-3.5 font-display text-[1.15rem]">持续学习新框架</h3>
            <p className="m-0 text-[0.82rem] leading-[1.65] text-ink-2">
              STORM 是很好的入门，但不应成为终点。持续跟踪 Research Agent、Deep Research、RAG 与协作式写作等新项目和新理念，吸收可迁移的机制。
            </p>
          </div>
          <div className="relative min-w-0 max-w-none -rotate-[0.9deg] translate-y-2 rounded border border-line bg-panel px-[30px] py-[34px] shadow-[0_8px_18px_rgba(17,26,43,0.10)] before:absolute before:-top-[7px] before:left-1/2 before:h-[11px] before:w-[11px] before:-translate-x-1/2 before:rounded-full before:bg-accent before:shadow-[0_1px_3px_rgba(0,0,0,0.3)] before:content-['']">
            <div className="font-mono text-[0.82rem] font-bold text-accent-deep">03 / 交互设计</div>
            <h3 className="my-[18px] mb-3.5 font-display text-[1.15rem]">让用户参与并掌握方向</h3>
            <p className="m-0 text-[0.82rem] leading-[1.65] text-ink-2">
              交互不为炫技，而是让用户能参与取舍、操控方向、核验来源，减少 Agent 自行生成造成的错误，也让最终结果更有把握和信任感。
            </p>
          </div>
          <div className="relative min-w-0 max-w-none rotate-[1.3deg] -translate-y-1 rounded border border-line bg-panel px-[30px] py-[34px] shadow-[0_8px_18px_rgba(17,26,43,0.10)] before:absolute before:-top-[7px] before:left-1/2 before:h-[11px] before:w-[11px] before:-translate-x-1/2 before:rounded-full before:bg-accent before:shadow-[0_1px_3px_rgba(0,0,0,0.3)] before:content-['']">
            <div className="font-mono text-[0.82rem] font-bold text-accent-deep">04 / Agent 协作</div>
            <h3 className="my-[18px] mb-3.5 font-display text-[1.15rem]">设计 Agent 之间的分工</h3>
            <p className="m-0 text-[0.82rem] leading-[1.65] text-ink-2">
              明确知识库、检索、写作、审校和格式渲染 Agent 的边界、交接协议与冲突处理，避免多个 Agent 只是叠加调用。
            </p>
          </div>
        </div>
      </Content>
    </SlideShell>
  )
}

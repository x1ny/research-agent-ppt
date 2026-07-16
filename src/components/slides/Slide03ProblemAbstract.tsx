import {
  Caption,
  Chip,
  Content,
  Eyebrow,
  FlowNode,
  HeadRule,
  SlideShell,
  SlideTitle,
} from '../ui'

export default function Slide03ProblemAbstract() {
  return (
    <SlideShell>
      <Eyebrow>问题 · 02</Eyebrow>
      <SlideTitle>没有对口方案，我们做了一次"问题抽象"</SlideTitle>
      <HeadRule />
      <Content className="translate-y-5">
        <div className="flex w-full flex-col flex-nowrap items-center justify-center gap-3">
          <FlowNode
            accent="dim"
            title={<span className="text-base">表面任务：公文写作</span>}
            subtitle={<span className="text-[0.76rem] leading-[1.45]">强规则 · 强事实 · 强结构</span>}
            className="min-w-[240px] shrink grow-0 basis-auto px-5 py-[18px] text-center"
          />
          <div className="shrink-0 text-ink-2 opacity-75">
            <svg className="block h-6 w-6">
              <use href="#ic-ad" />
            </svg>
          </div>
          <FlowNode
            title={<span className="text-base">核心难点：不是“写”，而是“组织”</span>}
            subtitle={
              <span className="text-[0.76rem] leading-[1.45]">检索信息、搭建大纲、控制事实、分段生成</span>
            }
            className="min-w-[290px] shrink grow-0 basis-auto px-5 py-[18px] text-center"
          />
          <div className="shrink-0 text-ink-2 opacity-75">
            <svg className="block h-6 w-6">
              <use href="#ic-ad" />
            </svg>
          </div>
          <Chip variant="gold" className="px-2.5 py-2 text-[0.76rem]">
            问题抽象 / 类比迁移
          </Chip>
          <div className="shrink-0 text-ink-2 opacity-75">
            <svg className="block h-6 w-6">
              <use href="#ic-ad" />
            </svg>
          </div>
          <FlowNode
            accent="gold"
            title={<span className="text-base">技术借鉴：Research Agent</span>}
            subtitle={
              <span className="text-[0.76rem] leading-[1.45]">检索增强 · 知识整编 · 结构化长文生成</span>
            }
            className="min-w-[290px] shrink grow-0 basis-auto px-5 py-[18px] text-center"
          />
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-6">
          <Chip variant="slate">先检索、后动笔</Chip>
          <Chip variant="slate">大纲驱动生成</Chip>
          <Chip variant="slate">事实可溯源</Chip>
          <Chip variant="slate">多视角补充信息</Chip>
          <Chip variant="slate">按章节逐步生成</Chip>
        </div>
        <Caption className="mx-auto max-w-[60ch] text-center">
          公文写作在方法论层面，本质是“检索增强的结构化长文生成”——因此我们把研究对象从“公文专属工具”，转向了 Research Agent 这条更成熟的技术脉络。
        </Caption>
      </Content>
    </SlideShell>
  )
}

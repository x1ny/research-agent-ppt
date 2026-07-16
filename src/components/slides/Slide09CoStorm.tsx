import { Caption, Content, Eyebrow, FlowNode, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide09CoStorm() {
  return (
    <SlideShell>
      <Eyebrow>整体流程</Eyebrow>
      <SlideTitle>五个环节：从材料到成文</SlideTitle>
      <HeadRule />
      <Content>
        <div className="flex w-full flex-wrap items-center gap-8">
          <FlowNode accent="dim" title="① 建立公文知识库" subtitle="内容 · 结构 · 来源" />
          <div className="flex-none text-ink-2 opacity-75">
            <svg className="block h-11 w-11">
              <use href="#ic-ar" />
            </svg>
          </div>
          <FlowNode accent="dim" title="② 检索材料与范文" subtitle="混合检索 · 查询改写" />
          <div className="flex-none text-ink-2 opacity-75">
            <svg className="block h-11 w-11">
              <use href="#ic-ar" />
            </svg>
          </div>
          <FlowNode accent="gold" title="③ 范文解析与层级大纲" subtitle="结构提炼 · 用户确认" />
          <div className="flex-none text-ink-2 opacity-75">
            <svg className="block h-11 w-11">
              <use href="#ic-ar" />
            </svg>
          </div>
          <FlowNode accent="gold" title="④ 多视角检索与证据整编" subtitle="引用片段 · 证据核对" />
          <div className="flex-none text-ink-2 opacity-75">
            <svg className="block h-11 w-11">
              <use href="#ic-ar" />
            </svg>
          </div>
          <FlowNode accent="deep" title="⑤ 分段写作与质量检查" subtitle="评审 · 润色 · 格式渲染" />
        </div>
        <Caption>
          大纲决定需要覆盖什么，检索提供可引用的依据，写作只负责把已组织好的材料变成文章。
        </Caption>
      </Content>
    </SlideShell>
  )
}

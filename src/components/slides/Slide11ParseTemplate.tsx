import { Caption, Chip, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

export default function Slide11ParseTemplate() {
  return (
    <SlideShell>
      <Eyebrow>环节一 · 知识底座</Eyebrow>
      <SlideTitle>公文库搭建</SlideTitle>
      <Content>
        <div className="relative max-w-[640px] pl-[60px] before:absolute before:top-[6px] before:bottom-[6px] before:left-[9px] before:w-[1.5px] before:bg-line before:content-['']">
          <div className="relative pb-14 before:absolute before:-left-[30px] before:top-[3px] before:h-3 before:w-3 before:rounded-full before:border-[2.5px] before:border-line-2 before:bg-panel before:content-['']">
            <div className="mb-2.5 text-[1.1rem] font-bold">收集公文</div>
            <div className="text-[0.95rem] leading-[1.6] text-ink-2">
              汇集政策文件、历史公文和不同文种的代表性范文
            </div>
          </div>
          <div className="relative pb-14 before:absolute before:-left-[30px] before:top-[3px] before:h-3 before:w-3 before:rounded-full before:border-[2.5px] before:border-line-2 before:bg-panel before:content-['']">
            <div className="mb-2.5 text-[1.1rem] font-bold">解析内容与结构</div>
            <div className="text-[0.95rem] leading-[1.6] text-ink-2">
              识别主题、要点、标题层级和段落组织方式，原文始终保留
            </div>
          </div>
          <div className="relative pb-14 before:absolute before:-left-[30px] before:top-[3px] before:h-3 before:w-3 before:rounded-full before:border-[2.5px] before:border-accent before:bg-panel before:content-['']">
            <div className="mb-2.5 text-[1.1rem] font-bold">形成可复用知识资产</div>
            <div className="mt-5 flex flex-wrap gap-5">
              <Chip variant="dim" withDot>
                内容摘要库 · 供语义检索
              </Chip>
              <Chip variant="gold" withDot>
                结构骨架库 · 供大纲解析
              </Chip>
              <Chip variant="slate" withDot>
                来源引用 · 可回到原文
              </Chip>
            </div>
          </div>
          <div className="relative before:absolute before:-left-[30px] before:top-[3px] before:h-3 before:w-3 before:rounded-full before:border-[2.5px] before:border-line-2 before:bg-panel before:content-['']">
            <div className="mb-2.5 text-[1.1rem] font-bold">建立检索索引</div>
            <div className="text-[0.95rem] leading-[1.6] text-ink-2">
              同时建立语义索引和关键词索引，为后续混合检索提供入口
            </div>
          </div>
        </div>
        <Caption>
          公文不是简单存入文件夹，而是被拆成"内容、结构、来源"三类可复用资产；原文不丢，检索结果可以回到证据。
        </Caption>
      </Content>
    </SlideShell>
  )
}

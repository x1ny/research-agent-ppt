import { Chip, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

export default function Slide04StormLineage() {
  return (
    <SlideShell>
      <Eyebrow>方法论 · STORM</Eyebrow>
      <SlideTitle>STORM —— 这条技术脉络的开山之作</SlideTitle>
      <div className="-mt-0.5 flex flex-wrap gap-6">
        <Chip>Stanford OVAL</Chip>
        <Chip>NAACL 2024</Chip>
        <Chip>30k+ ★ GitHub</Chip>
      </div>
      <Content>
        <p className="mx-auto mb-8 max-w-[78ch] text-center text-[32px] leading-[1.7] text-ink-2">
          STORM（Synthesis of Topic Outlines through Retrieval and Multi-perspective，即通过检索与多视角提问合成主题大纲）是 Stanford OVAL 在 NAACL 2024 发布的开源项目。它的核心思路是“先检索、后动笔”：通过多视角提问系统性地收集知识，再生成大纲、按章节逐节写作，并为内容保留来源依据，实现从零到完整长文的自动生成，是 Research Agent 领域的典型参考。
        </p>
        <div className="mb-7 w-full max-w-[1400px]">
          <div className="mb-3 mt-3 font-mono text-[0.68rem] tracking-[0.08em] text-ink-2 uppercase">为什么公文写作需要这套方法</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-[10px] border border-line bg-panel px-5 py-4">
              <div className="mb-2 font-mono text-[0.7rem] text-accent-dim">01 · 材料多</div>
              <h4 className="m-0 font-display text-[1.05rem]">不知道该查什么</h4>
              <p className="mt-2 mb-0 text-[0.78rem] leading-[1.5] text-ink-2">容易遗漏关键维度，检索越查越窄。</p>
            </div>
            <div className="rounded-[10px] border border-line bg-panel-2 px-5 py-4">
              <div className="mb-2 font-mono text-[0.7rem] text-accent">02 · 结构散</div>
              <h4 className="m-0 font-display text-[1.05rem]">不知道如何组织</h4>
              <p className="mt-2 mb-0 text-[0.78rem] leading-[1.5] text-ink-2">有材料和观点，却难以形成完整结构。</p>
            </div>
            <div className="rounded-[10px] border border-line bg-panel-3 px-5 py-4">
              <div className="mb-2 font-mono text-[0.7rem] text-accent-deep">03 · 表达弱</div>
              <h4 className="m-0 font-display text-[1.05rem]">容易空泛、无依据</h4>
              <p className="mt-2 mb-0 text-[0.78rem] leading-[1.5] text-ink-2">套话容易生成，事实和政策依据难落位。</p>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full max-w-[1240px] text-center">
          <h3 className="m-0 mb-2 font-display text-[1.16rem]">它提供了一套“最小可行方法论”</h3>
          <p className="m-0 text-[0.84rem] leading-[1.55] text-ink-2">它不要求一次性解决所有复杂问题，而是先用多视角提问扩大信息覆盖，再用大纲组织知识，最后按结构分段生成，把“研究—组织—写作”连成一个可执行、可拆解的闭环。对我们的启发是：保留这条主线，再换成文种视角库、政务知识库和人工确认。</p>
        </div>
      </Content>
    </SlideShell>
  )
}

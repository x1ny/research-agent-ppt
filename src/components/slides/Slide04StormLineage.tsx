import { Caption, Chip, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

const steps = [
  { num: '1', title: '知识整编', desc: '检索 + 多视角提问' },
  { num: '2', title: '大纲生成', desc: '基于整编知识修订' },
  { num: '3', title: '文章生成', desc: '按大纲逐节撰写' },
  { num: '4', title: '文章润色', desc: '去冗余、提连贯' },
] as const

export default function Slide04StormLineage() {
  return (
    <SlideShell>
      <Eyebrow>方法论 · STORM</Eyebrow>
      <SlideTitle>STORM —— 这条技术脉络的开山之作</SlideTitle>
      <HeadRule />
      <div className="-mt-0.5 flex flex-wrap gap-6">
        <Chip>Stanford OVAL</Chip>
        <Chip>NAACL 2024</Chip>
        <Chip>30k+ ★ GitHub</Chip>
      </div>
      <Content>
        <p className="mx-auto mb-7 max-w-[68ch] text-center text-[31.2px] leading-[1.7] text-ink-2">
          STORM（Synthesis of Topic Outlines through Retrieval and Multi-perspective，即"通过检索与多视角提问的主题大纲合成"）是斯坦福 OVAL 实验室在 NAACL 2024 发表的开源项目，其核心思路是"先检索、后动笔"——通过多视角提问系统性地收集知识，再生成大纲逐节撰写，实现了从零到完整长文的自动生成，已成为 research agent 领域的基础范式。
        </p>
        <div className="flex w-full items-start">
          {steps.map((step, index) => (
            <div key={step.num} className="contents">
              <div className="flex flex-1 flex-col items-center px-4 text-center">
                <div
                  className={`mb-8 flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 font-mono text-[1.2rem] font-bold ${
                    index === steps.length - 1
                      ? 'border-accent bg-accent-wash text-accent-deep'
                      : 'border-line-2 bg-panel text-muted'
                  }`}
                >
                  {step.num}
                </div>
                <h4 className="m-0 mb-4 font-display text-[1.12rem]">{step.title}</h4>
                <p className="m-0 text-[0.92rem] leading-[1.6] text-ink-2">{step.desc}</p>
              </div>
              {index < steps.length - 1 ? (
                <div className="mt-14 h-[1.5px] w-11 shrink-0 bg-line" />
              ) : null}
            </div>
          ))}
        </div>
        <Caption>
          STORM 由知识整编、大纲生成、文章生成、文章润色四个模块组成。各模块接口与实现相对独立，可根据具体场景替换或扩展，例如将段落生成调整为要点式输出。
        </Caption>
      </Content>
    </SlideShell>
  )
}

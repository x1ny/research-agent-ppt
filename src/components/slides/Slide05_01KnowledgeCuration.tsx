import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const researchCode = `def research(self, topic, ground_truth_url, callback_handler,
             max_perspective=0, disable_perspective=True, return_conversation_log=False):

             
    # 1. 视角引导提问
    considered_personas = [""] if disable_perspective else \\
        self._get_considered_personas(topic, max_num_persona=max_perspective)

    # 2. 模拟对话
    conversations = self._run_conversation(
        conv_simulator=self.conv_simulator, topic=topic,
        ground_truth_url=ground_truth_url,
        considered_personas=considered_personas,
        callback_handler=callback_handler)

    # 3. 汇总成证据表
    information_table = StormInformationTable(conversations)
    return information_table, StormInformationTable.construct_log_dict(conversations)
    `

const stages = [
  {
    num: '01',
    title: '多视角引导提问',
    desc: '由不同视角驱动问题覆盖；默认保留一个基础事实视角。',
  },
  {
    num: '02',
    title: '模拟对话',
    desc: '每个视角并发运行固定轮数的提问—检索—回答对话。',
  },
  {
    num: '03',
    title: '证据整编',
    desc: '汇总各轮对话和检索结果，形成后续写作可引用的证据池。',
  },
] as const

export default function Slide05KnowledgeCuration() {
  return (
    <SlideShell>
      <Eyebrow>方法论 · STORM 知识整编</Eyebrow>
      <SlideTitle>知识整编：把 topic 变成证据表</SlideTitle>
      <Content className="justify-start gap-5">
        <div className="grid w-full max-w-[1440px] grid-cols-3 gap-5">
          {stages.map((stage, index) => (
            <div
              key={stage.num}
              className={`min-h-[126px] rounded-[10px] border border-line border-l-4 px-6 py-5 ${
                index === 0
                  ? 'border-l-accent-dim bg-panel'
                  : index === 1
                    ? 'border-l-accent bg-panel-2'
                    : 'border-l-accent-deep bg-panel-3'
              }`}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[0.7rem] text-accent">{stage.num}</span>
                <h3 className="m-0 font-display text-[1.08rem]">{stage.title}</h3>
                {index < 2 ? <span className="font-mono text-[0.82rem] text-[#f5c542]">★</span> : null}
              </div>
              <p className="m-0 text-[0.82rem] leading-[1.55] text-ink-2">{stage.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock
          code={researchCode}
          fileLabel="storm_wiki/modules/knowledge_curation.py · StormKnowledgeCurationModule.research()（L347-393）"
          dense
          className="w-full w-[1000px]! mt-[60px]"
        />
      </Content>
    </SlideShell>
  )
}

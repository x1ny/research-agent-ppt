import { useState } from 'react'
import { Caption, CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const dialogueCode = `def forward(self, topic, persona, ground_truth_url, callback_handler):
    # 共享对话状态：每一轮的问题、回答和检索证据都会追加到这里
    dlg_history: List[DialogueTurn] = []

    # 最多进行 max_turn 轮，避免模型持续追问而无法结束
    for _ in range(self.max_turn):
        # 提问方读取完整历史，结合当前视角决定下一步问什么
        user_utterance = self.wiki_writer(
            topic=topic, persona=persona, dialogue_turns=dlg_history
        ).question

        # 空问题表示生成异常；模型主动致谢则表示已经完成信息收集
        if user_utterance == "":
            logging.error("Simulated Wikipedia writer utterance is empty.")
            break
        if user_utterance.startswith("Thank you so much for your help!"):
            break

        # 专家只回答当前问题，并通过检索补充可引用的外部证据
        expert_output = self.topic_expert(
            topic=topic, question=user_utterance, ground_truth_url=ground_truth_url
        )

        # 把本轮问答和证据整理成一条记录，供下一轮继续使用
        dlg_turn = DialogueTurn(
            agent_utterance=expert_output.answer,
            user_utterance=user_utterance,
            search_queries=expert_output.queries,
            search_results=expert_output.searched_results,
        )
        dlg_history.append(dlg_turn)

        # 实时通知上层：界面或日志可以在每轮结束后立即更新
        callback_handler.on_dialogue_turn_end(dlg_turn=dlg_turn)

    # 返回完整对话历史，供后续知识整编或大纲生成使用
    return dspy.Prediction(dlg_history=dlg_history)`

const perspectives = [
  {
    num: 'PERSPECTIVE 01',
    title: '基础事实视角',
    desc: '定义、时间线、关键概念与基本事实',
    active: false,
  },
  {
    num: 'PERSPECTIVE 02 · 当前展开',
    title: '执行职责视角',
    desc: '谁负责、如何分工、具体执行边界',
    active: true,
  },
  {
    num: 'PERSPECTIVE 03',
    title: '影响与争议视角',
    desc: '影响范围、不同立场与潜在分歧',
    active: false,
  },
] as const

const rounds = [
  {
    label: 'ROUND 01 · 先建立全局认识',
    writer: '这类防汛政策通常涉及哪些部门和主要任务？',
    expert:
      '通常涉及应急管理、水利、气象、住建等部门，重点围绕监测预警、应急响应、人员转移和设施防护展开。',
    source: '🔍 检索：防汛应急预案 · 部门职责 · 响应机制',
  },
  {
    label: 'ROUND 02 · 沿着回答收窄范围',
    writer: '在较高等级响应下，乡镇一级具体承担什么职责？',
    expert: '组织人员转移、巡查重点设施、汇总灾情并向上级报告；启动权限仍需核对当地预案。',
    source: '🔍 检索：乡镇职责 · 人员转移 · 灾情报告流程',
  },
  {
    label: 'ROUND 03 · 追到可执行的边界',
    writer: 'Ⅲ级响应下，乡镇能否直接启动转移？条件和报告对象是什么？',
    expert: '不能用一般结论替代具体条款，需核对启动条件、属地权限和逐级报告对象。',
    source: '🔍 检索：Ⅲ级响应 · 启动条件 · 属地权限',
  },
] as const

export default function Slide07QueryIntent() {
  const [tab, setTab] = useState<'dialogue' | 'code'>('dialogue')

  return (
    <SlideShell>
      <Eyebrow>STORM 机制一 · 二</Eyebrow>
      <SlideTitle>多视角提问 + 模拟对话</SlideTitle>
      <Content className="justify-start">
        <div className="mb-2 flex w-full max-w-[1400px] gap-2.5" role="tablist" aria-label="多视角提问实现视图">
          <button
            className={`cursor-pointer rounded-full border px-[22px] py-2.5 font-mono text-[0.72rem] ${
              tab === 'dialogue'
                ? 'border-accent-dim bg-accent-wash font-bold text-accent-deep'
                : 'border-line bg-panel text-ink-2'
            }`}
            type="button"
            role="tab"
            aria-selected={tab === 'dialogue'}
            onClick={() => setTab('dialogue')}
          >
            模拟对话
          </button>
          <button
            className={`cursor-pointer rounded-full border px-[22px] py-2.5 font-mono text-[0.72rem] ${
              tab === 'code'
                ? 'border-accent-dim bg-accent-wash font-bold text-accent-deep'
                : 'border-line bg-panel text-ink-2'
            }`}
            type="button"
            role="tab"
            aria-selected={tab === 'code'}
            onClick={() => setTab('code')}
          >
            CODE · 代码实现
          </button>
        </div>
        <div className="grid w-full max-w-[1400px] grid-cols-[340px_1fr] items-start gap-[72px]">
          <div className="flex w-full flex-col gap-2.5">
            <div className="mb-2 font-mono text-[0.68rem] tracking-[0.05em] text-ink-2">
              同一主题 · 多个视角并行提问
            </div>
            {perspectives.map((p) => (
              <div
                key={p.num}
                className={`rounded-[9px] border px-4 py-3.5 ${
                  p.active
                    ? 'border-accent-dim bg-accent-wash'
                    : 'border-line bg-panel'
                }`}
              >
                <div className="font-mono text-[0.66rem] text-ink-2">{p.num}</div>
                <h4 className="my-1 mb-1 font-display text-[0.92rem]">{p.title}</h4>
                <p className="m-0 text-[0.7rem] leading-[1.4] text-ink-2">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className={`flex min-w-0 flex-col gap-0 ${tab === 'dialogue' ? '' : 'hidden'}`}>
            {rounds.map((round, index) => (
              <div key={round.label} className="mb-[22px] flex flex-col gap-2">
                <div
                  className={`mb-1.5 flex items-center gap-2 font-mono text-[0.62rem] after:h-px after:flex-1 after:bg-line-soft after:content-[''] ${
                    ['text-accent-dim', 'text-accent', 'text-accent-deep'][index]
                  }`}
                >
                  {round.label}
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-[70px] shrink-0 pt-2.5 text-right font-mono text-[0.66rem] text-ink-2">
                    写作者 · Writer
                  </div>
                  <div className="rounded-xl border border-line bg-panel px-[18px] py-3.5 text-[0.78rem] leading-[1.45]">
                    {round.writer}
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-[70px] shrink-0 pt-2.5 text-right font-mono text-[0.66rem] text-ink-2">
                    专家 · Expert
                  </div>
                  <div className="rounded-xl border border-line-2 bg-panel px-[18px] py-3.5 text-[0.78rem] leading-[1.45]">
                    {round.expert}
                    <div className="mt-[5px] font-mono text-[0.6rem] leading-[1.25] text-muted">
                      {round.source}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CodeBlock
            code={dialogueCode}
            fileLabel="storm_wiki/modules/knowledge_curation.py · forward()"
            dense
            scrollable
            className={`min-w-0 ${tab === 'code' ? 'block' : 'hidden'} h-[600px]`}
          />
        </div>
        {tab === 'code' ? (
          <Caption className="m-0 text-[0.9rem] leading-[1.6]">
            多视角解决“从哪些角度问”，对话历史解决“如何越问越深”。每轮均为{' '}
            <b>提问 → 检索 → 带引用回答 → 基于回答继续追问</b>。
          </Caption>
        ) : null}
      </Content>
    </SlideShell>
  )
}

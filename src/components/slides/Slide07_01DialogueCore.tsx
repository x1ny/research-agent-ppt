import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const askerCode = `class AskQuestionWithPersona(dspy.Signature):
    """你是一位经验丰富的维基百科作者，正在和专家聊天以获取信息。
    你还需要关注指定的 persona 视角，提出与主题相关且有用的问题。
    一次只问一个问题，不要重复之前问过的问题。
    没有更多问题时，请说：Thank you so much for your help!
    """
    topic = dspy.InputField(prefix="想要写作的主题：", format=str)
    persona = dspy.InputField(prefix="你的关注视角：", format=str)
    conv = dspy.InputField(prefix="对话历史：\\n", format=str)
    question = dspy.OutputField(format=str)

def forward(self, topic, persona, dialogue_turns, draft_page=None):
    # 先把历史整理成 prompt：旧轮次保留问题，近期 4 轮保留完整问答
    conv = []
    for turn in dialogue_turns[:-4]:
        conv.append(f"You: {turn.user_utterance} / Expert: [省略回答]")
    for turn in dialogue_turns[-4:]:
        conv.append(f"You: {turn.user_utterance} / Expert: {turn.agent_utterance}")

    # 第一轮没有历史时，用 N/A 明确告诉模型当前是空上下文
    conv = "\\n".join(conv).strip() or "N/A"
    conv = limit_word_count_preserve_newline(conv, 2500)

    # persona 存在时切换到带角色约束的提问 prompt
    with dspy.settings.context(lm=self.engine):
        if persona and persona.strip():
            question = self.ask_question_with_persona(
                topic=topic, persona=persona, conv=conv
            ).question
        else:
            question = self.ask_question(topic=topic, conv=conv).question
    return dspy.Prediction(question=question)`

const expertCode = `class QuestionToQuery(dspy.Signature):
    """你要使用搜索来回答问题。请思考：在搜索框中输入哪些查询词？
    请逐行输出查询词，每行一个，不要添加额外解释。
    """
    topic = dspy.InputField(prefix="正在讨论的主题：", format=str)
    question = dspy.InputField(prefix="需要回答的问题：", format=str)
    queries = dspy.OutputField(format=str)

class AnswerQuestion(dspy.Signature):
    """你是一位善于利用资料的专家，正在帮助作者撰写维基百科页面。
    请尽可能完整地回答，并确保每句话都能被已收集的资料支持。
    如果资料不足以回答，请明确说明无法回答以及缺少什么，不要编造内容。
    """
    topic = dspy.InputField(prefix="正在讨论的主题：", format=str)
    conv = dspy.InputField(prefix="问题：\\n", format=str)
    info = dspy.InputField(prefix="已收集的资料：\\n", format=str)
    answer = dspy.OutputField(prefix="现在给出回答，并尽量使用不同来源：\\n", format=str)

def forward(self, topic, question, ground_truth_url):
    # 专家不接收 dlg_history，只处理当前这一条独立问题
    queries = self.generate_queries(topic=topic, question=question).queries
    queries = [q.strip("- \\"") for q in queries.splitlines() if q.strip()]

    # 同一轮的多个 query 并发检索，减少网络等待时间
    searched_results = self.retriever.retrieve(
        list(set(queries)), exclude_urls=[ground_truth_url]
    )
    if not searched_results:
        return dspy.Prediction(
            queries=queries, searched_results=[],
            answer="Sorry, I cannot find information for this question."
        )

    # 截断材料后再生成回答，控制 prompt 成本并保留引用来源
    info = ""
    for n, result in enumerate(searched_results):
        # 每条结果先取 top-1 snippet，再统一拼成回答材料
        info += "\\n".join(f"[{n + 1}]: {snippet}" for snippet in result.snippets[:1])
        info += "\\n\\n"
    info = limit_word_count_preserve_newline(info, 1000)
    answer = self.answer_question(topic=topic, conv=question, info=info).answer
    return dspy.Prediction(
        queries=queries, searched_results=searched_results, answer=answer
    )`

function KeyPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-t border-line-soft py-2 text-[0.72rem] leading-[1.45] text-ink-2">
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </div>
  )
}

export default function Slide07_01DialogueCore() {
  return (
    <SlideShell>
      <Eyebrow>STORM 机制一 · 二 · 核心代码</Eyebrow>
      <SlideTitle>模拟对话的两端：提问者如何追问，专家如何回答</SlideTitle>
      <Content className="justify-start gap-4">
        <p className="m-0 max-w-[1200px] text-center text-[0.86rem] leading-[1.5] text-ink-2">
          一轮对话由两个相互独立的模块接力完成：提问者读取历史生成下一问，专家只接收当前问题并完成一次检索问答。
        </p>
        <div className="grid w-full max-w-[1440px] grid-cols-2 items-start gap-6">
          <section className="min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-accent">01 · QUESTION ASKER</span>
              <span className="text-[0.78rem] text-ink-2">WikiWriter.forward</span>
            </div>
            <CodeBlock
              code={askerCode}
              fileLabel="knowledge_curation.py · WikiWriter.forward()"
              dense
              scrollable
              className="h-[400px]"
            />
            <div className="mt-3 rounded-[10px] border border-line bg-panel px-4 py-2">
              <KeyPoint>历史是提问者的“记忆”。</KeyPoint>
              <KeyPoint>带 persona 时使用角色化 prompt，让问题聚焦特定视角。</KeyPoint>
              <KeyPoint>每轮只生成一个问题，不负责规划完整提问路线。</KeyPoint>
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">02 · TOPIC EXPERT</span>
              <span className="text-[0.78rem] text-ink-2">TopicExpert.forward</span>
            </div>
            <CodeBlock
              code={expertCode}
              fileLabel="knowledge_curation.py · TopicExpert.forward()"
              dense
              scrollable
              className="h-[400px]"
            />
            <div className="mt-3 rounded-[10px] border border-line bg-panel px-4 py-2">
              <KeyPoint>专家是无状态模块，不知道当前是第几轮，也看不到完整历史。</KeyPoint>
              <KeyPoint>回答前固定执行：拆 query → 并发检索 → 截断材料 → 生成回答。</KeyPoint>
              <KeyPoint>检索为空时直接返回拒答，避免模型凭记忆编造内容。</KeyPoint>
            </div>
          </section>
        </div>
        <div className="flex w-full max-w-[1200px] items-center justify-center gap-3 font-mono text-[0.7rem] text-muted">
          <span className="rounded-full border border-line bg-panel px-3 py-1.5">提问者：历史 → 新问题</span>
          <span className="text-accent">→</span>
          <span className="rounded-full border border-line bg-panel px-3 py-1.5">专家：问题 → 检索证据 → 回答</span>
          <span className="text-accent">→</span>
          <span className="rounded-full border border-line bg-panel px-3 py-1.5">追加到 dlg_history</span>
        </div>
        <div className="flex w-full max-w-[1200px] items-center gap-4 rounded-[10px] border border-accent-dim bg-accent-wash px-5 py-3 mt-4">
          <span className="shrink-0 font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">THOUGHT</span>
          <p className="mt-0 text-[0.78rem] leading-[1.5] text-ink-2">
            对于公文 Agent，我们可以优化专家模块，使用我们的私有知识库 Agent 替代通用专家，让检索与回答更智能更贴合内部材料。
          </p>
        </div>
      </Content>
    </SlideShell>
  )
}

import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

// 基于实际 WritePageOutline Signature 整理：保留调用关系，删去不影响本页理解的细节。
const draftCode = `class WritePageOutline(dspy.Signature):
    """为一个 Wikipedia 页面撰写大纲。
    1. 使用 “# 标题” 表示一级章节，
       “## 标题” 表示二级章节，以此类推。
    2. 不要输出其他信息。
    3. 不要把主题名称本身写进大纲。
    """
    topic = dspy.InputField(
        prefix="你要撰写的主题：", format=str
    )
    outline = dspy.OutputField(
        prefix="请输出 Wikipedia 页面大纲：\\n", format=str
    )


# WriteOutline.__init__
self.draft_page_outline = dspy.Predict(WritePageOutline)

# WriteOutline.forward：第一次调用只传 topic
if old_outline is None:
    old_outline = ArticleTextProcessing.clean_up_outline(
        self.draft_page_outline(
            topic="XX市防汛工作方案"
        ).outline
    )

# 没有传入 conv / dlg_history / search_results
# 这一阶段只生成“参数知识”驱动的基线结构`

const simulatedOutline = `# 背景与总体要求
## 编制背景
## 指导思想与工作目标
# 组织体系与职责分工
## 指挥机构
## 部门职责
## 属地责任
# 监测预警与应急响应
## 监测预警
## 响应等级
## 信息报送
# 重点任务与保障措施
## 人员转移
## 物资与队伍保障
## 复盘与责任追究`

export default function Slide07_02DraftOutline() {
  return (
    <SlideShell>
      <Eyebrow>STORM 机制三 · 大纲生成</Eyebrow>
      <SlideTitle>draft_page_outline：只给主题，先生成一份基线大纲</SlideTitle>
      <Content className="justify-start gap-4">
        <p className="m-0 w-full max-w-[1440px] text-[0.86rem] leading-[1.5] text-ink-2">
          第一次调用的任务很单纯：把 <code className="font-mono text-accent-deep">topic</code> 填进提示词，让模型输出一段使用 <code className="font-mono text-accent-deep"># / ## / ###</code> 表示层级的 Markdown 大纲。
        </p>

        <div className="grid w-full max-w-[1440px] grid-cols-2 items-start gap-8">
          <section className="min-w-0">
            <div className="mb-2 font-mono text-[0.68rem] tracking-[0.08em] text-accent">
              SOURCE · WritePageOutline + draft_page_outline
            </div>
            <CodeBlock
              code={draftCode}
              fileLabel="storm_wiki/modules/outline_generation.py · 基于实际源码整理"
              dense
              className="h-[600px]"
            />
          </section>

          <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">RESULT · 模拟一次模型产出</span>
              <span className="font-mono text-[0.62rem] text-muted">direct_gen_outline.txt</span>
            </div>

            <div className="mb-4 rounded-xl border border-line bg-panel px-5 py-4">
              <div className="mb-2 font-mono text-[0.62rem] tracking-[0.06em] text-muted">INPUT</div>
              <div className="font-mono text-[0.82rem] text-accent-deep">
                topic = "XX市防汛工作方案"
              </div>
            </div>

            <div className="rounded-xl border border-accent-dim bg-accent-wash px-6 py-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono text-[0.64rem] tracking-[0.06em] text-accent-deep">OUTPUT · outline</span>
              </div>
              <pre className="m-0 whitespace-pre-wrap font-mono text-[0.78rem] leading-[1.65] text-ink-2">{simulatedOutline}</pre>
            </div>

            <div className="mt-5 border-t border-line pt-4 text-[0.74rem] leading-[1.5] text-muted">
              结果只有章节标题，没有正文和引用。它是模型根据自身参数知识搭出的通用骨架，下一步才会结合阶段一的对话进行修订。
            </div>
          </section>
        </div>
      </Content>
    </SlideShell>
  )
}

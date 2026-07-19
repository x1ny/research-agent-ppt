import { CodeBlock, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

const refineCode = `class WritePageOutlineFromConv(dspy.Signature):
    """改进一个 Wikipedia 页面大纲。
    已经有一份覆盖通用信息的草稿，
    现在根据信息搜集对话使它更加丰富。
    1. 使用 “# 标题” 表示一级章节，
       “## 标题” 表示二级章节，以此类推。
    2. 不要输出其他信息。
    3. 不要把主题名称本身写进大纲。
    """
    topic = dspy.InputField(prefix="撰写主题：")
    conv = dspy.InputField(prefix="对话历史：\\n")
    old_outline = dspy.OutputField(prefix="当前大纲：\\n")
    outline = dspy.OutputField(prefix="请输出改进后的大纲：\\n")


# WriteOutline.__init__
self.write_page_outline = dspy.Predict(WritePageOutlineFromConv)

# WriteOutline.forward：一次调用完成精炼
outline = self.write_page_outline(
    topic=topic,
    conv=conv,
    old_outline=old_outline,
).outline

# old_outline 虽声明为 OutputField，传值后会被填入 Prompt
# 模型在“当前大纲”基础上继续生成新的 outline`

const inputExcerpt = `topic = "XX市防汛工作方案"

conv =
Wikipedia Writer: 在较高等级响应下，乡镇一级具体承担什么职责？
Expert: 组织人员转移、巡查重点设施、汇总灾情并向上级报告。

old_outline =
# 组织体系与职责分工
## 指挥机构
## 部门职责
## 属地责任
# 监测预警与应急响应
## 响应等级`

const refinedOutline = `# 背景与总体要求
## 编制背景
## 指导思想与工作目标
# 组织体系与职责分工
...
### 乡镇具体职责
# 监测预警与应急响应
## 监测预警
## 响应等级
## 信息报送
.....`

export default function Slide07_03WriteOutline() {
  return (
    <SlideShell>
      <Eyebrow>STORM 机制三 · 大纲生成</Eyebrow>
      <SlideTitle>write_page_outline：拿着基线大纲，吸收对话中的新信息</SlideTitle>
      <Content className="justify-start gap-4">
        <p className="m-0 w-full max-w-[1440px] text-[0.86rem] leading-[1.5] text-ink-2">
          第二次调用仍然只生成大纲，但输入从一个 <code className="font-mono text-accent-deep">topic</code> 扩展为“主题 + 对话历史 + 基线大纲”，目标是补充阶段一发现的具体信息。
        </p>

        <div className="grid w-full max-w-[1440px] grid-cols-2 items-start gap-8">
          <section className="min-w-0">
            <div className="mb-2 font-mono text-[0.68rem] tracking-[0.08em] text-accent">
              SOURCE · WritePageOutlineFromConv + write_page_outline
            </div>
            <CodeBlock
              code={refineCode}
              fileLabel="storm_wiki/modules/outline_generation.py · 基于实际源码整理"
              dense
              className="h-[600px]"
            />
          </section>

          <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.68rem] tracking-[0.08em] text-accent-deep">PROMPT INPUT · 本次调用拿到什么</span>
              <span className="font-mono text-[0.62rem] text-muted">一次 LLM 调用</span>
            </div>
            <div className="mb-4 rounded-xl border border-line bg-panel px-5 py-4">
              <pre className="m-0 whitespace-pre-wrap font-mono text-[0.68rem] leading-[1.55] text-ink-2">{inputExcerpt}</pre>
            </div>

            <div className="mb-3 flex items-center gap-3 font-mono text-[0.64rem] tracking-[0.06em] text-muted">
              <span className="h-px flex-1 bg-line" />
              MODEL OUTPUT · 精炼结果
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="rounded-xl border border-accent-dim bg-accent-wash px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[0.64rem] text-accent-deep">storm_gen_outline.txt</span>
                <span className="font-mono text-[0.6rem] text-muted">新增：乡镇职责 / 灾情报告</span>
              </div>
              <pre className="m-0 whitespace-pre-wrap font-mono text-[0.74rem] leading-[1.6] text-ink-2">{refinedOutline}</pre>
            </div>

            <div className="mt-5 border-t border-line pt-4 text-[0.74rem] leading-[1.5] text-muted">
              基线大纲提供结构，对话材料提供细节；模型在一次调用里完成“保留原结构 + 增补新章节”的改写。
            </div>
          </section>
        </div>
      </Content>
    </SlideShell>
  )
}

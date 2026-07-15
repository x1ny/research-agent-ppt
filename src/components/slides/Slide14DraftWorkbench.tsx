import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide14DraftWorkbench() {
  return (
    <SlideShell>
      <Eyebrow>环节四 · 多轮取证</Eyebrow>
      <SlideTitle>证据整编：让知识库 Agent 越问越深</SlideTitle>
      <HeadRule />
      <Content>
        <div className="w-full max-w-[1480px] overflow-hidden rounded-xl border border-line bg-bg-card">
          <div className="flex items-center gap-3.5 border-b border-line bg-bg-card-2 px-[22px] py-[15px]">
            <span className="h-[9px] w-[9px] rounded-full bg-seal shadow-[0_0_0_4px_var(--color-seal-tint)]" />
            <span className="font-mono text-[0.72rem] font-bold text-ink">知识库 Agent</span>
            <span className="text-[0.72rem] text-ink-dim">连接政务私有知识库 · 基于上一轮结果继续检索</span>
            <span className="ml-auto font-mono text-[0.65rem] text-bronze">TOPIC / 防汛工作方案</span>
          </div>
          <div className="grid h-[590px] grid-cols-[86px_1fr_280px]">
            <div className="border-r border-line bg-[rgba(243,238,224,0.45)] px-3 py-[22px]">
              <div className="mb-3.5 text-center font-mono text-[0.58rem] tracking-[0.08em] text-ink-dim">
                ROUNDS
              </div>
              <div className="relative mb-3 rounded-lg border border-[rgba(166,51,42,0.35)] bg-seal-tint px-[5px] py-3 text-center font-mono text-[0.62rem] font-bold leading-[1.35] text-seal after:absolute after:left-1/2 after:top-full after:h-[13px] after:-translate-x-1/2 after:border-l after:border-dashed after:border-line after:content-['']">
                01<br />
                先问全局
              </div>
              <div className="relative mb-3 rounded-lg border border-transparent px-[5px] py-3 text-center font-mono text-[0.62rem] leading-[1.35] text-ink-dim after:absolute after:left-1/2 after:top-full after:h-[13px] after:-translate-x-1/2 after:border-l after:border-dashed after:border-line after:content-['']">
                02<br />
                追职责
              </div>
              <div className="relative mb-3 rounded-lg border border-transparent px-[5px] py-3 text-center font-mono text-[0.62rem] leading-[1.35] text-ink-dim after:absolute after:left-1/2 after:top-full after:h-[13px] after:-translate-x-1/2 after:border-l after:border-dashed after:border-line after:content-['']">
                03<br />
                核边界
              </div>
              <div className="relative mb-3 rounded-lg border border-transparent px-[5px] py-3 text-center font-mono text-[0.62rem] leading-[1.35] text-ink-dim">
                04<br />
                收敛结果
              </div>
            </div>
            <div
              className="overflow-y-auto px-[26px] pb-[30px] pt-5 [scrollbar-color:var(--color-bronze)_var(--color-bg-card-2)] [&::-webkit-scrollbar-thumb]:rounded-[9px] [&::-webkit-scrollbar-thumb]:bg-[rgba(140,109,18,0.55)] [&::-webkit-scrollbar-track]:bg-bg-card-2 [&::-webkit-scrollbar]:w-[9px]"
              aria-label="知识库 Agent 多轮取证对话"
            >
              <div className="my-0.5 mb-2.5 flex items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.08em] text-bronze after:h-px after:flex-1 after:bg-line-soft after:content-['']">
                ROUND 01 · 先建立主题地图
              </div>
              <div className="my-2 flex items-start gap-3 pl-[42px]">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-ink-dim">拟稿人</div>
                <div className="max-w-[720px] rounded-lg border border-line bg-bg-card-2 px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  我要写一份全市防汛工作方案，先帮我找出组织领导和响应流程的依据。
                </div>
              </div>
              <div className="my-2 flex items-start gap-3">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-seal">
                  知识库
                  <br />
                  Agent
                </div>
                <div className="max-w-[720px] rounded-lg border border-line border-l-[3px] border-l-seal bg-seal-tint px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  我把问题拆成“组织领导”和“分级响应”两个方向，并从政务私有知识库中检索相关预案和同类公文。初步看到：区级部门负责统筹，乡镇承担属地执行。
                  <span className="mt-1.5 block font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">知识库检索 · </span>
                    组织领导 防汛预案 职责分工；防汛 分级响应 流程
                  </span>
                  <span className="mt-1.5 block border-t border-dashed border-line-soft pt-1.5 font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">出处 · </span>
                    现行防汛应急预案 · 组织领导、响应流程
                  </span>
                </div>
              </div>
              <div className="my-0.5 mb-2.5 flex items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.08em] text-bronze after:h-px after:flex-1 after:bg-line-soft after:content-['']">
                ROUND 02 · 沿着回答追问职责
              </div>
              <div className="my-2 flex items-start gap-3 pl-[42px]">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-ink-dim">拟稿人</div>
                <div className="max-w-[720px] rounded-lg border border-line bg-bg-card-2 px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  上一轮只说明了分工。Ⅲ级响应下，乡镇能否直接组织人员转移？
                </div>
              </div>
              <div className="my-2 flex items-start gap-3">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-seal">
                  知识库
                  <br />
                  Agent
                </div>
                <div className="max-w-[720px] rounded-lg border border-line border-l-[3px] border-l-seal bg-seal-tint px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  检索到乡镇具有组织执行职责，但“能否直接启动”取决于本地区预案规定的启动权限。我继续检索“Ⅲ级响应、乡镇、人员转移”，不把一般经验当作本地结论。
                  <span className="mt-1.5 block font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">知识库检索 · </span>
                    Ⅲ级响应 乡镇 人员转移 启动权限
                  </span>
                  <span className="mt-1.5 block border-t border-dashed border-line-soft pt-1.5 font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">出处 · </span>
                    市防汛应急预案 · 分级响应条款；乡镇防汛职责通知
                  </span>
                </div>
              </div>
              <div className="my-0.5 mb-2.5 flex items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.08em] text-bronze after:h-px after:flex-1 after:bg-line-soft after:content-['']">
                ROUND 03 · 核对可执行边界
              </div>
              <div className="my-2 flex items-start gap-3 pl-[42px]">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-ink-dim">拟稿人</div>
                <div className="max-w-[720px] rounded-lg border border-line bg-bg-card-2 px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  那启动条件和报告对象分别是什么？请区分一般灾情和专业灾情。
                </div>
              </div>
              <div className="my-2 flex items-start gap-3">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-seal">
                  知识库
                  <br />
                  Agent
                </div>
                <div className="max-w-[720px] rounded-lg border border-line border-l-[3px] border-l-seal bg-seal-tint px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  对照两份现行文件后，启动条件需要按响应等级区分；一般灾情先报属地指挥部，专业灾情由行业主管部门另行报送。两条路径不能混写。
                  <span className="mt-1.5 block font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">知识库检索 · </span>
                    分级响应 启动条件；一般灾情 专业灾情 报送路径
                  </span>
                  <span className="mt-1.5 block border-t border-dashed border-line-soft pt-1.5 font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">出处 · </span>
                    现行预案 · 分级响应、灾情报送；行业防汛专项预案
                  </span>
                </div>
              </div>
              <div className="my-0.5 mb-2.5 flex items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.08em] text-bronze after:h-px after:flex-1 after:bg-line-soft after:content-['']">
                ROUND 04 · 收敛成写作依据
              </div>
              <div className="my-2 flex items-start gap-3 pl-[42px]">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-ink-dim">拟稿人</div>
                <div className="max-w-[720px] rounded-lg border border-line bg-bg-card-2 px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  请把已经确认的内容按大纲组织起来，并告诉我哪些方向还没有证据。
                </div>
              </div>
              <div className="my-2 flex items-start gap-3">
                <div className="w-[72px] shrink-0 pt-2 text-right font-mono text-[0.6rem] text-seal">
                  知识库
                  <br />
                  Agent
                </div>
                <div className="max-w-[720px] rounded-lg border border-line border-l-[3px] border-l-seal bg-seal-tint px-3.5 py-2.5 text-[0.75rem] leading-normal text-ink">
                  已将“组织领导、响应流程、灾情报送”挂回层级大纲，并保留对应出处。物资数量、联系人和具体时间安排暂未从私有库中找到可靠片段，继续检索或请用户补充。
                  <span className="mt-1.5 block border-t border-dashed border-line-soft pt-1.5 font-mono text-[0.58rem] text-slate">
                    <span className="text-bronze">出处 · </span>
                    知识集合 · 3 个大纲节点已挂接出处
                  </span>
                </div>
              </div>
            </div>
            <aside className="border-l border-line bg-[rgba(61,81,99,0.045)] px-5 py-[22px]">
              <div className="font-mono text-[0.6rem] tracking-[0.09em] text-slate">KNOWLEDGE MINED</div>
              <h3 className="my-2 mb-4 font-display text-[1.08rem]">对话中不断长出的知识</h3>
              <div className="relative border-b border-line-soft py-3 pl-5 text-[0.73rem] leading-[1.45] text-ink before:absolute before:left-0 before:top-[18px] before:h-2 before:w-2 before:rounded-full before:bg-slate before:content-['']">
                <b className="mb-0.5 block font-mono text-[0.6rem] text-slate">ROUND 01 · 组织领导</b>
                区级部门统筹，乡镇承担属地执行。
              </div>
              <div className="relative border-b border-line-soft py-3 pl-5 text-[0.73rem] leading-[1.45] text-ink before:absolute before:left-0 before:top-[18px] before:h-2 before:w-2 before:rounded-full before:bg-slate before:content-['']">
                <b className="mb-0.5 block font-mono text-[0.6rem] text-slate">ROUND 02 · 职责边界</b>
                “组织执行”不等于“可以直接启动”，需要继续核对权限。
              </div>
              <div className="relative border-b border-line-soft py-3 pl-5 text-[0.73rem] leading-[1.45] text-ink before:absolute before:left-0 before:top-[18px] before:h-2 before:w-2 before:rounded-full before:bg-slate before:content-['']">
                <b className="mb-0.5 block font-mono text-[0.6rem] text-slate">ROUND 03 · 报送路径</b>
                一般灾情与专业灾情对应不同报告路径。
              </div>
              <div className="relative border-b border-line-soft py-3 pl-5 text-[0.73rem] leading-[1.45] text-seal before:absolute before:left-0 before:top-[18px] before:h-2 before:w-2 before:rounded-full before:bg-seal before:content-['']">
                <b className="mb-0.5 block font-mono text-[0.6rem] text-slate">OPEN QUESTION</b>
                物资数量、联系人、时间安排仍没有可靠出处。
              </div>
              <div className="mt-[18px] border-l-[3px] border-l-bronze bg-bronze-tint px-[13px] py-3 text-[0.67rem] leading-normal text-ink-dim">
                上一轮回答会改变下一轮检索问题；每一轮新增知识都带着来源，最后回挂到层级大纲。
              </div>
            </aside>
          </div>
        </div>
        <Caption>
          知识库 Agent 不是一次性返回答案，而是基于上一轮检索结果继续追问、核对和收敛，把私有库中的分散材料挖成可写的依据。
        </Caption>
      </Content>
    </SlideShell>
  )
}

import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide15NextHandoff() {
  return (
    <SlideShell>
      <Eyebrow>环节五 · 成文与渲染</Eyebrow>
      <SlideTitle>段落生成：从大纲节点装配出可引用段落</SlideTitle>
      <HeadRule />
      <Content>
        <div className="w-full max-w-[1480px] overflow-hidden rounded-xl border border-line bg-bg-card">
          <div className="flex items-center justify-between gap-5 border-b border-line bg-bg-card-2 px-[22px] py-[15px]">
            <div>
              <span className="font-mono text-[0.6rem] tracking-[0.09em] text-slate">SECTION WRITER / STORM STYLE</span>
              <strong className="mt-1.5 block font-display text-base text-ink">当前生成单元：一个大纲节点下的段落</strong>
            </div>
            <span className="whitespace-nowrap rounded-md border border-[rgba(140,109,18,0.4)] bg-bronze-tint px-2.5 py-[7px] font-mono text-[0.61rem] text-bronze">
              3 条证据已装配 · 引用可回溯
            </span>
          </div>
          <div className="grid min-h-[448px] grid-cols-[270px_minmax(0,1fr)_1.08fr]">
            <div className="bg-[rgba(243,238,224,0.42)] px-[26px] py-6">
              <span className="font-mono text-[0.6rem] tracking-[0.09em] text-slate">OUTLINE NODE</span>
              <h3 className="my-2.5 mb-4 font-display text-[1.13rem]">三、响应流程</h3>
              <div className="border-l-[3px] border-l-seal bg-seal-tint px-3.5 py-3 font-display text-[0.98rem] font-bold text-ink">
                （一）Ⅲ级响应
              </div>
              <div className="mt-[18px] border border-dashed border-line px-3.5 py-3 text-[0.7rem] leading-[1.55] text-ink-dim">
                <b className="mb-1.5 block font-mono text-[0.59rem] tracking-[0.06em] text-bronze">本段任务</b>
                说明启动条件、执行动作与报告路径，完成一个独立的公文段落。
              </div>
              <ul className="m-0 mt-[18px] list-none p-0 text-[0.69rem] leading-[1.55] text-ink-dim">
                <li className="relative my-2 pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate before:content-['']">
                  只写当前节点，不扩写其他章节
                </li>
                <li className="relative my-2 pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate before:content-['']">
                  区分一般灾情与专业灾情
                </li>
                <li className="relative my-2 pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate before:content-['']">
                  缺少出处的内容暂不生成
                </li>
              </ul>
            </div>
            <div className="border-l border-line bg-[rgba(61,81,99,0.035)] px-[26px] py-6">
              <span className="font-mono text-[0.6rem] tracking-[0.09em] text-slate">RETRIEVED EVIDENCE</span>
              <h3 className="my-2.5 mb-4 font-display text-[1.13rem]">只取本节点相关材料</h3>
              <div className="-mt-0.5 mb-[13px] rounded-[5px] border border-line bg-bg px-2.5 py-2 font-mono text-[0.57rem] leading-[1.45] text-slate">
                <span className="text-bronze">SECTION QUERY · </span>
                Ⅲ级响应 · 启动条件 · 乡镇职责 · 报送路径
              </div>
              <div className="my-2 flex gap-2.5 rounded-[7px] border border-line bg-bg-card px-3 py-[11px]">
                <span className="shrink-0 font-mono text-[0.7rem] font-bold text-seal">[1]</span>
                <div>
                  <b className="mb-1 block font-mono text-[0.61rem] text-ink">现行防汛应急预案</b>
                  <p className="m-0 text-[0.68rem] leading-normal text-ink-dim">Ⅲ级响应的启动条件与响应等级规定。</p>
                  <small className="mt-1.5 block font-mono text-[0.55rem] text-slate">响应流程 · 启动条款</small>
                </div>
              </div>
              <div className="my-2 flex gap-2.5 rounded-[7px] border border-line bg-bg-card px-3 py-[11px]">
                <span className="shrink-0 font-mono text-[0.7rem] font-bold text-seal">[2]</span>
                <div>
                  <b className="mb-1 block font-mono text-[0.61rem] text-ink">乡镇防汛职责通知</b>
                  <p className="m-0 text-[0.68rem] leading-normal text-ink-dim">乡镇承担属地组织执行和人员转移职责。</p>
                  <small className="mt-1.5 block font-mono text-[0.55rem] text-slate">职责分工 · 乡镇职责</small>
                </div>
              </div>
              <div className="my-2 flex gap-2.5 rounded-[7px] border border-line bg-bg-card px-3 py-[11px]">
                <span className="shrink-0 font-mono text-[0.7rem] font-bold text-seal">[3]</span>
                <div>
                  <b className="mb-1 block font-mono text-[0.61rem] text-ink">行业防汛专项预案</b>
                  <p className="m-0 text-[0.68rem] leading-normal text-ink-dim">专业灾情按照行业主管部门路径报送。</p>
                  <small className="mt-1.5 block font-mono text-[0.55rem] text-slate">灾情报送 · 专项条款</small>
                </div>
              </div>
            </div>
            <div className="border-l border-line bg-bg-card px-[26px] py-6">
              <span className="font-mono text-[0.6rem] tracking-[0.09em] text-slate">GENERATED SECTION</span>
              <h3 className="my-2.5 mb-4 font-display text-[1.13rem]">模型生成 · 引用随句绑定</h3>
              <div className="mt-0.5 rounded-lg border border-[rgba(166,51,42,0.35)] bg-seal-tint px-[18px] py-[17px]">
                <p className="m-0 text-[0.85rem] leading-[1.8] text-ink">
                  达到
                  <mark className="border-b border-[rgba(166,51,42,0.5)] bg-[rgba(166,51,42,0.11)] px-[3px] py-px text-seal">
                    Ⅲ级响应启动条件
                  </mark>
                  <sup className="font-mono text-[0.62rem] font-bold text-seal">[1]</sup>
                  后，各乡镇应按照属地职责，组织做好重点区域人员转移和现场处置工作，结合本辖区实际细化响应安排，确保相关措施落实到具体区域、具体人员和具体岗位……
                  <sup className="font-mono text-[0.62rem] font-bold text-seal">[2]</sup>
                  涉及专业灾情的，由行业主管部门按照专项预案规定报送相关情况，属地乡镇做好现场配合和信息衔接……
                  <sup className="font-mono text-[0.62rem] font-bold text-seal">[3]</sup>
                  具体转移范围、处置时限和报送格式，应以现行预案及专项条款为准。
                </p>
              </div>
              <div className="mt-[13px] font-mono text-[0.57rem] text-ink-dim">生成范围：当前节点 · 生成方式：章节级 LLM 调用</div>
              <div className="mt-4 grid grid-cols-[34px_1fr] gap-x-2 gap-y-1.5 border-t border-dashed border-line pt-3 text-[0.61rem] leading-[1.4] text-ink-dim">
                <b className="font-mono text-bronze">[1]</b>
                <span>启动条件 · 现行防汛应急预案</span>
                <b className="font-mono text-bronze">[2]</b>
                <span>执行动作 · 乡镇防汛职责通知</span>
                <b className="font-mono text-bronze">[3]</b>
                <span>报告路径 · 行业防汛专项预案</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-t border-line bg-bronze-tint px-[22px] py-3 text-[0.67rem] text-ink-dim">
            <span className="font-mono text-[0.59rem] font-bold tracking-[0.05em] text-seal">NO RELIABLE SOURCE</span>
            <span className="text-ink">物资数量 · 联系人 · 具体时间安排</span>
            <span>未进入段落</span>
            <span className="ml-auto font-mono text-[0.59rem] text-bronze">返回知识库 Agent 继续检索 →</span>
          </div>
        </div>
        <Caption style={{ textAlign: 'center' }}>
          成文不是把所有材料一次性倒给模型，而是按大纲节点重新检索证据、生成当前段落，并让每个事实都能回到出处。
        </Caption>
      </Content>
    </SlideShell>
  )
}

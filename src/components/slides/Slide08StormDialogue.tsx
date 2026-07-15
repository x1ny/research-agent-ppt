import { useState, type ReactNode } from 'react'
import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

function SpeakerDot({ color }: { color: 'slate' | 'seal' | 'bronze' }) {
  const bg = color === 'seal' ? 'bg-seal' : color === 'bronze' ? 'bg-bronze' : 'bg-slate'
  return <span className={`mr-2 inline-block h-2 w-2 rounded-full ${bg}`} />
}

function CostormSource({ children }: { children: ReactNode }) {
  return (
    <p className="!mt-2 font-mono text-[0.65rem] text-slate">
      <span className="text-bronze">检索 / </span>
      {children}
    </p>
  )
}

function TreeDot({ accent }: { accent?: 'seal' | 'slate' }) {
  return (
    <span
      className={`mr-2 inline-block h-[7px] w-[7px] rounded-full ${accent === 'seal' ? 'bg-seal' : 'bg-slate'}`}
    />
  )
}

export default function Slide08StormDialogue() {
  const [tab, setTab] = useState<'dialogue' | 'result'>('dialogue')

  const tabBase =
    'cursor-pointer appearance-none rounded-full border px-[22px] py-2.5 font-mono text-[0.72rem]'
  const tabActive = 'border-[rgba(166,51,42,0.55)] bg-seal-tint font-bold text-seal'
  const tabInactive = 'border-line bg-bg-card text-ink-dim'

  return (
    <SlideShell>
      <Eyebrow>附录 · 研究参考</Eyebrow>
      <SlideTitle>Co-STORM 对话机制样例</SlideTitle>
      <div className="-mb-2">
        <HeadRule />
      </div>
      <Content className="justify-start">
        <div
          className="mx-auto mb-3 flex w-full max-w-[1320px] gap-2.5"
          role="tablist"
          aria-label="Co-STORM 结果视图"
        >
          <button
            className={`${tabBase} ${tab === 'dialogue' ? tabActive : tabInactive}`}
            type="button"
            role="tab"
            aria-selected={tab === 'dialogue'}
            onClick={() => setTab('dialogue')}
          >
            协作话语
          </button>
          <button
            className={`${tabBase} ${tab === 'result' ? tabActive : tabInactive}`}
            type="button"
            role="tab"
            aria-selected={tab === 'result'}
            onClick={() => setTab('result')}
          >
            知识地图与结果
          </button>
        </div>

        <div className={`w-full ${tab === 'dialogue' ? 'block' : 'hidden'}`}>
          <div
            className="mx-auto h-[650px] w-full max-w-[1320px] overflow-y-auto rounded-xl border border-line bg-[rgba(251,249,242,0.72)] px-[30px] pt-6 pb-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] [scrollbar-color:rgba(140,109,18,0.58)_var(--color-bg-card-2)]"
            aria-label="Co-STORM 协作对话示例"
          >
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              WARM START · 先建立共享知识空间
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-seal">
                <SpeakerDot color="seal" />
                Moderator
                <br />
                主持人
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-seal bg-seal-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  围绕"防汛工作方案"，除了响应流程，还需要重点核对哪些容易被忽略的维度？
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                General Knowledge
                <br />
                Provider · 通用专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  通常还要覆盖预警发布、部门职责、人员转移、物资保障、信息报送和责任追究。具体启动条件需要回到本地区现行预案核对。
                </p>
                <CostormSource>防汛抗旱应急预案 · 部门职责 · 响应等级</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Policy Expert
                <br />
                政策专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  从政策依据看，不能只写"按照有关规定执行"，还应明确上位文件名称、文号以及本方案的适用范围。
                </p>
                <CostormSource>政策依据 · 适用范围 · 文号</CostormSource>
              </div>
            </div>
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              ROUND 01 · 沿着回答继续收窄
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Implementation Expert
                <br />
                执行专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  如果进入较高等级响应，乡镇一级的职责边界是什么？哪些动作可以直接启动，哪些必须逐级请示？
                </p>
                <CostormSource>乡镇职责 · 人员转移 · 逐级报告</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                General Knowledge
                <br />
                Provider · 通用专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  乡镇通常负责组织转移、巡查重点设施、汇总灾情并向上级报告；但启动权限和报告对象必须核对当地预案，不能用一般结论替代具体条款。
                </p>
                <CostormSource>响应等级 · 属地权限 · 灾情报告流程</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-bronze">
                <SpeakerDot color="bronze" />
                Human User
                <br />
                用户
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-bronze bg-bronze-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  请把重点转到"共享知识空间"：目前哪些信息还没有可靠来源？如果检索不到，哪些问题需要直接问我？
                </p>
              </div>
            </div>
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              MODERATOR OVERRIDE · 发现未充分讨论的信息
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-seal">
                <SpeakerDot color="seal" />
                Moderator
                <br />
                主持人
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-seal bg-seal-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  目前已经覆盖了职责和响应等级，但"物资数量、责任单位、联系人、时间节点"仍没有检索片段或引用支撑。建议先扩展知识地图，再进入大纲生成。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-bronze">
                <SpeakerDot color="bronze" />
                Human User
                <br />
                用户
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-bronze bg-bronze-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  物资数量由应急管理部门提供；联系人和具体时间我来补充。请把这些内容保留为未解决问题，不要从模型记忆中补写。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Moderator + Experts
                <br />
                协作结果
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  已更新动态知识地图：政策依据、职责分工、响应等级已挂接出处；物资数量、联系人和时间节点保留为未解决问题。系统可以继续组织层级大纲，但不会把无来源内容写入报告。
                </p>
              </div>
            </div>
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              ROUND 02 · 从"职责"追到"可执行边界"
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Policy Expert
                <br />
                政策专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  "加强巡查、及时转移"仍然偏抽象。要写成可执行条款，还需要明确触发条件、执行主体、完成时限和报告对象。
                </p>
                <CostormSource>任务分解 · 触发条件 · 时限要求</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Implementation Expert
                <br />
                执行专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  建议把"重点区域人员转移"拆成三步：风险研判后由谁发布指令、由谁组织转移、转移完成后向谁反馈。每一步都应挂接来源或责任人。
                </p>
                <CostormSource>风险研判 · 指令发布 · 反馈闭环</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-bronze">
                <SpeakerDot color="bronze" />
                Human User
                <br />
                用户
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-bronze bg-bronze-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  责任单位是区应急管理局，乡镇负责执行；但具体转移时限还在和区防指确认，请不要写成确定数字。
                </p>
              </div>
            </div>
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              ROUND 03 · 检索结果出现冲突
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                General Knowledge
                <br />
                Provider · 通用专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  检索到两份文件：一份规定由乡镇汇总灾情，另一份要求由行业主管部门直接报送。两者可能适用不同事件类型，不能直接合并。
                </p>
                <CostormSource>文件版本 · 适用范围 · 报送路径</CostormSource>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-seal">
                <SpeakerDot color="seal" />
                Moderator
                <br />
                主持人
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-seal bg-seal-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  发现"灾情报送主体"存在来源冲突。请政策专家优先核对文件效力和适用范围，暂缓生成这一段，避免把不同场景的规定拼在一起。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Policy Expert
                <br />
                政策专家
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  核对后确认：旧文件已被新预案替代；新预案规定乡镇先报属地指挥部，行业主管部门另行报送专业灾情。两条路径都保留，但适用条件不同。
                </p>
                <CostormSource>现行预案 · 废止关系 · 分级报送</CostormSource>
              </div>
            </div>
            <div className="my-[18px] mb-0.5 ml-[212px] font-mono text-[0.65rem] tracking-[0.08em] text-bronze">
              ROUND 04 · 从知识收集进入写作准备
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                Moderator + Experts
                <br />
                协作结果
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  共享知识空间已更新：①责任单位——已有来源；②转移时限——用户待确认；③灾情报送路径——已核验并区分场景；④物资数量——仍待检索。可以进入层级大纲评审，不建议直接生成全文。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] border-b border-line-soft py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-bronze">
                <SpeakerDot color="bronze" />
                Human User
                <br />
                用户
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-bronze bg-bronze-tint px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  确认层级大纲方向：把"组织领导、响应流程、保障措施"作为三节；保障措施中的物资数量继续保留为未解决问题，等我提供清单后再写。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[190px_1fr] items-start gap-[22px] py-[18px]">
              <div className="pt-2 text-right font-mono text-[0.72rem] tracking-[0.03em] text-ink-dim">
                <SpeakerDot color="slate" />
                System State
                <br />
                系统状态
              </div>
              <div className="max-w-[900px] rounded-[10px] border border-line border-l-4 border-l-slate bg-bg-card px-[22px] py-4 text-[0.88rem] leading-[1.6]">
                <p className="m-0">
                  已形成可追溯写作输入：每一节都有层级位置、对话依据、引用来源和未解决问题。后续写作者只使用已核验信息，缺少来源的内容保留为显式占位。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full ${tab === 'result' ? 'block' : 'hidden'}`}>
          <div
            className="mx-auto h-[650px] w-full max-w-[1320px] overflow-y-auto rounded-xl border border-line bg-[rgba(251,249,242,0.72)] px-[34px] py-7 [scrollbar-color:rgba(140,109,18,0.58)_var(--color-bg-card-2)]"
            aria-label="Co-STORM 动态知识地图与生成结果"
          >
            <div className="grid grid-cols-2 items-start gap-7">
              <div className="rounded-[10px] border border-line bg-bg-card px-6 py-[22px]">
                <div className="font-mono text-[0.67rem] tracking-[0.08em] text-bronze uppercase">
                  Dynamic Mind Map
                </div>
                <h3 className="my-2 mb-3.5 font-display text-[1.12rem]">共享知识空间</h3>
                <ul className="m-0 list-none p-0 text-[0.8rem] leading-[1.45]">
                  <li className="my-2">
                    <TreeDot accent="seal" />
                    防汛工作方案
                    <ul className="mt-2 ml-5 list-none border-l border-dashed border-line pl-[18px]">
                      <li className="my-2">
                        <TreeDot />
                        政策依据
                        <span className="mt-0.5 ml-[17px] block font-mono text-[0.62rem] text-slate">
                          现行预案 · 文件效力已核验
                        </span>
                      </li>
                      <li className="my-2">
                        <TreeDot />
                        组织领导
                        <ul className="mt-2 ml-5 list-none border-l border-dashed border-line pl-[18px]">
                          <li className="my-2">
                            <TreeDot />
                            区应急管理局牵头
                            <span className="mt-0.5 ml-[17px] block font-mono text-[0.62rem] text-slate">
                              职责分工 · 已挂接来源
                            </span>
                          </li>
                          <li className="my-2">
                            <TreeDot />
                            乡镇负责执行
                            <span className="mt-0.5 ml-[17px] block font-mono text-[0.62rem] text-slate">
                              乡镇职责 · 已挂接来源
                            </span>
                          </li>
                        </ul>
                      </li>
                      <li className="my-2">
                        <TreeDot />
                        响应流程
                        <ul className="mt-2 ml-5 list-none border-l border-dashed border-line pl-[18px]">
                          <li className="my-2">
                            <TreeDot />
                            预警与研判
                          </li>
                          <li className="my-2">
                            <TreeDot />
                            人员转移
                          </li>
                          <li className="my-2">
                            <TreeDot />
                            灾情报送：按场景区分路径
                            <span className="mt-0.5 ml-[17px] block font-mono text-[0.62rem] text-slate">
                              新预案 · 分级报送
                            </span>
                          </li>
                        </ul>
                      </li>
                      <li className="my-2">
                        <TreeDot />
                        保障措施
                        <span className="mt-0.5 ml-[17px] block font-mono text-[0.62rem] text-slate">
                          物资数量 · 未解决问题
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="rounded-[10px] border border-line bg-bg-card px-6 py-[22px]">
                <div className="font-mono text-[0.67rem] tracking-[0.08em] text-bronze uppercase">
                  Hierarchical Outline
                </div>
                <h3 className="my-2 mb-3.5 font-display text-[1.12rem]">由对话组织出的层级大纲</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3 rounded-[7px] border border-line-soft bg-bg-card-2 px-3 py-2.5 text-[0.78rem] leading-[1.45]">
                    <b className="shrink-0 font-mono text-[0.68rem] text-bronze">1</b>
                    <span>总体要求：说明依据、目标和适用范围。</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-[7px] border border-line-soft bg-bg-card-2 px-3 py-2.5 text-[0.78rem] leading-[1.45]">
                    <b className="shrink-0 font-mono text-[0.68rem] text-bronze">2</b>
                    <span>组织领导：区级牵头、乡镇执行、部门协同。</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-[7px] border border-line-soft bg-bg-card-2 px-3 py-2.5 text-[0.78rem] leading-[1.45]">
                    <b className="shrink-0 font-mono text-[0.68rem] text-bronze">3</b>
                    <span>响应流程：研判、转移、报送及闭环反馈。</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-[7px] border border-line-soft bg-bg-card-2 px-3 py-2.5 text-[0.78rem] leading-[1.45]">
                    <b className="shrink-0 font-mono text-[0.68rem] text-bronze">4</b>
                    <span>保障措施：物资、联系人和时间安排仍需补充来源。</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 rounded-[10px] border border-line bg-bg-card px-6 py-[22px]">
                <div className="font-mono text-[0.67rem] tracking-[0.08em] text-bronze uppercase">
                  Cited Draft · 仅使用已收集信息
                </div>
                <h3 className="my-2 mb-3.5 font-display text-[1.12rem]">生成结果片段</h3>
                <div className="border-l-[3px] border-l-seal bg-seal-tint px-[18px] py-3.5 font-display text-[0.92rem] leading-[1.75] text-ink">
                  各乡镇、有关部门要按照现行防汛应急预案明确的职责分工，做好风险研判、重点区域巡查、人员转移和灾情报送工作。区应急管理局负责统筹协调，乡镇负责组织执行；灾情报送应根据事件类型分别按照属地指挥部和行业主管部门规定的路径办理。
                  <br />
                  <br />
                  <span className="font-mono text-[0.65rem] text-slate">
                    <span className="text-bronze">检索 / </span>
                    依据：现行防汛应急预案 · 职责分工 · 分级报送
                  </span>
                </div>
              </div>
              <div className="col-span-2 rounded-[10px] border border-line bg-bg-card px-6 py-[22px]">
                <div className="font-mono text-[0.67rem] tracking-[0.08em] text-bronze uppercase">
                  Open Questions
                </div>
                <h3 className="my-2 mb-3.5 font-display text-[1.12rem]">主持人保留下来的未解决问题</h3>
                <p className="m-0 text-[0.82rem] leading-[1.6] text-ink-dim">
                  物资具体数量、联系人、转移时限尚未获得可靠来源。Co-STORM 不用模型记忆填空，而是把它们作为下一轮用户输入或检索任务。
                </p>
              </div>
            </div>
          </div>
        </div>

        <Caption className="m-0 text-[0.9rem] leading-[1.6]">
          这是 Co-STORM 的研究参考样例，不属于当前主流程；当前方案采用固定视角、有限轮次的检索与证据整编。
        </Caption>
      </Content>
    </SlideShell>
  )
}

import { useState } from 'react'
import { Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

type TabId = 'skill' | 'theme' | 'outline'

const tabs = [
  { id: 'skill' as const, label: '01 · 文种 Skill', title: '先搭建基础骨架：解决“怎么写”' },
  { id: 'theme' as const, label: '02 · 主题公文', title: '再检索相似公文：提炼“写作要点”' },
  { id: 'outline' as const, label: '03 · 大纲二改', title: '最后修订任务大纲：确定“写什么”' },
]

export default function Slide13KbBridge() {
  const [activeTab, setActiveTab] = useState<TabId>('skill')
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]

  return (
    <SlideShell>
      <Eyebrow>环节三 · 结构规划</Eyebrow>
      <SlideTitle>从文种 Skill 基础骨架，到主题化大纲</SlideTitle>
      <Content className="justify-start gap-5">
        <div className="w-full max-w-[1480px] border-l-4 border-accent pl-5">
          <p className="m-0 text-[0.84rem] leading-[1.55] text-ink-2">
            基础结构由文种 Skill 提供，具体内容由相似主题公文补充；大纲不是一次生成，而是经过材料检索后进行二次修改。
          </p>
        </div>

        <div className="flex w-full max-w-[1480px] gap-2" role="tablist" aria-label="结构规划阶段">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cursor-pointer rounded-full border px-5 py-2.5 font-mono text-[0.66rem] transition-colors ${
                activeTab === tab.id
                  ? 'border-accent-dim bg-accent-wash font-bold text-accent-deep'
                  : 'border-line bg-panel text-ink-2'
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="w-full max-w-[1480px] overflow-hidden rounded-xl border border-line bg-panel" role="tabpanel">
          <div className="flex items-center justify-between gap-5 border-b border-line bg-panel-2 px-7 py-5">
            <div>
              <span className="font-mono text-[0.61rem] tracking-[0.09em] text-accent">STRUCTURE PLANNING / {active.label}</span>
              <h2 className="m-0 mt-2 font-display text-[1.2rem] font-bold text-ink">{active.title}</h2>
            </div>
            <span className="rounded-md border border-accent-dim bg-accent-wash px-3 py-2 font-mono text-[0.61rem] text-accent-deep">
              {activeTab === 'skill' && '规则资产'}
              {activeTab === 'theme' && '检索资产'}
              {activeTab === 'outline' && '用户确认前'}
            </span>
          </div>

          {activeTab === 'skill' && (
            <div className="grid min-h-[450px] grid-cols-[1fr_1.25fr]">
              <div className="border-r border-line bg-[rgba(238,242,248,0.6)] px-8 py-7">
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-muted">DOCUMENT SKILL</span>
                <h3 className="my-3 font-display text-[1.16rem]">工作方案 Skill</h3>
                <div className="rounded-lg border border-accent-dim bg-accent-wash px-4 py-3 font-mono text-[0.68rem] text-accent-deep">
                  基础骨架 · 怎么写
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ['开头功能', '背景依据 + 总体要求 + 工作目标'],
                    ['主体功能', '重点任务 + 组织实施 + 工作要求'],
                    ['结尾功能', '保障措施 + 责任落实 + 执行要求'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-line bg-panel px-4 py-3 mt-[-10px]">
                      <span className="font-mono text-[0.6rem] text-accent-deep">{label}</span>
                      <p className="m-0 mt-1.5 text-[0.78rem] leading-[1.5] text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-8 py-7">
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-muted">SKILL PROVIDES</span>
                <h3 className="my-3 font-display text-[1.16rem]">Skill 负责规定写作边界</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['结构规则', '哪些章节通常必须出现'],
                    ['段落功能', '每一部分要完成什么任务'],
                    ['规范表达', '常用句式和语体要求'],
                    ['写作约束', '哪些表述不能自由发挥'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-line bg-panel-2 px-4 py-4">
                      <strong className="block font-display text-[0.88rem] text-ink">{label}</strong>
                      <p className="m-0 mt-2 text-[0.72rem] leading-[1.5] text-ink-2">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-l-[3px] border-l-accent bg-accent-wash px-4 py-3 text-[0.74rem] leading-[1.55] text-ink-2">
                  Skill 只回答“这种文种通常怎么写”，不提供本次任务的具体事实。
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="flex min-h-[450px]">
              <div className="w-[31%] shrink-0 border-r border-line bg-[rgba(238,242,248,0.6)] px-8 py-7">
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-muted">SOURCE SAMPLES</span>
                <h3 className="my-3 font-display text-[1.16rem]">从相似公文中观察写法</h3>
                <div className="space-y-3">
                  {[
                    ['现行防汛应急预案', '按响应等级分别明确启动条件与处置要求'],
                    ['XX市防汛工作方案', '重点任务覆盖组织、队伍、物资和值守'],
                    ['乡镇防汛职责通知', '区级统筹、乡镇执行，灾情分路径报送'],
                  ].map(([title, excerpt], index) => (
                    <div key={title} className="rounded-lg border border-line bg-panel px-4 py-3.5 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.68rem] font-bold text-accent-deep">0{index + 1}</span>
                        <strong className="text-[0.78rem] text-ink">{title}</strong>
                      </div>
                      <p className="m-0 mt-2 border-l-2 border-line-2 pl-3 text-[0.68rem] leading-[1.5] text-ink-2">“{excerpt}……”</p>
                    </div>
                  ))}
                </div>
                {/* <div className="mt-5 border-l-[3px] border-l-accent bg-accent-wash px-4 py-3 text-[0.72rem] leading-[1.55] text-ink-2">
                  不是复制某一篇范文，而是对多个样本进行比较，寻找反复出现的组织方式。
                </div> */}
              </div>

              <div className="flex w-[58px] shrink-0 items-center justify-center font-mono text-[1.7rem] text-accent">→</div>

              <div className="min-w-0 flex-1 px-8 py-7">
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-accent-deep">WRITING POINTS</span>
                <h3 className="my-3 font-display text-[1.16rem]">从相似公文中提炼写作要点</h3>
                <p className="m-0 mb-4 text-[0.74rem] leading-[1.55] text-ink-2">
                  对多个相关样本进行比较，提炼本次大纲需要覆盖的主题内容。
                </p>
                <div className="space-y-3">
                  {[
                    '重点任务按响应等级组织',
                    '明确区级部门、乡镇和行业主管部门的职责边界',
                    '分别说明一般灾情与专业灾情的报送路径',
                  ].map((point, index) => (
                    <div key={point} className="flex items-start gap-3 rounded-lg border border-accent-dim bg-accent-wash px-4 py-3 mt-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel font-mono text-[0.58rem] font-bold text-accent-deep">
                        {index + 1}
                      </span>
                      <strong className="pt-0.5 text-[0.78rem] leading-[1.5] text-ink">{point}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="grid min-h-[450px] grid-cols-[1fr_64px_1fr] items-center px-8 py-7">
              <div>
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-muted">BASE OUTLINE / SKILL</span>
                <h3 className="my-3 font-display text-[1.16rem]">基础大纲</h3>
                <div className="rounded-lg border border-line bg-panel-2 px-5 py-4 text-[0.84rem] leading-[1.9] text-ink-2">
                  一、总体要求
                  <br />
                  二、重点任务
                  <br />
                  三、组织实施
                  <br />
                  四、工作要求
                </div>
                <p className="m-0 mt-4 text-[0.72rem] leading-[1.5] text-muted">只体现文种的通用结构，主题内容还不够具体。</p>
              </div>
              <div className="flex items-center justify-center font-mono text-[1.8rem] text-accent">→</div>
              <div>
                <span className="font-mono text-[0.61rem] tracking-[0.09em] text-accent-deep">REVISED OUTLINE / THEME</span>
                <h3 className="my-3 font-display text-[1.16rem]">主题化大纲</h3>
                <div className="rounded-lg border border-accent-dim bg-accent-wash px-5 py-4 text-[0.84rem] leading-[1.9] text-ink">
                  一、总体要求与工作目标
                  <br />
                  二、监测预警与分级响应
                  <br />
                  三、组织实施与报送路径
                  <br />
                  四、队伍、物资与值守保障
                </div>
                <p className="m-0 mt-4 text-[0.72rem] leading-[1.5] text-ink-2">加入主题要点、待核实信息和证据入口，交给用户确认。</p>
              </div>
            </div>
          )}
        </section>

        <p className="mt-1 text-center text-[0.78rem] leading-[1.55] text-ink-2">
          文种 Skill 提供基础写法，相似主题公文补充本次任务的写作要点；大纲二次修改后，才进入取证与成文。
        </p>
      </Content>
    </SlideShell>
  )
}

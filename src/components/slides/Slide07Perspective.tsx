import { Caption, Content, Eyebrow, HeadRule, SlideShell, SlideTitle } from '../ui'

export default function Slide07Perspective() {
  return (
    <SlideShell>
      <Eyebrow>附录 · 后续增强方向</Eyebrow>
      <SlideTitle>Co-STORM：暂不纳入当前主流程</SlideTitle>
      <HeadRule />
      <Content>
        <div className="flex w-full justify-center">
          <svg className="h-auto w-full max-w-[1100px]" viewBox="0 0 640 320">
            <line x1="320" y1="150" x2="150" y2="68" stroke="#C9C2AE" strokeWidth="1.3" />
            <line x1="320" y1="150" x2="490" y2="68" stroke="#C9C2AE" strokeWidth="1.3" />
            <line x1="320" y1="150" x2="320" y2="253" stroke="#C9C2AE" strokeWidth="1.3" />

            <circle cx="320" cy="150" r="4.5" fill="#8C6D12" />
            <circle cx="280" cy="129" r="28" fill="#FBF9F2" stroke="#8C6D12" strokeWidth="1.5" />
            <circle cx="347" cy="113" r="21" fill="#FBF9F2" stroke="#8C6D12" strokeWidth="1.3" />
            <circle cx="330" cy="176" r="19" fill="#FBF9F2" stroke="#8C6D12" strokeWidth="1.2" />
            <text x="320" y="207" textAnchor="middle" fill="#8C6D12" fontSize="19.5" fontFamily="monospace" fontWeight="600">
              动态思维导图
            </text>

            <rect x="60" y="38" width="165" height="70" rx="9" fill="#FBF9F2" stroke="#A6332A" strokeWidth="1.2" />
            <text x="142" y="67" textAnchor="middle" fill="#2A241D" fontSize="22.5" fontWeight="600">
              专家 agent
            </text>
            <text x="142" y="91" textAnchor="middle" fill="#A6332A" fontSize="18" fontFamily="monospace">
              多视角回答/追问
            </text>

            <rect x="415" y="38" width="165" height="70" rx="9" fill="#FBF9F2" stroke="#A6332A" strokeWidth="1.2" />
            <text x="497" y="67" textAnchor="middle" fill="#2A241D" fontSize="22.5" fontWeight="600">
              主持人 agent
            </text>
            <text x="497" y="91" textAnchor="middle" fill="#A6332A" fontSize="18" fontFamily="monospace">
              发现"未聊到"的信息
            </text>

            <rect x="240" y="243" width="160" height="70" rx="9" fill="#FBF9F2" stroke="#A6332A" strokeWidth="1.2" />
            <text x="320" y="274" textAnchor="middle" fill="#2A241D" fontSize="22.5" fontWeight="600">
              真实用户
            </text>
            <text x="320" y="298" textAnchor="middle" fill="#A6332A" fontSize="18" fontFamily="monospace">
              随时可插话主导
            </text>
          </svg>
        </div>
        <Caption className="mx-auto mt-3 max-w-[64ch] text-center">
          Co-STORM 在 STORM 之上增加多 Agent 协作和用户随时插话能力；当前方案先采用更稳定的多视角检索与证据整编，暂不引入这套机制。
        </Caption>
      </Content>
    </SlideShell>
  )
}

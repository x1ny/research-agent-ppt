import { Caption, Content, Eyebrow, SlideShell, SlideTitle } from '../ui'

export default function Slide08Perspective() {
  return (
    <SlideShell>
      <Eyebrow>附录 · 后续增强方向</Eyebrow>
      <SlideTitle>Co-STORM：暂不纳入当前主流程</SlideTitle>
      <Content>
        <div className="flex w-full justify-center">
          <svg className="h-auto w-full max-w-[1100px]" viewBox="0 0 640 320">
            <line x1="320" y1="150" x2="150" y2="68" stroke="#d2dae7" strokeWidth="1.3" />
            <line x1="320" y1="150" x2="490" y2="68" stroke="#d2dae7" strokeWidth="1.3" />
            <line x1="320" y1="150" x2="320" y2="253" stroke="#d2dae7" strokeWidth="1.3" />

            <circle cx="320" cy="150" r="4.5" fill="#1d4ed8" />
            <circle cx="280" cy="129" r="28" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="347" cy="113" r="21" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.3" />
            <circle cx="330" cy="176" r="19" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.2" />
            <text x="320" y="207" textAnchor="middle" fill="#1d4ed8" fontSize="19.5" fontFamily="monospace" fontWeight="600">
              动态思维导图
            </text>

            <rect x="60" y="38" width="165" height="70" rx="9" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
            <text x="142" y="67" textAnchor="middle" fill="#111a2b" fontSize="22.5" fontWeight="600">
              专家 agent
            </text>
            <text x="142" y="91" textAnchor="middle" fill="#2563eb" fontSize="18" fontFamily="monospace">
              多视角回答/追问
            </text>

            <rect x="415" y="38" width="165" height="70" rx="9" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
            <text x="497" y="67" textAnchor="middle" fill="#111a2b" fontSize="22.5" fontWeight="600">
              主持人 agent
            </text>
            <text x="497" y="91" textAnchor="middle" fill="#2563eb" fontSize="18" fontFamily="monospace">
              发现"未聊到"的信息
            </text>

            <rect x="240" y="243" width="160" height="70" rx="9" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />
            <text x="320" y="274" textAnchor="middle" fill="#111a2b" fontSize="22.5" fontWeight="600">
              真实用户
            </text>
            <text x="320" y="298" textAnchor="middle" fill="#2563eb" fontSize="18" fontFamily="monospace">
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

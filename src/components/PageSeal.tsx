type Props = {
  current: number
  total: number
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function PageSeal({ current, total }: Props) {
  return (
    <div
      className="pointer-events-none fixed right-[26px] bottom-5 z-50 rotate-[-7deg] text-seal opacity-90"
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" width="84" height="84">
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1" />
        <text
          x="60"
          y="50"
          textAnchor="middle"
          className="fill-current font-display text-[30px] font-bold"
        >
          稿
        </text>
        <text x="60" y="84" textAnchor="middle" className="fill-current font-mono text-[16.5px]">
          {pad(current + 1)}
        </text>
        <text
          x="60"
          y="90"
          textAnchor="middle"
          className="fill-current font-mono"
          style={{ fontSize: '13.5px' }}
        >
          /{pad(total)}
        </text>
      </svg>
    </div>
  )
}

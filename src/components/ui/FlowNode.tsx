import type { CSSProperties, ReactNode } from 'react'

type Accent = 'default' | 'red' | 'gold'

const barClass: Record<Accent, string> = {
  default: 'before:bg-slate',
  red: 'before:bg-seal',
  gold: 'before:bg-bronze',
}

type Props = {
  title: ReactNode
  subtitle?: ReactNode
  accent?: Accent
  className?: string
  style?: CSSProperties
}

export default function FlowNode({
  title,
  subtitle,
  accent = 'default',
  className = '',
  style,
}: Props) {
  return (
    <div
      className={`relative min-w-[150px] rounded-[10px] border border-line bg-bg-card py-9 pr-11 pl-[52px] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-l-[10px] before:content-[''] ${barClass[accent]} ${className}`}
      style={style}
    >
      <div className="text-[1.12rem] font-bold">{title}</div>
      {subtitle != null ? (
        <div className="mt-2.5 font-mono text-[0.84rem] text-ink-dim">{subtitle}</div>
      ) : null}
    </div>
  )
}

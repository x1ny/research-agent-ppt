import type { CSSProperties, ReactNode } from 'react'

type Accent = 'default' | 'red' | 'gold' | 'dim' | 'deep'

const barClass: Record<Accent, string> = {
  default: 'before:bg-muted',
  red: 'before:bg-neg',
  gold: 'before:bg-accent',
  dim: 'before:bg-accent-dim',
  deep: 'before:bg-accent-deep',
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
      className={`relative min-w-[150px] rounded-[10px] border border-line bg-panel py-9 pr-11 pl-[52px] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-l-[10px] before:content-[''] ${barClass[accent]} ${className}`}
      style={style}
    >
      <div className="text-[1.12rem] font-bold">{title}</div>
      {subtitle != null ? (
        <div className="mt-2.5 font-mono text-[0.84rem] text-ink-2">{subtitle}</div>
      ) : null}
    </div>
  )
}

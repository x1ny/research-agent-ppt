import type { CSSProperties, ReactNode } from 'react'

type Variant = 'default' | 'red' | 'gold' | 'slate' | 'dim'

const variantClass: Record<Variant, string> = {
  default: 'border-line bg-panel text-ink-2',
  red: 'border-[rgba(220,91,75,0.4)] bg-neg-wash text-neg-deep',
  gold: 'border-accent-dim bg-accent-wash text-accent-deep',
  slate: 'border-[rgba(101,114,140,0.4)] bg-muted-tint text-muted',
  dim: 'border-accent-dim bg-accent-wash text-accent',
}

const dotClass: Record<Variant, string> = {
  default: 'bg-muted',
  red: 'bg-neg',
  gold: 'bg-accent',
  slate: 'bg-muted',
  dim: 'bg-accent-dim',
}

type Props = {
  variant?: Variant
  withDot?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function Chip({
  variant = 'default',
  withDot = false,
  className = '',
  style,
  children,
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-3.5 whitespace-nowrap rounded-full border px-7 py-3.5 font-mono text-[0.88rem] ${variantClass[variant]} ${className}`}
      style={style}
    >
      {withDot ? <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${dotClass[variant]}`} /> : null}
      {children}
    </span>
  )
}

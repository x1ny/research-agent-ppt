import type { CSSProperties, ReactNode } from 'react'

type Variant = 'default' | 'red' | 'gold' | 'slate'

const variantClass: Record<Variant, string> = {
  default: 'border-line bg-bg-card text-ink-dim',
  red: 'border-[rgba(166,51,42,0.4)] bg-seal-tint text-seal',
  gold: 'border-[rgba(140,109,18,0.4)] bg-bronze-tint text-bronze',
  slate: 'border-[rgba(61,81,99,0.4)] bg-slate-tint text-slate',
}

const dotClass: Record<Variant, string> = {
  default: 'bg-slate',
  red: 'bg-seal',
  gold: 'bg-bronze',
  slate: 'bg-slate',
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

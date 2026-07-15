import type { CSSProperties, ReactNode } from 'react'

type Props = {
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function Caption({ className = '', style, children }: Props) {
  return (
    <p
      className={`mt-11 max-w-[72ch] text-[1.08rem] leading-[1.8] text-ink-dim [&_b]:font-bold [&_b]:text-ink [&_strong]:font-bold [&_strong]:text-ink ${className}`}
      style={style}
    >
      {children}
    </p>
  )
}

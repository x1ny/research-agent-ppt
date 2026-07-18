import type { CSSProperties, ReactNode } from 'react'

type Props = {
  as?: 'h1' | 'h2'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function SlideTitle({ as: Tag = 'h2', className = '', style, children }: Props) {
  return (
    <Tag
      className={`m-0 mb-10 font-display text-[36px] font-bold leading-[1.25] tracking-[0.01em] text-ink ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

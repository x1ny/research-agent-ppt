import type { CSSProperties, ReactNode } from 'react'

type Props = {
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function SlideShell({ className = '', style, children }: Props) {
  return (
    <section
      className={`relative flex h-[1080px] w-[1920px] shrink-0 flex-col px-[240px] pb-[108px] pt-16 ${className}`}
      style={style}
    >
      {children}
    </section>
  )
}

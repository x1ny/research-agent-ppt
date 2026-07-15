import type { CSSProperties, ReactNode } from 'react'

type Props = {
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function Content({ className = '', style, children }: Props) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col items-center justify-center ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'
import { DESIGN_W } from '../hooks/usePresentation'

type Props = {
  index: number
  children: ReactNode
}

export default function Track({ index, children }: Props) {
  return (
    <div
      id="track"
      className="flex h-[1080px] w-[34560px] transition-transform duration-[450ms] ease-[cubic-bezier(.65,0,.35,1)] will-change-transform"
      style={{ transform: `translateX(-${index * DESIGN_W}px)` }}
    >
      {children}
    </div>
  )
}

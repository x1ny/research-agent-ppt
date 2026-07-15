import type { ReactNode } from 'react'

type Props = {
  scale: number
  children: ReactNode
}

export default function Stage({ scale, children }: Props) {
  return (
    <main
      id="stage"
      className="fixed top-1/2 left-1/2 h-[1080px] w-[1920px] origin-center overflow-hidden"
      style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      {children}
    </main>
  )
}

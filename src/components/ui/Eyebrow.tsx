import type { ReactNode } from 'react'

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center gap-2.5 font-mono text-[0.86rem] font-semibold uppercase tracking-[0.13em] text-accent before:inline-block before:h-[1.5px] before:w-[22px] before:bg-accent before:content-['']">
      {children}
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'

export const DESIGN_W = 1920
export const DESIGN_H = 1080

export function usePresentation(total: number) {
  const [idx, setIdx] = useState(0)
  const [scale, setScale] = useState(1)

  const goTo = useCallback(
    (i: number) => {
      setIdx(Math.max(0, Math.min(total - 1, i)))
    },
    [total],
  )

  const next = useCallback(() => goTo(idx + 1), [goTo, idx])
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx])

  useEffect(() => {
    const applyScale = () => {
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H))
    }
    applyScale()
    window.addEventListener('resize', applyScale)
    return () => window.removeEventListener('resize', applyScale)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        setIdx((i) => Math.min(total - 1, i + 1))
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        setIdx((i) => Math.max(0, i - 1))
      } else if (e.key === 'Home') {
        setIdx(0)
      } else if (e.key === 'End') {
        setIdx(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  return { idx, scale, goTo, next, prev, total }
}

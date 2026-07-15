import { useCallback, useEffect, useRef, useState } from 'react'

export const DESIGN_W = 1920
export const DESIGN_H = 1080

/** Parse 1-based page number from pathname like `/3` or `/03`. */
export function pageFromPath(pathname: string, total: number): number {
  const match = pathname.match(/^\/(\d+)\/?$/)
  if (!match) return 0
  const page = Number.parseInt(match[1], 10)
  if (!Number.isFinite(page) || page < 1) return 0
  return Math.min(total, page) - 1
}

export function pathFromIndex(index: number): string {
  return `/${index + 1}`
}

function clampIndex(i: number, total: number) {
  return Math.max(0, Math.min(total - 1, i))
}

export function usePresentation(total: number) {
  const [idx, setIdx] = useState(() =>
    typeof window === 'undefined' ? 0 : pageFromPath(window.location.pathname, total),
  )
  const [scale, setScale] = useState(1)
  const readyRef = useRef(false)

  const goTo = useCallback(
    (i: number) => {
      setIdx(clampIndex(i, total))
    },
    [total],
  )

  const next = useCallback(() => goTo(idx + 1), [goTo, idx])
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx])

  // Normalize URL on first mount (/ → /1), then sync path on slide change
  useEffect(() => {
    const path = pathFromIndex(idx)
    if (window.location.pathname === path) {
      readyRef.current = true
      return
    }
    if (!readyRef.current) {
      window.history.replaceState({ idx }, '', path)
      readyRef.current = true
      return
    }
    window.history.pushState({ idx }, '', path)
  }, [idx])

  useEffect(() => {
    const onPopState = () => {
      setIdx(pageFromPath(window.location.pathname, total))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [total])

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
        setIdx((i) => clampIndex(i + 1, total))
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        setIdx((i) => clampIndex(i - 1, total))
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

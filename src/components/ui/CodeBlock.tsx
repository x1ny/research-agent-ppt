import type { CSSProperties, ReactNode } from 'react'

type Props = {
  code: string
  fileLabel?: string
  dense?: boolean
  scrollable?: boolean
  className?: string
  style?: CSSProperties
}

const TOKEN_RE =
  /(#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|class|return|if|elif|else|for|in|import|from|as|with|try|except|None|True|False|and|or|not|is|self)\b|\b(\d+)\b/g

function highlightLine(line: string, lineKey: number): ReactNode {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0

  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index))
    }
    const [full, comment, str, keyword, num] = match
    const tokenKey = `${lineKey}-${match.index}`
    if (comment) {
      nodes.push(
        <span key={tokenKey} className="text-[#7d8aa8] italic">
          {comment}
        </span>,
      )
    } else if (str) {
      nodes.push(
        <span key={tokenKey} className="text-[#9ece6a]">
          {str}
        </span>,
      )
    } else if (keyword) {
      nodes.push(
        <span key={tokenKey} className="font-semibold text-[#7aa2f7]">
          {keyword}
        </span>,
      )
    } else if (num) {
      nodes.push(
        <span key={tokenKey} className="text-[#e0af68]">
          {num}
        </span>,
      )
    }
    lastIndex = match.index + full.length
  }
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex))
  }
  return nodes.length ? nodes : ' '
}

export default function CodeBlock({
  code,
  fileLabel,
  dense = false,
  scrollable = false,
  className = '',
  style,
}: Props) {
  const lines = code.replace(/^\n/, '').replace(/\n$/, '').split('\n')

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#1e2a47] bg-[#0d1526] shadow-[0_18px_40px_-24px_rgba(15,23,42,0.55)] ${className}`}
      style={style}
    >
      {fileLabel ? (
        <div
          className={`flex items-center gap-2.5 border-b border-white/10 bg-white/[0.04] font-mono tracking-[0.03em] text-[#93a4c3] ${dense ? 'px-4 py-1.5 text-[0.62rem]' : 'px-6 py-3 text-[0.7rem]'}`}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#7aa2f7]/70" />
          {fileLabel}
        </div>
      ) : null}
      <pre
        className={`m-0 overflow-x-hidden font-mono text-[#dbe4f3] ${
          scrollable ? 'max-h-[460px] overflow-auto' : ''
        } ${dense ? 'px-5 py-3 text-[0.64rem] leading-[1.42]' : 'px-7 py-6 text-[0.82rem] leading-[1.75]'}`}
      >
        <code>
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {highlightLine(line, i)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

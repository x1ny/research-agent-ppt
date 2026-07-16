type Props = {
  current: number
  total: number
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function PageFooter({ current, total }: Props) {
  return (
    <div
      className="pointer-events-none fixed right-[26px] bottom-5 z-50 font-mono text-[17px] text-faint"
      aria-hidden="true"
    >
      {pad(current + 1)} / {pad(total)}
    </div>
  )
}

type Props = { progress: number }

export default function ProgressBar({ progress }: Props) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-line-soft">
      <div
        className="h-full bg-seal transition-[width] duration-400 ease-in-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

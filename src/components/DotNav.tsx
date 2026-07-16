type Props = {
  total: number
  current: number
  onSelect: (i: number) => void
}

export default function DotNav({ total, current, onSelect }: Props) {
  return (
    <nav
      className="fixed top-1/2 right-[22px] z-50 flex -translate-y-1/2 flex-col gap-[18px]"
      aria-label="幻灯片导航"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`cursor-pointer border-none p-0 transition-all duration-250 ease-in-out ${
            i === current ? 'h-[22px] w-[7px] rounded-[5px] bg-accent' : 'h-[7px] w-[7px] rounded-full bg-line'
          }`}
          aria-label={`跳转到第 ${i + 1} 页`}
          aria-current={i === current ? 'true' : undefined}
          onClick={() => onSelect(i)}
        />
      ))}
    </nav>
  )
}

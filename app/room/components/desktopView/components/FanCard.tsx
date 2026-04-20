import { cn } from "@/lib/utils"
import FireEffect from "@/components/fireEffect"

const FanCard = ({
  value,
  isSelected,
  disabled,
  onClick,
}: {
  value: string
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl border-2 cursor-pointer select-none",
      "aspect-[2/3] flex items-center justify-center font-bold text-2xl",
      "transition-colors duration-200",
      isSelected
        ? "bg-neon/[22%] border-neon text-neon ring-2 ring-neon/50 ring-offset-2 ring-offset-background shadow-[0_0_24px_rgb(var(--neon)_/_0.4)]"
        : "bg-neon/[13%] border-neon/45 text-white hover:border-neon/65 hover:bg-neon/[17%]",
      disabled && "cursor-not-allowed opacity-60"
    )}
    onClick={disabled ? undefined : onClick}
  >
    {isSelected && <FireEffect />}
    <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
  </div>
)

export default FanCard

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
      "relative overflow-hidden rounded-lg border-[1.5px] cursor-pointer select-none",
      "aspect-[2/3] flex items-center justify-center font-extrabold text-2xl tabular-nums",
      "bg-[linear-gradient(160deg,hsl(var(--muted))_0%,hsl(var(--background))_100%)]",
      "transition-[border-color,box-shadow,color] duration-200 ease-out",
      isSelected
        ? cn(
            "border-neon text-neon",
            "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08),0_0_0_1px_rgb(var(--neon)_/_0.5),0_0_14px_rgb(var(--neon)_/_0.55),0_0_34px_rgb(var(--neon)_/_0.25),0_16px_28px_-8px_rgb(0_0_0_/_0.65)]",
            "[text-shadow:0_0_12px_rgb(var(--neon)_/_0.7)]"
          )
        : cn(
            "border-neon/25 text-foreground/55",
            "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.05),0_10px_22px_-8px_rgb(0_0_0_/_0.6)]",
            "hover:border-neon/55 hover:text-foreground/90",
            "hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_0_10px_rgb(var(--neon)_/_0.12),0_10px_22px_-8px_rgb(0_0_0_/_0.6)]"
          ),
      disabled && "cursor-not-allowed opacity-60"
    )}
    onClick={disabled ? undefined : onClick}
  >
    {isSelected && <FireEffect />}
    <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
  </div>
)

export default FanCard

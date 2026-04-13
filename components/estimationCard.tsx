"use client"

import { cn } from "@/lib/utils"
import FireEffect from "./fireEffect"

interface EstimationCardProps {
  value: string
  onClick: () => void
  disabled?: boolean
  isSelected?: boolean
}

export default function EstimationCard({ value, onClick, disabled = false, isSelected = false }: EstimationCardProps) {
  return (
    <div
      className={cn(
        "aspect-[2/3] rounded-xl shadow-md cursor-pointer flex items-center justify-center font-bold text-2xl transition-all relative overflow-hidden border",
        isSelected
          ? "bg-neon/[12%] border-neon ring-2 ring-neon/50 ring-offset-2 ring-offset-background text-neon"
          : "bg-neon/[4%] border-neon/20 text-white hover:border-neon/50 hover:bg-neon/[8%]",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-[0_0_20px_rgb(var(--neon)_/_0.15)] hover:scale-105 active:scale-95",
      )}
      onClick={disabled ? undefined : onClick}
    >
      {isSelected && <FireEffect />}
      <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
    </div>
  )
}

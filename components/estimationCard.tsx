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
        "aspect-[2/3] bg-gradient-to-br rounded-xl shadow-md cursor-pointer flex items-center justify-center text-white font-bold text-2xl transition-all relative overflow-hidden",
        isSelected
          ? "from-blue-500 to-blue-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-background"
          : "from-blue-600 to-blue-800",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:scale-105 active:scale-95",
      )}
      onClick={disabled ? undefined : onClick}
    >
      {isSelected && <FireEffect />}
      <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
    </div>
  )
}

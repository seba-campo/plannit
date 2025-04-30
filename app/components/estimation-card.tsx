"use client"

import { cn } from "@/lib/utils"

interface EstimationCardProps {
  value: string
  onClick: () => void
  disabled?: boolean
}

export default function EstimationCard({ value, onClick, disabled = false }: EstimationCardProps) {
  return (
    <div
      className={cn(
        "aspect-[2/3] bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-md cursor-pointer flex items-center justify-center text-white font-bold text-2xl transition-all",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:scale-105 active:scale-95",
      )}
      onClick={disabled ? undefined : onClick}
    >
      {value}
    </div>
  )
}

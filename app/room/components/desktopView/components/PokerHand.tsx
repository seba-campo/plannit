import { cn } from "@/lib/utils"
import FanCard from "./FanCard"

const CARD_WIDTH = 100

const PokerHand = ({
  scaleValues,
  currentPlayerVote,
  onCardSelect,
  disabled,
}: {
  scaleValues: any[]
  currentPlayerVote: string | null
  onCardSelect: (value: any) => void
  disabled: boolean
}) => {
  const count = scaleValues.length
  const maxTilt = 14
  const maxArcDown = 20

  return (
    <div className="flex justify-center items-start pt-2 pb-8" style={{ minHeight: "210px" }}>
      {scaleValues.map((value, i) => {
        const norm = count > 1 ? i / (count - 1) : 0.5
        const rotation = -maxTilt + norm * maxTilt * 2
        const isSelected = String(currentPlayerVote) === String(value)
        const arcDown = Math.pow((norm - 0.5) * 2, 2) * maxArcDown

        return (
          <div
            key={value}
            style={{
              width: CARD_WIDTH,
              marginLeft: i > 0 ? "-22px" : "0",
              marginTop: arcDown,
              transformOrigin: "bottom center",
              transform: `rotate(${rotation}deg)`,
              zIndex: isSelected ? count + 10 : i + 1,
              flexShrink: 0,
            }}
          >
            <div
              className={cn(
                "transition-transform duration-200",
                !disabled && "hover:-translate-y-10",
                isSelected && "-translate-y-10"
              )}
            >
              <FanCard
                value={value}
                isSelected={isSelected}
                disabled={disabled}
                onClick={() => onCardSelect(value)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PokerHand

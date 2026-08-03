import { cn } from "@/lib/utils"
import IPlayer from "@/interfaces/Player"
import { Eye, CheckCircle2, Coffee } from "lucide-react"

const PlayerSeat = ({
  player,
  revealed,
  isMe,
  size = "md",
}: {
  player: IPlayer
  revealed: boolean
  isMe: boolean
  size?: "md" | "sm"
}) => {
  const isSpectator = player.currentStatus === "spectator"
  const isOffline = !player.isOnline
  const sm = size === "sm"

  return (
    <div className={cn("flex flex-col items-center gap-1.5", sm ? "w-16 gap-1" : "w-20", isOffline && "opacity-40")}>
      <div
        className={cn(
          "rounded-lg border-2 flex items-center justify-center font-bold transition-all duration-500",
          sm ? "w-8 h-11 text-xs" : "w-10 h-14 text-sm",
          isSpectator
            ? "border-dashed border-muted-foreground/30 bg-transparent text-muted-foreground/30"
            : revealed
            ? "border-neon bg-neon/10 text-neon scale-110 shadow-[0_0_15px_rgb(var(--neon)_/_0.4)]"
            : player.hasVoted
            ? "border-green-500 bg-green-500/10 text-green-500"
            : "border-neon/20 bg-neon/[4%] text-muted-foreground/30"
        )}
      >
        {isSpectator ? (
          <Eye className={sm ? "h-3 w-3" : "h-4 w-4"} />
        ) : revealed ? (
          <span className={sm ? "text-sm" : "text-base"}>{player.vote === "0" ? "💤" : player.vote}</span>
        ) : player.hasVoted ? (
          <CheckCircle2 className={sm ? "h-4 w-4" : "h-5 w-5"} />
        ) : (
          <Coffee className={sm ? "h-3 w-3" : "h-4 w-4"} />
        )}
      </div>

      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold border-2 uppercase",
          sm ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm",
          isMe
            ? "bg-neon/20 border-neon text-neon"
            : "bg-card border-neon/20 text-foreground"
        )}
        title={player.name}
      >
        {player.name.charAt(0)}
      </div>

      <div className="text-center leading-tight">
        <span
          className={cn("text-muted-foreground truncate block", sm ? "text-[10px] max-w-[58px]" : "text-xs max-w-[72px]")}
          title={player.name}
        >
          {player.name}
        </span>
        {isMe && <span className="text-neon text-[10px]">you</span>}
        {player.userType === "admin" && !isMe && (
          <span className="text-yellow-500/70 text-[10px] block">admin</span>
        )}
      </div>
    </div>
  )
}

export default PlayerSeat

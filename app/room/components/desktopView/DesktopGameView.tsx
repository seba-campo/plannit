"use client"

import { cn } from "@/lib/utils"
import FireEffect from "@/components/fireEffect"
import IPlayer from "@/interfaces/Player"
import { type RoomSession } from "@/lib/rtdb-client/DTOs"
import { Button } from "@/components/ui/button"
import { useRoomActions } from "../../[roomId]/hooks/useRoomActions"
import { Eye, EyeOff, RotateCcw, UserX, CheckCircle2, Coffee } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DesktopGameViewProps {
  roomSession: RoomSession | undefined
  revealed: boolean
  userRole: "admin" | "player"
  userStatus: "player" | "spectator"
  average: string
  currentPlayerVote: string | null
  atLeastOnePlayerVoted: boolean
  setUserStatus: (status: "player" | "spectator") => void
  scaleValues: any[]
  players: IPlayer[]
  getActivePlayersCount: () => number
  getSpectatorsCount: () => number
}

// ─── PlayerSeat ──────────────────────────────────────────────────────────────

const PlayerSeat = ({
  player,
  revealed,
  isMe,
}: {
  player: IPlayer
  revealed: boolean
  isMe: boolean
}) => {
  const isSpectator = player.currentStatus === "spectator"
  const isOffline = !player.isOnline

  return (
    <div className={cn("flex flex-col items-center gap-1.5 w-20", isOffline && "opacity-40")}>
      {/* Card token */}
      <div
        className={cn(
          "w-10 h-14 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-500",
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
          <Eye className="h-4 w-4" />
        ) : revealed ? (
          <span className="text-base">{player.vote === "0" ? "💤" : player.vote}</span>
        ) : player.hasVoted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Coffee className="h-4 w-4" />
        )}
      </div>

      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 uppercase",
          isMe
            ? "bg-neon/20 border-neon text-neon"
            : "bg-card border-neon/20 text-foreground"
        )}
      >
        {player.name.charAt(0)}
      </div>

      {/* Name + badges */}
      <div className="text-center leading-tight">
        <span className="text-xs text-muted-foreground truncate block max-w-[72px]" title={player.name}>
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

// ─── PokerTable ───────────────────────────────────────────────────────────────

const TABLE_W = 580
const TABLE_H = 270
const ORBIT_RX = 240
const ORBIT_RY = 120

const PokerTable = ({
  players,
  revealed,
  average,
  roomSession,
}: {
  players: IPlayer[]
  revealed: boolean
  average: string
  roomSession: RoomSession
}) => {
  const cx = TABLE_W / 2
  const cy = TABLE_H / 2

  return (
    <div className="relative mx-auto" style={{ width: TABLE_W, height: TABLE_H + 70 }}>
      {/* Average badge — top-left, only visible when revealed */}
      {revealed && (
        <div className="absolute top-0 left-0 z-10 flex flex-col items-start animate-in fade-in zoom-in duration-300">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
            Average
          </div>
          <div className="text-4xl font-bold text-neon drop-shadow-[0_0_20px_rgb(var(--neon)_/_0.6)]">
            {average}
          </div>
        </div>
      )}

      {/* Felt oval */}
      <div
        className="absolute rounded-[50%] border border-neon/25 bg-neon/[3%] backdrop-blur-sm"
        style={{ width: TABLE_W - 60, height: TABLE_H - 40, left: 30, top: 20 }}
      >
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-[50%] border border-neon/10" />

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground/20 text-xs tracking-[0.3em] uppercase select-none">
            Planning Poker
          </div>
        </div>
      </div>

      {/* Player seats positioned around the oval */}
      {players.map((player, i) => {
        const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
        const x = cx + ORBIT_RX * Math.cos(angle)
        const y = cy + ORBIT_RY * Math.sin(angle) + 35
        const isMe = player.uniqueId === roomSession.playerId

        return (
          <div
            key={player.id}
            className="absolute"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <PlayerSeat player={player} revealed={revealed} isMe={isMe} />
          </div>
        )
      })}
    </div>
  )
}

// ─── PokerHand (fan of cards) ─────────────────────────────────────────────────

const CARD_WIDTH = 100

// Card rendered in the hand — no scale-on-hover (parent handles lift).
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
  const maxArcDown = 20 // edge cards pushed this many px below center

  return (
    <div className="flex justify-center items-start pt-2 pb-8" style={{ minHeight: "210px" }}>
      {scaleValues.map((value, i) => {
        const norm = count > 1 ? i / (count - 1) : 0.5
        const rotation = -maxTilt + norm * maxTilt * 2
        const isSelected = String(currentPlayerVote) === String(value)
        // Parabola: 0px at center, maxArcDown at edges → creates ∩ arc
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

// ─── DesktopGameView (main export) ────────────────────────────────────────────

const DesktopGameView = ({
  roomSession,
  revealed,
  userRole,
  userStatus,
  average,
  currentPlayerVote,
  atLeastOnePlayerVoted,
  setUserStatus,
  scaleValues,
  players,
  getActivePlayersCount,
  getSpectatorsCount,
}: DesktopGameViewProps) => {
  const { handleCardSelect, handleReveal, handleReset, handleUserTypeToggle } =
    useRoomActions(roomSession, userStatus)

  const isAdmin = userRole === "admin"
  const isSpectator = userStatus === "spectator"

  const activePlayers = getActivePlayersCount()
  const spectators = getSpectatorsCount()

  return (
    <div className="flex flex-col gap-8">
      {/* Controls bar */}
      <div className="flex justify-between items-center px-1">
        <div>
          <p className="text-sm text-muted-foreground">
            {isSpectator
              ? "Watching as spectator"
              : currentPlayerVote
              ? `Your vote: ${currentPlayerVote}`
              : "Pick a card"}
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground/60 mt-0.5">
            <span>{activePlayers} playing</span>
            {spectators > 0 && <span>{spectators} watching</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUserTypeToggle(setUserStatus)}
          >
            <UserX className="mr-2 h-4 w-4" />
            {isSpectator ? "Join as Player" : "Watch as Spectator"}
          </Button>

          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReveal(true, revealed, average)}
                disabled={!revealed && !atLeastOnePlayerVoted}
              >
                {revealed ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                {revealed ? "Revealed" : "Reveal Cards"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReset(true)}
                disabled={!revealed}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Next Round
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Poker table with players */}
      {roomSession && (
        <PokerTable
          players={players}
          revealed={revealed}
          average={average}
          roomSession={roomSession}
        />
      )}

      {/* Divider */}
      <div className="border-t border-neon/10 mx-8" />

      {/* Fan hand or spectator notice */}
      {isSpectator ? (
        <div className="text-center py-6 text-muted-foreground/40 text-sm border border-dashed border-neon/15 rounded-xl mx-4">
          You are watching as a spectator
        </div>
      ) : (
        <PokerHand
          scaleValues={scaleValues}
          currentPlayerVote={currentPlayerVote}
          onCardSelect={(value) => handleCardSelect(value, revealed)}
          disabled={revealed}
        />
      )}
    </div>
  )
}

export default DesktopGameView

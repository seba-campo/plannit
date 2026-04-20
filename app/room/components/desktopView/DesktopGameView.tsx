"use client"

import IPlayer from "@/interfaces/Player"
import { type RoomSession } from "@/lib/rtdb-client/DTOs"
import { Button } from "@/components/ui/button"
import { useRoomActions } from "../../[roomId]/hooks/useRoomActions"
import { Eye, EyeOff, RotateCcw, UserX } from "lucide-react"
import PokerTable from "./components/PokerTable"
import PokerHand from "./components/PokerHand"

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

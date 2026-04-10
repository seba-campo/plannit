"use client"

import { use } from 'react'
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRoomSession } from "./hooks/useRoomSession"
import { useRoomData } from "./hooks/useRoomData"
import { useRoomActions } from "./hooks/useRoomActions"
import Error from "@/app/room/components/error/Error"
import HeaderInformation from "@/app/room/components/header/Header"
import CurrentItemCard from "@/app/room/components/currentItemCard/currentItemCard"
import CurrentItemBanner from "@/app/room/components/currentItemBanner/currentItemBanner"
import PlayerList from "@/app/room/components/playerList/PlayerList"
import ToggleUserType from "@/app/room/components/toggleUserType/ToggleUserType"
import GameBoard from "@/app/room/components/gameBoard/GameBoard"

export default function PlanningPokerRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()

  const {
    roomSession,
    userRole,
    userStatus,
    isSessionLoading,
    sessionError,
    setUserStatus
  } = useRoomSession(roomId)

  const {
    players,
    revealed,
    currentRound,
    isLoading: isDataLoading,
    isConnected,
    average,
    atLeastOnePlayerVoted,
    scaleValues,
    dataError,
    getActivePlayersCount,
    getSpectatorsCount,
    getRoomLongId
  } = useRoomData(roomSession?.roomId || "", !!roomSession, roomSession?.roomCode)

  // Actions for the page (like Logout in header)
  // GameBoard instantiates its own actions, but Header needs logout.
  // We can instantiate actions here for shared needs or just for Logout.
  const { handleLogOut, handleUserTypeToggle, isUpdatingUserType } = useRoomActions(roomSession, userStatus)

  if (isSessionLoading || (isDataLoading && !sessionError && !dataError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    )
  }

  if (sessionError || dataError) {
    return (
      <Error errorMessage={sessionError || dataError || "Unknown error"} />
    )
  }

  if (!roomSession) {
    return (<Error errorMessage={"Error interno, no existe la sesión."} />)
  }

  const isCreator = () => userRole === "admin"
  const isSpectator = () => userStatus === "spectator"

  const getCurrentPlayerVote = () => {
    if (!roomSession || isSpectator()) return null
    const currentPlayer = players.find((p) => p.uniqueId === roomSession.playerId)
    return currentPlayer?.vote
  }

  return (
    <div className="min-h-screen flex flex-col">

      <header className="border-b border-accent py-4">
        <HeaderInformation
          roomId={roomId}
          currentRound={currentRound}
          handleLogOut={() => handleLogOut(router)}
          currentUserType={userRole}
          roomSession={roomSession}
          isConnected={isConnected}
          isCreator={isCreator}
          isSpectator={isSpectator}
        />
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className={`grid grid-cols-1 gap-6 ${isCreator()
          ? 'lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[350px_1fr_350px]'
          : 'lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr]'
          }`}>


          {/* COLUMNA IZQUIERDA - Votación Actual */}
          <div className="w-full order-2 lg:order-1">
            <CurrentItemBanner
              roomId={getRoomLongId()}
            />
          </div>

          {/* COLUMNA CENTRAL - Game Board */}
          <div className="w-full order-1 lg:order-2">
            {/* User Type Toggle Button */}
            {userRole !== "admin" && (
              <ToggleUserType
                isSpectator={isSpectator}
                isCreator={isCreator}
                handleUserTypeToggle={() => handleUserTypeToggle(setUserStatus)}
                isUpdatingUserType={isUpdatingUserType}
                isRevealed={revealed}
              />
            )}

            {/* Board de las cartas. */}
            <GameBoard
              roomSession={roomSession}
              revealed={revealed}
              userRole={userRole}
              userStatus={userStatus}
              currentPlayerVote={getCurrentPlayerVote() ?? null}
              average={isNaN(parseInt(average)) ? scaleValues.indexOf(average) : parseInt(average)}
              atLeastOnePlayerVoted={atLeastOnePlayerVoted}
              setUserStatus={setUserStatus}
              scaleValues={scaleValues}
            />

            {/* Lista de jugadores */}
            <PlayerList
              getActivePlayersCount={getActivePlayersCount}
              getSpectatorsCount={getSpectatorsCount}
              revealed={revealed}
              average={average}
              players={players}
              roomSession={roomSession}
            />
          </div>

          {/* COLUMNA DERECHA - What's Next */}
          {isCreator() && (
            <div className="w-full order-3">
              <CurrentItemCard roomId={getRoomLongId()} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

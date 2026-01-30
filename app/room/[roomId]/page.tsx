"use client"

import { use } from 'react'
import useRoom from "./useRoom"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Error from "@/app/room/components/error/Error"
import HeaderInformation from "@/app/room/components/header/Header"
import CurrentItemCard from "@/app/room/components/currentItemCard/currentItemCard"
import PlayerList from "@/app/room/components/playerList/PlayerList"
import ToggleUserType from "@/app/room/components/toggleUserType/ToggleUserType"
import GameBoard from "@/app/room/components/gameBoard/GameBoard"

export default function PlanningPokerRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()

  const {
    players,
    revealed,
    roomSession,
    currentUserType,
    currentRound,
    isLoading,
    isConnected,
    isUpdatingUserType,
    error,
    handleCardSelect,
    handleUserTypeToggle,
    handleReveal,
    handleReset,
    isCreator,
    isSpectator,
    getCurrentPlayerVote,
    getActivePlayersCount,
    getSpectatorsCount,
    average,
    handleLogOut
  } = useRoom(roomId, router)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Error errorMessage={error}/>
    )
  }

  if(!roomSession){
    return (<Error errorMessage={"Error interno, no existe la sesión."}/>)
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <header className="border-b border-accent py-4">
        <HeaderInformation
          roomId={roomId}
          currentRound={currentRound}
          handleLogOut={handleLogOut}
          currentUserType={currentUserType}
          roomSession={roomSession}
          isConnected={isConnected}
          isCreator={isCreator}
          isSpectator={isSpectator}
        />
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2">
             {/* User Type Toggle Button */}
            {currentUserType !== "admin" && (
              <ToggleUserType
                isSpectator={isSpectator}
                handleUserTypeToggle={handleUserTypeToggle}
                isUpdatingUserType={isUpdatingUserType}
              />
            )}

            {/* Board de las cartas. */}
            <GameBoard
              isSpectator={isSpectator}
              isCreator={isCreator}
              handleCardSelect={handleCardSelect}
              handleReveal={handleReveal}
              handleReset={handleReset}
              revealed={revealed}
              getCurrentPlayerVote={getCurrentPlayerVote}
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

          {/* BARRA LATERAL DERECHA */}
          <div>
           <CurrentItemCard/>
          </div>
        </div>
      </main>
    </div>
  )
}

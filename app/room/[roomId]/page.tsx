"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, RotateCcw, Users, Loader2, Wifi, WifiOff, UserCheck, UserX } from "lucide-react"
import EstimationCard from "@/components/estimation-card"
import PlayerList from "@/components/player-list"
import Link from "next/link"
import { use } from 'react'
import { useRouter } from "next/navigation"
import { useRoom } from "./useRoom"
import { firebaseRoomService, type FirebaseRoom, type RoomSession } from "@/lib/firebase"

interface Player {
  id: string
  name: string
  hasVoted: boolean
  isOnline: boolean
  userType: "admin" | "player" | "spectator"
  uniqueId: string;
  vote: string | null
}

export default function PlanningPokerRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()

  const cardValues = ["1", "2", "3", "5", "8", "13", "21", "?"];
  const {
    players,
    revealed,
    roomSession,
    roomData,
    currentUserType,
    gameState,
    setGameState,
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
    allVoted,
    calculateAverage,
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-accent/50 border-accent">
          <CardContent className="p-6">
            <Alert className="border-red-500 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              <Button className="w-full" onClick={() => window.location.reload()}>
                Reconnect
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-accent py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Planning Poker
          </Link>

          <div className="text-center">
            <div className="text-sm text-blue-400">Room: {roomId}</div>
            {/* {roomData?.roomName && <div className="text-xs text-muted-foreground">{roomData.roomName}</div>} */}
            <div className="text-xs text-muted-foreground">Round {currentRound}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
              <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>

            <div className="text-sm text-muted-foreground">
              Playing as: {roomSession?.playerName}
              <Badge className="ml-2" variant={isSpectator() ? "outline" : isCreator() ? "default" : "secondary"}>
                {currentUserType === "admin" ? "Creator" : currentUserType === "spectator" ? "Spectator" : "Player"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             {/* User Type Toggle Button */}
            {currentUserType !== "admin" && (
              <Card className="mb-4 bg-accent/50 border-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Participation Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        {isSpectator()
                          ? "You're watching as a spectator. Switch to player mode to participate in voting."
                          : "You're participating as a player. Switch to spectator mode to watch without voting."}
                      </p>
                    </div>
                    <Button
                      onClick={handleUserTypeToggle}
                      disabled={isUpdatingUserType}
                      variant={isSpectator() ? "default" : "outline"}
                      className="ml-4"
                    >
                      {isUpdatingUserType ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : isSpectator() ? (
                        <UserCheck className="mr-2 h-4 w-4" />
                      ) : (
                        <UserX className="mr-2 h-4 w-4" />
                      )}
                      {isSpectator() ? "Join as Player" : "Watch as Spectator"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="mb-8 bg-accent/50 border-accent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Estimation Cards</h2>
                    {isSpectator() ? (
                      <p className="text-sm text-muted-foreground">You're watching as a spectator</p>
                    ) : (
                    <p className="text-sm text-muted-foreground">
                      {getCurrentPlayerVote() ? `Your vote: ${getCurrentPlayerVote()}` : "Select your estimate"}
                    </p>
                    )}
                  </div>

                  {isCreator() && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleReveal} disabled={revealed || !allVoted}>
                        {revealed ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                        {revealed ? "Revealed" : "Reveal Cards"}
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        New Round
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                  {cardValues.map((value) => (
                    <EstimationCard
                      key={value}
                      value={value}
                      onClick={() => handleCardSelect(value)}
                      disabled={revealed || isSpectator()}
                      // isSelected={getCurrentPlayerVote()}
                    />
                  ))}
                </div>
                {isSpectator() && (
                  <Alert className="mt-4 border-blue-500 bg-blue-500/10">
                    <AlertDescription className="text-blue-400">
                      You're in spectator mode. You can watch the voting but cannot participate.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-accent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Results ({getActivePlayersCount()} players
                    {getSpectatorsCount() > 0 && `, ${getSpectatorsCount()} spectators`})
                  </h2>

                  {revealed && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Average</div>
                      <div className="text-2xl font-bold text-primary">{calculateAverage()}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg border ${
                        player.id === roomSession?.playerId
                          ? "border-primary bg-primary/10"
                          : "border-accent bg-background"
                      } ${!player.isOnline ? "opacity-50" : ""}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{player.name}</div>
                        <div className="flex gap-1">
                          {player.userType === "admin" && (
                            <Badge variant="default" className="text-xs">
                              Creator
                            </Badge>
                          )}
                          {player.userType === "spectator" && (
                            <Badge variant="outline" className="text-xs">
                              
                            </Badge>
                          )}
                          {!player.isOnline && (
                            <Badge variant="outline" className="text-xs">
                              Offline
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        {player.userType === "spectator" ? (
                          <div className="text-sm text-muted-foreground">Watching</div>
                        ) : revealed ? (
                          <div className="text-2xl font-bold text-primary">{player.vote || "-"}</div>
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full ${player.hasVoted ? "bg-blue-500" : "bg-gray-700"}`}
                          ></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            { roomSession && (
                <PlayerList
                  players={players.map((p, index) => ({
                    id: p.uniqueId,
                    name: p.name,
                    vote: p.vote,
                    hasVoted: p.hasVoted,
                    isOnline: p.isOnline ?? false,
                    userType: p.userType,
                    uniqueId: p.uniqueId
                  }))}
                  currentPlayer={roomSession.playerId}
                  onPlayerChange={() => {}}
                  revealed={revealed}
                />)
              }
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, RotateCcw, Users, Loader2, Wifi, WifiOff } from "lucide-react"
import EstimationCard from "@/components/estimation-card"
import PlayerList from "@/components/player-list"
import Link from "next/link"
import { use } from 'react'
import { useRouter } from "next/navigation"
import { firebaseRoomService, type FirebaseRoom, type RoomSession } from "@/lib/firebase"

interface Player {
  id: string
  name: string
  hasVoted: boolean
  isOnline: boolean
  userType: "admin" | "player"
  vote: string | null
}
export default function PlanningPokerRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const [players, setPlayers] = useState<Player[]>([])
  const [revealed, setRevealed] = useState(false)
  const [roomSession, setRoomSession] = useState<RoomSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<FirebaseRoom | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [gameState, setGameState] = useState<"waiting" | "voting" | "revealed">("waiting")
  const [currentRound, setCurrentRound] = useState(1)


  const router = useRouter()
  const unsubscribeRef = useRef<(() => void)[]>([])

  const cardValues = ["1", "2", "3", "5", "8", "13", "21", "?"]

  // Load session from localStorage and initialize Firebase connection
  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const storedSession = localStorage.getItem("currentRoom")
        if (!storedSession) {
          router.push("/join")
          return
        }

        const session: RoomSession = JSON.parse(storedSession)

        // Validate that the room code matches the URL
        if (session.roomCode != roomId) {
          router.push("/join")
          return
        }

        setRoomSession(session)

        // Initialize Firebase connection
        const roomData = await firebaseRoomService.initializeRoom(session.roomId)

        if (!roomData) {
          setError("Room not found or has been deleted")
          setIsLoading(false)
          return
        }

        setRoomData(roomData)
        setIsConnected(true)

        // Update player's online status
        await firebaseRoomService.updatePlayerStatus(session.roomId, session.playerId, true)

        // Subscribe to real-time updates
        setupRealtimeListeners(session.roomId)
      } catch (err) {
        console.error("Failed to initialize room:", err)
        setError("Failed to connect to room")
        setIsLoading(false)
      }
    }

    initializeRoom()
    console.log(players)
    // Cleanup on unmount
    return () => {
      cleanup()
    }
  }, [roomId, router])

    useEffect(() => {
    // console.log("Jugadores actualizados:", players)
  }, [players])

  // Setup Firebase real-time listeners
  const setupRealtimeListeners = useCallback((roomId: string) => {
    // Listen for room updates
    const roomUnsubscribe = firebaseRoomService.subscribeToRoom(roomId, (room) => {
      if (room) {
        setRoomData(room)
        setRevealed(room.isRevealed || false)
        setGameState(room.gameState || "waiting")
        setCurrentRound(room.currentRound || 1)
        setIsLoading(false)
      }
    })

    // Listen for players updates
    const playersUnsubscribe = firebaseRoomService.subscribeToPlayers(roomId, (playersData) => {
      const data = playersData;
      const playersList: any = Object.entries(data).map(([id, player]) => {
        if (!player) return null  // opcional: protegerte contra errores

        return {
          id,
          currentStatus: player.currentStatus,
          vote: player.vote !== null ? String(player.vote) : null,
          hasVoted: player.hasVoted || false,
          isOnline: player.isOnline || false,
          lastSeen: player.lastSeen || null,
          name: player.name,
          uniqueId: player.uniqueId,
          userType: player.userType,

        }
      }).filter(Boolean) 
      console.log("Se va a renderizar lo siguiente: ", playersList )
      setPlayers(playersList)
      console.log('Seteando players:', playersList)
    })

    unsubscribeRef.current = [roomUnsubscribe, playersUnsubscribe]
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (roomSession) {
      // Update player status to offline before leaving
      firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, false).catch(console.error)
    }

    // Unsubscribe from all listeners
    unsubscribeRef.current.forEach((unsubscribe) => unsubscribe())
    firebaseRoomService.cleanup()
  }, [roomSession])

  // Handle page visibility change (user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (roomSession) {
        const isVisible = !document.hidden
        firebaseRoomService.updatePlayerStatus(roomSession.roomId, roomSession.playerId, isVisible).catch(console.error)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [roomSession])

  // Handle card selection
  const handleCardSelect = async (value: string) => {
    if (!roomSession || revealed) return

    try {
      console.log(roomSession.playerId)
      await firebaseRoomService.updatePlayerVote(roomSession.roomId, roomSession.playerId, value)
    } catch (err) {
      console.error("Failed to update vote:", err)
      setError("Failed to submit vote")
    }
  }

  // Handle reveal votes (only for room creator)
  const handleReveal = async () => {
    if (!roomSession || !isCreator() || revealed) return

    try {
      await firebaseRoomService.revealVotes(roomSession.roomId)
    } catch (err) {
      console.error("Failed to reveal votes:", err)
      setError("Failed to reveal votes")
    }
  }

  // Handle reset votes (only for room creator)
  const handleReset = async () => {
    if (!roomSession || !isCreator()) return

    try {
      await firebaseRoomService.resetVotes(roomSession.roomId)
    } catch (err) {
      console.error("Failed to reset votes:", err)
      setError("Failed to reset votes")
    }
  }

  // Check if current user is the room creator
  const isCreator = () => {
    return roomSession?.playerType === "admin"
  }

  // Get current player's vote
  const getCurrentPlayerVote = () => {
    if (!roomSession) return null
    const currentPlayer = players.find((p) => p.id === roomSession.playerId)
    return currentPlayer?.vote || null
  }

  // Check if all players have voted
  const allVoted = players.filter((p) => p.isOnline).every((player) => player.hasVoted)

  // Calculate average of numeric votes
  const calculateAverage = () => {
    const numericVotes = players
      .filter((p) => p.vote && p.vote !== "?" && p.isOnline)
      .map((p) => Number.parseInt(p.vote as string))
      .filter((vote) => !isNaN(vote))

    if (numericVotes.length === 0) return "-"

    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
  }

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
              {isCreator() && (
                <Badge className="ml-2" variant="secondary">
                  Creator
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-accent/50 border-accent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Estimation Cards</h2>
                    <p className="text-sm text-muted-foreground">
                      {getCurrentPlayerVote() ? `Your vote: ${getCurrentPlayerVote()}` : "Select your estimate"}
                    </p>
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
                      disabled={revealed}
                      isSelected={getCurrentPlayerVote()}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-accent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Results ({players.filter((p) => p.isOnline).length} online)
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
                            <Badge variant="secondary" className="text-xs">
                              Creator
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
                        {revealed ? (
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
            { <PlayerList
                players={players.map((p, index) => {
                  return {
                    id: index + 1,
                    name: p.name,
                    selection: p.vote,
                    hasVoted: p.hasVoted,
                  };
                })}
                currentPlayer={1}
                onPlayerChange={() => {}}
                revealed={revealed}
            />}
          </div>
        </div>
      </main>
    </div>
  )
}

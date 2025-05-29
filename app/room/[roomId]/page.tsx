"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, RotateCcw, Users, Loader2 } from "lucide-react"
import EstimationCard from "@/components/estimation-card"
import PlayerList from "@/components/player-list"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient, getErrorMessage } from "@/lib/api"

interface Player {
  id: number
  name: string
  selection: string | null
  hasVoted: boolean
}

interface RoomSession {
  roomId: string
  roomCode: string
  playerName: string
  playerId?: string
  isCreator: boolean
}

export default function PlanningPokerRoom({ params }: { params: { roomId: string } }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [revealed, setRevealed] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [roomSession, setRoomSession] = useState<RoomSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomName, setRoomName] = useState("")
  const router = useRouter()

  const cardValues = ["1", "2", "3", "5", "8", "13", "21", "?"]

  useEffect(() => {
    // Load room session from localStorage
    const storedSession = localStorage.getItem("currentRoom")
    if (storedSession) {
      try {
        const session: RoomSession = JSON.parse(storedSession)
        if (session.roomCode === params.roomId) {
          setRoomSession(session)
          loadRoomData(session.roomCode)
        } else {
          // Room code doesn't match, redirect to join page
          router.push("/join")
        }
      } catch (err) {
        console.error("Failed to parse room session:", err)
        router.push("/join")
      }
    } else {
      // No session found, redirect to join page
      router.push("/join")
    }
  }, [params.roomId, router])

  const loadRoomData = async (roomCode: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.getRoomDetails(roomCode)

      // Convert API response to local player format
      const apiPlayers = response.players.map((player, index) => ({
        id: index + 1,
        name: player.name,
        selection: null,
        hasVoted: false,
      }))

      setPlayers(apiPlayers)
      setRoomName(response.roomName)

      // Set current player based on session
      if (roomSession?.playerName) {
        const playerIndex = apiPlayers.findIndex((p) => p.name === roomSession.playerName)
        if (playerIndex !== -1) {
          setCurrentPlayer(playerIndex + 1)
        }
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardSelect = (value: string) => {
    setPlayers(
      players.map((player) => (player.id === currentPlayer ? { ...player, selection: value, hasVoted: true } : player)),
    )
  }

  const handleReveal = () => {
    setRevealed(true)
  }

  const handleReset = () => {
    setPlayers(players.map((player) => ({ ...player, selection: null, hasVoted: false })))
    setRevealed(false)
  }

  const handlePlayerChange = (playerId: number) => {
    setCurrentPlayer(playerId)
  }

  const allVoted = players.every((player) => player.hasVoted)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading room...</p>
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
              <Button className="w-full" onClick={() => loadRoomData(params.roomId)}>
                Try Again
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
            <div className="text-sm text-blue-400">Room: {params.roomId}</div>
            {roomName && <div className="text-xs text-muted-foreground">{roomName}</div>}
          </div>
          <div className="text-sm text-muted-foreground">Playing as: {roomSession?.playerName}</div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-accent/50 border-accent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Estimation Cards</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReveal} disabled={revealed || !allVoted}>
                      {revealed ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                      {revealed ? "Revealed" : "Reveal Cards"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                  {cardValues.map((value) => (
                    <EstimationCard
                      key={value}
                      value={value}
                      onClick={() => handleCardSelect(value)}
                      disabled={revealed}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-accent">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Team Results
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg border cursor-pointer ${
                        currentPlayer === player.id ? "border-primary bg-primary/10" : "border-accent bg-background"
                      }`}
                      onClick={() => handlePlayerChange(player.id)}
                    >
                      <div className="font-medium">{player.name}</div>
                      <div className="mt-2 flex justify-center">
                        {revealed ? (
                          <div className="text-2xl font-bold text-primary">{player.selection || "-"}</div>
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
            <PlayerList
              players={players}
              currentPlayer={currentPlayer}
              onPlayerChange={handlePlayerChange}
              revealed={revealed}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

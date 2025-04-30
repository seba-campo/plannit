"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, RotateCcw, Users } from "lucide-react"
import EstimationCard from "@/components/estimation-card"
import PlayerList from "@/components/player-list"
import Link from "next/link"

interface Player {
  id: number
  name: string
  selection: string | null
  hasVoted: boolean
}

export default function PlanningPokerRoom({ params }: { params: { roomId: string } }) {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Alex", selection: null, hasVoted: false },
    { id: 2, name: "Taylor", selection: null, hasVoted: false },
    { id: 3, name: "Jordan", selection: null, hasVoted: false },
    { id: 4, name: "Casey", selection: null, hasVoted: false },
  ])
  const [revealed, setRevealed] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState(1) // Default to first player

  const cardValues = ["1", "2", "3", "5", "8", "13", "21", "?"]

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-accent py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            PlannIt
          </Link>
          <div className="text-sm text-blue-400">Room: {params.roomId}</div>
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
                      className={`p-4 rounded-lg border ${
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

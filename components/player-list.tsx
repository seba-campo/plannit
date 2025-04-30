"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Player {
  id: number
  name: string
  selection: string | null
  hasVoted: boolean
}

interface PlayerListProps {
  players: Player[]
  currentPlayer: number
  onPlayerChange: (id: number) => void
  revealed: boolean
}

export default function PlayerList({ players, currentPlayer, onPlayerChange, revealed }: PlayerListProps) {
  // Calculate average if revealed (excluding "?" votes)
  const calculateAverage = () => {
    if (!players || players.length === 0) return "-"

    const numericVotes = players
      .filter((p) => p.selection && p.selection !== "?")
      .map((p) => Number.parseInt(p.selection as string))

    if (numericVotes.length === 0) return "-"

    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
  }

  if (!players || players.length === 0) {
    return (
      <Card className="bg-accent/50 border-accent">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No players have joined yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-accent/50 border-accent">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                currentPlayer === player.id ? "bg-primary/10" : "hover:bg-accent/80"
              }`}
              onClick={() => onPlayerChange(player.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-muted-foreground">{currentPlayer === player.id && "Current player"}</div>
                </div>
              </div>
              <div>
                {revealed ? (
                  <Badge variant={player.selection ? "default" : "outline"}>{player.selection || "No vote"}</Badge>
                ) : (
                  <Badge variant={player.hasVoted ? "default" : "outline"}>
                    {player.hasVoted ? "Voted" : "Waiting"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {revealed && (
          <div className="mt-6 pt-6 border-t border-accent">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average:</span>
              <span className="text-xl font-bold text-primary">{calculateAverage()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

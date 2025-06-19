"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient, getErrorMessage, type JoinRoomResponse } from "@/lib/api"

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [yourName, setYourName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<JoinRoomResponse | null>(null)
  const router = useRouter()

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.joinRoom({
        roomId: roomCode.trim().toUpperCase(),
        userName: {name: yourName.trim()}
      })

      setRoomData(response)

      // Store room data in localStorage for the session
      localStorage.setItem(
        "currentRoom",
        JSON.stringify({
          roomCode: response.roomCode,
          roomId: response.rtdbKey,
          playerId: response.userData.uniqueId,
          playerName: response.userData.name,
          playerType: response.userData.userType
        }),
      )

      // Redirect to room after successful join
      setTimeout(() => {
        router.push(`/room/${response.roomCode}`)
      }, 1500)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectJoin = () => {
    if (roomData?.roomCode) {
      router.push(`/room/${roomData.roomCode}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-accent py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-2xl font-bold mx-auto text-primary">PlanIt</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-accent/50 border-accent">
          <CardHeader>
            <CardTitle>{roomData ? "Successfully Joined!" : "Join a Room"}</CardTitle>
            <CardDescription>
              {roomData ? `Welcome to ${roomData.roomCode}` : "Enter the room code shared by your team moderator"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {roomData ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Room Details</Label>
                  <div className="p-4 bg-background rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Code:</span>
                      <span className="font-mono text-primary">{roomData.roomCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your Name:</span>
                      <span className="font-medium">{roomData.userData.name}</span>
                    </div>
                  </div>
                </div>

                {/* {roomData.players && roomData.players.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Players in Room ({roomData.players.length})
                    </Label>
                    <div className="p-3 bg-background rounded-md">
                      <div className="space-y-1">
                        {roomData.players.map((player) => (
                          <div key={player.id} className="flex justify-between items-center">
                            <span className="text-sm">{player.name}</span>
                            {player.isCreator && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Creator</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )} */}

                <Alert className="border-green-500 bg-green-500/10">
                  <AlertDescription className="text-green-400">
                    You will be redirected to the room automatically...
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-code">Room Code</Label>
                  <Input
                    id="room-code"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="font-mono uppercase"
                    maxLength={8}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="your-name">Your Name</Label>
                  <Input
                    id="your-name"
                    placeholder="Your name"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter>
            {roomData ? (
              <Button className="w-full" onClick={handleDirectJoin}>
                Go to Room Now
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleJoinRoom}
                disabled={isLoading || !roomCode.trim() || !yourName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining Room...
                  </>
                ) : (
                  "Join Room"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

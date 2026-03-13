"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Loader2, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient, getErrorMessage, type JoinRoomResponse } from "@/lib/api-client/api"
import ParticleField from "@/components/particleField"

type CachedSession = {
  roomCode: string
}

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [yourName, setYourName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<JoinRoomResponse | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storage = localStorage.getItem("cachedRoomCode")
    if (!storage) return

    const session: CachedSession = JSON.parse(storage)
    setRoomCode(session.roomCode)
  }, [])

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const sanitizedName = yourName.trim().replace(/[<>"'`\\]/g, "").slice(0, 30)
    if (!sanitizedName) {
      setError("Please enter a valid name.")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.joinRoom({
        roomId: roomCode.trim().toUpperCase(),
        userName: { name: sanitizedName }
      })

      setRoomData(response)

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

      setTimeout(() => {
        sessionStorage.removeItem("cachedRoomCode")
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
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10">
        <div className="tech-grid" />
      </div>
      <ParticleField />

      {/* Header */}
      <header className="relative z-20 border-b border-accent/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mx-auto text-2xl font-bold text-[rgb(0,255,255)]">PlannIt</h1>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-accent/50 bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-foreground">
              {roomData ? "Successfully Joined!" : "Join a Room"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {roomData
                ? `Welcome to ${roomData.roomCode}`
                : "Enter the room code shared by your team moderator"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {roomData ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Room Details</Label>
                  <div className="space-y-3 rounded-lg border border-accent/50 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Room Code:</span>
                      <span className="font-mono text-[rgb(0,255,255)]">{roomData.roomCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Name:</span>
                      <span className="text-sm font-medium text-foreground">{roomData.userData.name}</span>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-500/50 bg-green-500/10">
                  <AlertDescription className="text-green-400">
                    You will be redirected to the room automatically...
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-code" className="text-muted-foreground">Room Code</Label>
                  <Input
                    id="room-code"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="font-mono uppercase border-accent/50 bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[rgba(0,255,255,0.3)]"
                    maxLength={8}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="your-name" className="text-muted-foreground">Your Name</Label>
                  <Input
                    id="your-name"
                    placeholder="Your name"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    disabled={isLoading}
                    required
                    maxLength={30}
                    className="border-accent/50 bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[rgba(0,255,255,0.3)]"
                  />
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter>
            {roomData ? (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(0,255,255)] px-6 py-3 text-sm font-medium text-background transition-all hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)]"
                onClick={handleDirectJoin}
              >
                Go to Room Now
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(0,255,255)] px-6 py-3 text-sm font-medium text-background transition-all hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                onClick={handleJoinRoom}
                disabled={isLoading || !roomCode.trim() || !yourName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining Room...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Join Room
                  </>
                )}
              </button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

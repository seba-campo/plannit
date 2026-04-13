"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient, getErrorMessage } from "@/lib/api-client/api"
import { type CreateRoomResponse, type VotingTypeKey } from "@/lib/api-client/DTOs"
import ParticleField from "@/components/particleField"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Loader2, 
  Plus 
} from "lucide-react"

export default function CreateRoom() {
  const [yourName, setYourName] = useState("")
  const [votingType, setVotingType] = useState<VotingTypeKey>("history-points")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<CreateRoomResponse | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()

  const handleCreateRoom = async (e: React.FormEvent) => {
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
      const response = await apiClient.createRoom({
        userData: { name: sanitizedName },
        voteType: votingType,
      })

      setRoomData(response)

      localStorage.setItem(
        "currentRoom",
        JSON.stringify({
          roomCode: response.data.room.roomDocCode,
          roomId: response.data.room.roomRtRef,
          playerId: response.data.userData.uniqueId,
          playerName: response.data.userData.name,
          playerType: response.data.userData.userType
        }),
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = async () => {
    if (roomData?.data.room.roomDocId) {
      try {
        await navigator.clipboard.writeText(roomData.data.room.roomDocCode)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error("Failed to copy room code:", err)
      }
    }
  }

  const handleStartSession = () => {
    if (roomData?.data.room.roomDocCode) {
      router.push(`/room/${roomData.data.room.roomDocCode}`)
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
              {roomData ? "Room Created!" : "Create a New Room"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {roomData
                ? "Share this code with your team members to join"
                : "Set up a new planning poker session for your team"}
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
                  <Label className="text-sm font-medium text-muted-foreground">Room Code</Label>
                  <div className="flex items-center justify-between rounded-lg border border-accent/50 bg-background/60 p-4">
                    <span className="font-mono text-xl tracking-wider text-[rgb(0,255,255)]">
                      {roomData.data.room.roomDocCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className={`rounded-md p-2 transition-colors hover:bg-accent/50 ${
                        copySuccess ? "text-green-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-sm text-green-400">Room code copied to clipboard!</p>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Share this code with your team members so they can join your planning session
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRoom} className="space-y-4">
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
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Scoring Type</Label>
                  <Select
                    value={votingType}
                    onValueChange={(val) => setVotingType(val as VotingTypeKey)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-accent/50 bg-background/60 text-foreground focus:ring-[rgba(0,255,255,0.3)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="history-points">Story Points (Fibonacci)</SelectItem>
                      <SelectItem value="t-shirt">T-Shirt Sizing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter>
            {roomData ? (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(0,255,255)] px-6 py-3 text-sm font-medium text-background transition-all hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)]"
                onClick={handleStartSession}
              >
                Start Session
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(0,255,255)] px-6 py-3 text-sm font-medium text-background transition-all hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                onClick={handleCreateRoom}
                disabled={isLoading || !yourName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Room
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

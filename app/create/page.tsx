"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Copy, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient, getErrorMessage, type CreateRoomResponse } from "@/lib/api"

export default function CreateRoom() {
  const [yourName, setYourName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomData, setRoomData] = useState<CreateRoomResponse | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.createRoom({
        userData: {name: yourName.trim()}
      })

      setRoomData(response)

      // Store room data in localStorage for the session
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-accent py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-2xl font-bold mx-auto text-primary">PlannIt</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-accent/50 border-accent">
          <CardHeader>
            <CardTitle>{roomData ? "Room Created!" : "Create a New Room"}</CardTitle>
            <CardDescription>
              {roomData
                ? "Share this code with your team members to join"
                : "Set up a new planning poker session for your team"}
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
                  <Label className="text-sm font-medium">Room Code</Label>
                  <div className="p-4 bg-background rounded-md flex justify-between items-center">
                    <span className="font-mono text-xl tracking-wider text-primary">{roomData.data.room.roomDocCode}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyCode}
                      className={copySuccess ? "text-green-400" : ""}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copySuccess && <p className="text-sm text-green-400">Room code copied to clipboard!</p>}
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Share this code with your team members so they can join your planning session
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRoom} className="space-y-4">
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
              <Button className="w-full" onClick={handleStartSession}>
                Start Session
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleCreateRoom}
                disabled={isLoading  || !yourName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

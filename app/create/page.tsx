"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("")
  const [yourName, setYourName] = useState("")
  const [roomCreated, setRoomCreated] = useState(false)
  const [roomCode, setRoomCode] = useState("")
  const router = useRouter()

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would create a room on the server
    // For now, we'll just generate a random room code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(generatedCode)
    setRoomCreated(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode)
  }

  const handleStartSession = () => {
    router.push(`/room/${roomCode}`)
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
            <CardTitle>{roomCreated ? "Room Created!" : "Create a New Room"}</CardTitle>
            <CardDescription>
              {roomCreated
                ? "Share this code with your team members to join"
                : "Set up a new planning poker session for your team"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {roomCreated ? (
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-md flex justify-between items-center">
                  <span className="font-mono text-xl tracking-wider text-primary">{roomCode}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Share this code with your team members so they can join your planning session
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    placeholder="Sprint Planning"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
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
                    required
                  />
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter>
            {roomCreated ? (
              <Button className="w-full" onClick={handleStartSession}>
                Start Session
              </Button>
            ) : (
              <Button className="w-full" onClick={handleCreateRoom}>
                Create Room
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

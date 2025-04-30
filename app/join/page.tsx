"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [yourName, setYourName] = useState("")
  const router = useRouter()

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate the room code on the server
    // For now, we'll just redirect to the room page
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
            <CardTitle>Join a Room</CardTitle>
            <CardDescription>Enter the room code shared by your team moderator</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-code">Room Code</Label>
                <Input
                  id="room-code"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                  maxLength={6}
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
          </CardContent>

          <CardFooter>
            <Button className="w-full" onClick={handleJoinRoom}>
              Join Room
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

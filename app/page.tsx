"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus, Users } from "lucide-react"
import { useRoomExitGuard } from "./room/[roomId]/useExitRoom"

export default function LandingPage() {
  useRoomExitGuard();
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Neon Tech Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950"></div>

        {/* Tech grid overlay */}
        <div className="tech-grid"></div>

        {/* Neon elements */}
        <div className="absolute inset-0">
          {/* Circuit lines */}
          <div className="circuit-lines">
            <div className="circuit-line circuit-line-1"></div>
            <div className="circuit-line circuit-line-2"></div>
            <div className="circuit-line circuit-line-3"></div>
          </div>

          {/* Hexagonal elements */}
          <div className="hex-container">
            <div className="hex-element hex-1"></div>
            <div className="hex-element hex-2"></div>
            <div className="hex-element hex-3"></div>
          </div>

          {/* Neon orbs */}
          <div className="neon-orb neon-orb-1"></div>
          <div className="neon-orb neon-orb-2"></div>

          {/* Data nodes */}
          <div className="data-nodes">
            <div className="data-node node-1"></div>
            <div className="data-node node-2"></div>
            <div className="data-node node-3"></div>
            <div className="data-node node-4"></div>
          </div>

          {/* Connection lines */}
          <div className="connection-lines">
            <div className="connection-line conn-1"></div>
            <div className="connection-line conn-2"></div>
            <div className="connection-line conn-3"></div>
          </div>

          {/* Scanning line */}
          <div className="scan-line"></div>
        </div>
      </div>

      <header className="border-b border-accent py-4 relative z-10 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">PlannIt</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Estimate together, decide faster
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A simple, effective way for agile teams to estimate and plan their work
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-accent hover:border-primary transition-all duration-500 bg-accent/60 backdrop-blur-md tech-card-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Room
                </CardTitle>
                <CardDescription>Start a new planning session as a moderator</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a new room where you can invite your team members to join and start estimating tasks together.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  asChild
                >
                  <Link href="/create">
                    Create a new room
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-accent hover:border-primary transition-all duration-500 bg-accent/60 backdrop-blur-md tech-card-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Join Room
                </CardTitle>
                <CardDescription>Join an existing planning session</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enter a room code to join your team's planning poker session and participate in the estimation
                  process.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 bg-transparent"
                  variant="outline"
                  asChild
                >
                  <Link href="/join">
                    Join existing room
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-accent py-6 relative z-10 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Planning Poker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
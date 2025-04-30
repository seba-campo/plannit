import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-accent py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">PlannIt</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Estimate together, decide faster</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A simple, effective way for agile teams to estimate and plan their work
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-accent hover:border-primary transition-colors bg-accent/50">
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
                <Button className="w-full group" asChild>
                  <Link href="/create">
                    Create a new room
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-accent hover:border-primary transition-colors bg-accent/50">
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
                <Button className="w-full group" variant="outline" asChild>
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

      <footer className="border-t border-accent py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlannIt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
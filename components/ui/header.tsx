import React from "react"
import Link from "next/link"
import { Button } from "./button"
import { ArrowRight } from "lucide-react"

export const HeaderComponent = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-accent/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className='w-[200px] text-center cursor-pointer'>
            <Button
                variant='ghost'
                size='sm'
                className="text-2xl font-bold text-neon hover:bg-transparent hover:text-neon active:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                asChild
            >
                <Link href={'/'}>PlannIt</Link>
            </Button>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/join">Join Room</Link>
            </Button>
            <Button
              size="sm"
              className="bg-neon text-background hover:bg-neon-hover"
              asChild
            >
              <Link href="/create">
                Create Room
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
    )
}
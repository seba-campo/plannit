"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Users } from "lucide-react"
import { FloatingCards } from "./floating-cards"

export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {/* Left: Text content */}
        <div className="flex max-w-2xl flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Estimate
            <br />
            <span className="text-neon">together.</span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Real-time planning poker for agile teams. Align on complexity, eliminate bias, and ship with confidence.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="group h-14 bg-neon px-8 text-base font-semibold text-background hover:bg-neon-hover hover:shadow-lg hover:shadow-[rgb(var(--neon)_/_0.25)]"
              asChild
            >
              <Link href="/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Room
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group h-14 border-neon/30 bg-transparent px-8 text-base font-semibold text-foreground backdrop-blur-sm hover:border-neon/50 hover:bg-neon/5"
              asChild
            >
              <Link href="/join">
                <Users className="mr-2 h-5 w-5" />
                Join Room
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: 3D Floating Cards */}
        <div className="flex items-center justify-center lg:justify-end">
          <FloatingCards />
        </div>
      </div>
    </section>
  )
}

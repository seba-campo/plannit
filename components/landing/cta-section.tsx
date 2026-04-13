import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">
          Ready to plan smarter?
        </h2>
        <p className="mb-10 text-lg text-muted-foreground">
          No signup, no installation. Create a room and start estimating in seconds.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="group h-14 bg-neon px-10 text-base font-semibold text-background hover:bg-neon-hover hover:shadow-lg hover:shadow-[rgb(var(--neon)_/_0.25)]"
            asChild
          >
            <Link href="/create">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 border-neon/30 bg-transparent px-10 text-base font-semibold text-foreground hover:border-neon/50 hover:bg-neon/5"
            asChild
          >
            <Link href="/join">
              Join a Room
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

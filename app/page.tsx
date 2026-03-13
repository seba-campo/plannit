"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Users, Zap, Shield, BarChart3, Clock } from "lucide-react"
import ParticleField from "@/components/particleField"
import { useEffect, useRef, useState } from "react"
import { CustomFooter } from "@/components/ui/footer"
import { HeaderComponent } from "@/components/ui/header"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  comingSoon = false,
}: {
  icon: React.ElementType
  title: string
  description: string
  comingSoon?: boolean
}) {
  return (
    <div className={`group relative flex flex-col gap-3 rounded-xl border p-6 backdrop-blur-sm transition-all duration-500 ${comingSoon ? "border-accent/40 bg-card/20 opacity-60" : "border-accent bg-card/40 hover:border-[rgba(0,255,255,0.3)] hover:bg-card/60"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${comingSoon ? "bg-accent/50" : "bg-accent"}`}>
          <Icon className={`h-5 w-5 ${comingSoon ? "text-[rgba(0,255,255,0.5)]" : "text-[rgb(0,255,255)]"}`} />
        </div>
        {comingSoon && (
          <span className="rounded-full border border-[rgba(0,255,255,0.2)] bg-[rgba(0,255,255,0.05)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[rgba(0,255,255,0.6)]">
            Coming soon
          </span>
        )}
      </div>
      <h3 className={`text-lg font-semibold ${comingSoon ? "text-foreground/60" : "text-foreground"}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${comingSoon ? "text-muted-foreground/60" : "text-muted-foreground"}`}>{description}</p>
      {!comingSoon && (
        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: "0 0 30px rgba(0,255,255,0.05), 0 0 60px rgba(59,130,246,0.03)" }} />
      )}
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(0,255,255,0.3)] bg-accent text-lg font-bold text-[rgb(0,255,255)]">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10">
        <div className="tech-grid" />
      </div>
      <ParticleField />

      <HeaderComponent/>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent/50 px-4 py-1.5 text-xs font-medium text-[rgb(0,255,255)] backdrop-blur-sm">
            <Zap className="h-3 w-3" />
            Agile estimation for modern teams
          </div>

          <h2 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Estimate together,{" "}
            <span className="text-[rgb(0,255,255)]">
              decide faster
            </span>
          </h2>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The real-time planning poker tool that helps agile teams align on complexity,
            eliminate bias, and ship with confidence.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="group bg-[rgb(0,255,255)] px-8 text-background hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)]"
              asChild
            >
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create a Room
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-accent bg-card/30 px-8 text-foreground backdrop-blur-sm hover:border-[rgba(0,255,255,0.3)] hover:bg-card/50"
              asChild
            >
              <Link href="/join">
                <Users className="mr-2 h-4 w-4" />
                Join Existing Room
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-accent/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 md:grid-cols-3 md:gap-8">
          {[
            { value: 100, suffix: "%", label: "Free to use" },
            { value: 0, suffix: "", label: "Setup required", display: "Zero" },
            { value: 50, suffix: "ms", label: "Real-time sync" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl font-bold text-[rgb(0,255,255)] md:text-4xl">
                {stat.display ?? <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[rgb(0,255,255)]">
              Features
            </span>
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Everything your team needs
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Built for speed, designed for clarity. PlannIt streamlines your sprint planning workflow.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Real-Time Voting"
              description="All votes sync instantly. See your team align in real time without any delays."
            />
            <FeatureCard
              icon={Shield}
              title="Bias-Free Estimation"
              description="Votes remain hidden until revealed, preventing anchoring bias and ensuring honest estimates."
            />
            <FeatureCard
              icon={BarChart3}
              title="Instant Analytics"
              description="Average, median, and distribution shown automatically when cards are revealed."
            />
            <FeatureCard
              icon={Users}
              title="Observer Mode"
              description="Stakeholders can watch without voting, keeping sessions focused and efficient."
            />
            <FeatureCard
              icon={Clock}
              title="Session History"
              description="Review past estimations to track patterns and improve accuracy over time."
              comingSoon
            />
            <FeatureCard
              icon={Plus}
              title="Custom Card Sets"
              description="Fibonacci, T-shirt sizes, or create your own. Adapt to your team's workflow."
              comingSoon
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 border-y border-accent/50 bg-card/20 px-4 py-20 backdrop-blur-sm md:py-28">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[rgb(0,255,255)]">
              How It Works
            </span>
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Up and running in seconds
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            <StepCard
              number="1"
              title="Create a Room"
              description="Start a new session and get a unique room code to share with your team."
            />
            <StepCard
              number="2"
              title="Invite Your Team"
              description="Share the code. Team members join instantly from any device, no signup needed."
            />
            <StepCard
              number="3"
              title="Start Estimating"
              description="Add items, vote together, reveal results, and reach consensus as a team."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Ready to plan smarter?
          </h2>
          <p className="mb-8 text-muted-foreground">
            No signup, no installation. Create a room and start estimating in seconds.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="group bg-[rgb(0,255,255)] px-8 text-background hover:bg-[rgb(0,220,220)] hover:shadow-lg hover:shadow-[rgba(0,255,255,0.2)]"
              asChild
            >
              <Link href="/create">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent bg-card/30 px-8 text-foreground backdrop-blur-sm hover:border-[rgba(0,255,255,0.3)] hover:bg-card/50"
              asChild
            >
              <Link href="/join">
                Join a Room
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CustomFooter/>
    </div>
  )
}

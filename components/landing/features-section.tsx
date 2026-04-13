import { Zap, Shield, BarChart3, Users, Clock, Plus } from "lucide-react"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  comingSoon?: boolean
}

function FeatureCard({ icon: Icon, title, description, comingSoon = false }: FeatureCardProps) {
  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border p-8 transition-all duration-500 ${
        comingSoon
          ? "border-neon/10 bg-neon/[2%] opacity-50"
          : "border-neon/15 bg-neon/[3%] hover:border-neon/30 hover:bg-neon/5"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          comingSoon ? "bg-neon/5" : "bg-neon/10"
        }`}>
          <Icon className={`h-6 w-6 ${comingSoon ? "text-neon/30" : "text-neon"}`} />
        </div>
        {comingSoon && (
          <span className="rounded-full border border-neon/15 bg-neon/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neon/50">
            Coming soon
          </span>
        )}
      </div>
      <h3 className={`text-xl font-semibold ${comingSoon ? "text-foreground/40" : "text-foreground"}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${comingSoon ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
        {description}
      </p>
    </div>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Voting",
      description: "All votes sync instantly across your team. See alignment happen in real time without any delays.",
    },
    {
      icon: Shield,
      title: "Bias-Free Estimation",
      description: "Votes remain hidden until revealed, preventing anchoring bias and ensuring honest estimates.",
    },
    {
      icon: BarChart3,
      title: "Instant Analytics",
      description: "Average, median, and distribution shown automatically when cards are revealed.",
    },
    {
      icon: Users,
      title: "Observer Mode",
      description: "Stakeholders can watch without voting, keeping sessions focused and efficient.",
    },
    {
      icon: Clock,
      title: "Session History",
      description: "Review past estimations to track patterns and improve accuracy over time.",
      comingSoon: true,
    },
    {
      icon: Plus,
      title: "Custom Card Sets",
      description: "Fibonacci, T-shirt sizes, or create your own. Adapt to your team's workflow.",
      comingSoon: true,
    },
  ]

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 flex flex-col items-center gap-4 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-neon">
            Features
          </span>
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
            Everything your team needs
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

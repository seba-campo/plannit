import { Zap, Shield, BarChart3, Users, Clock, Plus } from "lucide-react"

interface FeatureRowProps {
  icon: React.ElementType
  title: string
  description: string
  index: number
  comingSoon?: boolean
  isNew?: boolean
}

function FeatureRow({ icon: Icon, title, description, index, comingSoon = false, isNew = false }: FeatureRowProps) {
  return (
    <div
      className={`group relative border-b border-white/5 py-8 pl-10 pr-4 last:border-b-0 transition-colors duration-500 ${
        comingSoon ? "opacity-40" : "hover:bg-neon/[2%]"
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-0.5 transition-all duration-500 ${
          comingSoon
            ? "bg-neon/10"
            : "bg-neon/20 group-hover:bg-neon/80 group-hover:shadow-[0_0_12px_2px_rgba(0,255,255,0.45)]"
        }`}
      />

      <div className="flex items-center gap-8">
        {/* Number */}
        <span className="w-7 shrink-0 font-mono text-xs font-medium tracking-widest text-neon/25 transition-colors duration-500 group-hover:text-neon/55">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {comingSoon && (
              <span className="rounded-full border border-neon/15 bg-neon/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon/50">
                Coming soon
              </span>
            )}
            {isNew && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                New
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {/* Icon */}
        <Icon
          className={`h-5 w-5 shrink-0 transition-all duration-500 ${
            comingSoon ? "text-neon/20" : "text-neon/30 group-hover:text-neon/70"
          }`}
        />
      </div>
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
      icon: Plus,
      title: "Custom Card Sets",
      description: "Fibonacci, T-shirt sizes, or create your own. Adapt to your team's workflow.",
      isNew: true,
    },
    {
      icon: Clock,
      title: "Session History",
      description: "Review past estimations to track patterns and improve accuracy over time.",
      comingSoon: true,
    },
  ]

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-20 flex flex-col items-center gap-4 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-neon">Features</span>
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">Everything your team needs</h2>
        </div>

        <div>
          {features.map((feature, index) => (
            <FeatureRow key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

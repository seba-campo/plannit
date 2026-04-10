function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div 
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.05)] text-2xl font-bold text-[rgb(0,255,255)]"
        style={{ boxShadow: "0 0 30px rgba(0,255,255,0.1)" }}
      >
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Create a Room",
      description: "Start a new session and get a unique room code to share with your team.",
    },
    {
      number: "2",
      title: "Invite Your Team",
      description: "Share the code. Team members join instantly from any device, no signup needed.",
    },
    {
      number: "3",
      title: "Start Estimating",
      description: "Add items, vote together, reveal results, and reach consensus as a team.",
    },
  ]

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20 flex flex-col items-center gap-4 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[rgb(0,255,255)]">
            How It Works
          </span>
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
            Up and running in seconds
          </h2>
        </div>

        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}

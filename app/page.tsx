import ParticleField from "@/components/particleField"
import { CustomFooter } from "@/components/ui/footer"
import { HeaderComponent } from "@/components/ui/header"
import { HeroSection, FeaturesSection, HowItWorksSection, CTASection } from "@/components/landing"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[rgb(5,10,20)]">
      {/* Background layers */}
      <div className="fixed inset-0 -z-20 bg-[rgb(5,10,20)]" />
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="tech-grid" />
      </div>
      <ParticleField />

      <HeaderComponent />

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <CustomFooter />
    </div>
  )
}

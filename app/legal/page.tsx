import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"
import type { Metadata } from "next"
import { CustomFooter } from "@/components/ui/footer"
import { HeaderComponent } from "@/components/ui/header"

export const metadata: Metadata = {
  title: "Terms & Conditions — PlannIt",
  description: "Read PlannIt's Terms and Conditions of use.",
}

const LAST_UPDATED = "March 10, 2026"

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using PlannIt ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors and users of the Service.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `PlannIt is a free, real-time planning poker tool designed to help agile development teams conduct estimation sessions. The Service allows users to create temporary planning rooms, invite team members, submit story-point estimates, and reveal results collaboratively. No account creation or personal registration is required to use the Service.`,
  },
  {
    id: "use",
    title: "3. Use of the Service",
    content: `You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:\n\n• Use the Service for any unlawful, harmful, or disruptive purpose.\n• Attempt to interfere with, compromise, or disrupt the Service's servers, networks, or underlying infrastructure.\n• Scrape, crawl, or systematically extract data from the Service without prior written consent.\n• Impersonate any person or entity, or misrepresent your affiliation with any person or entity.\n• Transmit any content that is offensive, defamatory, harassing, or otherwise objectionable.\n• Attempt to gain unauthorized access to any part of the Service or its related systems.`,
  },
  {
    id: "data",
    title: "4. Data and Privacy",
    content: `PlannIt does not require user accounts and does not collect personal information such as names, email addresses, or payment details. Planning sessions are identified by temporary room codes and are not permanently associated with any individual.\n\nSession data (room state, votes, and participant nicknames) is stored temporarily in our real-time database to support active sessions. This data is not sold, shared with third parties for marketing purposes, or used to identify individuals.\n\nBy using the Service, you acknowledge that any content you enter (nicknames, story titles, estimates) may be visible to all participants in your room. Do not enter sensitive, confidential, or personally identifiable information into the Service.`,
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    content: `All content, branding, design, code, and materials comprising the Service are the property of PlannIt and are protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the Service for its intended purpose.\n\nYou may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any portion of the Service without prior written permission.`,
  },
  {
    id: "availability",
    title: "6. Service Availability",
    content: `PlannIt is provided on an "as available" basis. We do not guarantee that the Service will be uninterrupted, error-free, or available at all times. We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any time without notice.\n\nWe are not liable for any loss or inconvenience caused by scheduled or unscheduled downtime, maintenance, or service interruptions.`,
  },
  {
    id: "disclaimer",
    title: "7. Disclaimer of Warranties",
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.\n\nWe do not warrant that the Service will meet your requirements, that results obtained from use of the Service will be accurate or reliable, or that any defects in the Service will be corrected.`,
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PLANNIT AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\nIN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID (IF ANY) TO USE THE SERVICE.`,
  },
  {
    id: "third-party",
    title: "9. Third-Party Services",
    content: `The Service may use third-party infrastructure providers (such as Firebase by Google) to deliver its functionality. Your use of the Service is also subject to any applicable terms and policies of those providers. We are not responsible for the practices or content of third-party services.`,
  },
  {
    id: "changes",
    title: "10. Changes to These Terms",
    content: `We reserve the right to update or modify these Terms at any time. Changes will be reflected by an updated "Last updated" date at the top of this page. Continued use of the Service after any changes constitutes your acceptance of the revised Terms. We encourage you to review this page periodically.`,
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the competent courts.`,
  },
  {
    id: "contact",
    title: "12. Contact",
    content: `If you have any questions or concerns regarding these Terms and Conditions, you may reach out via the contact information available at sebacampo.vercel.app.`,
  },
]

export default function LegalPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10">
        <div className="tech-grid opacity-40" />
      </div>

      {/* Header */}
      <HeaderComponent/>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10 border-b border-accent/30 pb-8">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-[rgb(0,255,255)]">
            Legal
          </span>
          <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: <span className="text-foreground/70">{LAST_UPDATED}</span>
          </p>
        </div>

        {/* Intro */}
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
          Please read these Terms and Conditions carefully before using PlannIt. These terms govern
          your access to and use of the Service. By using PlannIt, you agree to be bound by these
          terms.
        </p>

        {/* Table of Contents */}
        <nav
          aria-label="Table of contents"
          className="mb-12 rounded-xl border border-accent/30 bg-card/30 p-5 backdrop-blur-sm"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(0,255,255)]">
            Contents
          </p>
          <ol className="space-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="mb-3 text-lg font-semibold text-foreground">{section.title}</h2>
              <div className="space-y-2">
                {section.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Back to top */}
        <div className="mt-16 border-t border-accent/30 pt-8 text-center">
        <a
            href="#"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
            Back to top ↑
        </a>
        </div>
    </main>

    <CustomFooter/>
    </div>
    )
}

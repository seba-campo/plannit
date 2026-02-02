import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  author: "Sebastián Campo",
  description: "Agile estimation made easy",
  generator: 'v1.2',
  keywords: [
    "Planning Poker",
    "Agile Estimation",
    "Scrum Poker",
    "Story Point Estimation",
    "Agile Development",
    "Task Estimation",
    "Remote Teams",
    "Collaborative Planning",
    "Software Development",
    "Project Management",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
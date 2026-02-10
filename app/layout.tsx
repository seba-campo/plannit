import type React from "react"
import "../styles/globals.css"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/themeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PlannIt",
  description: "Agile estimation made easy",
    generator: 'v1.2'
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

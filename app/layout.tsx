import type React from "react"
import "../styles/globals.css"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/themeProvider"
import Script from "next/script"

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
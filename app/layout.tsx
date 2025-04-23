import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { TopicsProvider } from "@/contexts/topics-context"
import { QuizProvider } from "@/contexts/quiz-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flutter Interview Prep",
  description: "Prepare for Flutter interviews with comprehensive resources and practice",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TopicsProvider>
            <QuizProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </QuizProvider>
          </TopicsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

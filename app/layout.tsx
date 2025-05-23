import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DefinitionsProvider } from "@/contexts/definitions-context"
import { TopicsProvider } from "@/contexts/topics-context"
import { QuizProvider } from "@/contexts/quiz-context"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DefinitionsProvider>
          <TopicsProvider>
            <QuizProvider>
              <AuthProvider>{children}</AuthProvider>
            </QuizProvider>
          </TopicsProvider>
        </DefinitionsProvider>
      </body>
    </html>
  )
}

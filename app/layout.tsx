import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-context"
import { Toaster } from "@/components/ui/toaster"
import { DefinitionsProvider } from "@/contexts/definitions-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flutter Interview Prep",
  description: "Prepare for Flutter interviews with comprehensive resources and practice questions",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DefinitionsProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </DefinitionsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

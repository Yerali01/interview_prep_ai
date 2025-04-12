"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth/auth-provider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Load theme from user preferences if logged in
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.from("users").select("theme").eq("id", user.id).single()

          if (data && data.theme) {
            setTheme(data.theme as Theme)
          }
        } catch (error) {
          console.error("Error loading user theme:", error)
        }
      }
    }

    loadUserTheme()
  }, [user, supabase])

  // Save theme to user preferences when changed
  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme)

    if (user) {
      try {
        await supabase.from("users").update({ theme: newTheme }).eq("id", user.id)
      } catch (error) {
        console.error("Error saving user theme:", error)
      }
    }
  }

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme: updateTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

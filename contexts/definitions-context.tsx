"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { firebaseGetDefinitions, type Definition } from "@/lib/firebase-service"

interface DefinitionsContextType {
  definitions: Definition[]
  loading: boolean
  error: string | null
  refreshDefinitions: () => Promise<void>
}

const DefinitionsContext = createContext<DefinitionsContextType | undefined>(undefined)

export function DefinitionsProvider({ children }: { children: React.ReactNode }) {
  const [definitions, setDefinitions] = useState<Definition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDefinitions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔥 Fetching definitions from Firebase...")

      const data = await firebaseGetDefinitions()
      console.log("🔥 Firebase definitions received:", data.length)

      setDefinitions(data)
    } catch (err) {
      console.error("❌ Error fetching definitions from Firebase:", err)
      setError("Failed to load definitions from Firebase")
    } finally {
      setLoading(false)
    }
  }

  const refreshDefinitions = async () => {
    await fetchDefinitions()
  }

  useEffect(() => {
    fetchDefinitions()
  }, [])

  return (
    <DefinitionsContext.Provider
      value={{
        definitions,
        loading,
        error,
        refreshDefinitions,
      }}
    >
      {children}
    </DefinitionsContext.Provider>
  )
}

export function useDefinitions() {
  const context = useContext(DefinitionsContext)
  if (context === undefined) {
    throw new Error("useDefinitions must be used within a DefinitionsProvider")
  }
  return context
}

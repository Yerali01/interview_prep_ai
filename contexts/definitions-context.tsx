"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type Definition, getDefinitions } from "@/lib/supabase"

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
      const data = await getDefinitions()
      setDefinitions(data)
    } catch (err) {
      console.error("Error fetching definitions:", err)
      setError("Failed to load definitions")
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

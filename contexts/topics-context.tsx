"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { firebaseGetTopics } from "@/lib/firebase-service-fixed"

interface Topic {
  id: string
  name: string
  description: string
}

interface TopicsContextProps {
  topics: Topic[]
  loading: boolean
  error: string | null
  fetchTopics: () => Promise<void>
  lastFetched: Date | null
}

const TopicsContext = createContext<TopicsContextProps | undefined>(undefined)

interface TopicsProviderProps {
  children: ReactNode
}

export const TopicsProvider: React.FC<TopicsProviderProps> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔥 Fetching topics from Firebase...")

      const topicsData = await firebaseGetTopics()
      console.log("🔥 Firebase topics data received:", topicsData)

      if (Array.isArray(topicsData)) {
        setTopics(topicsData)
      } else {
        console.warn("⚠️ Topics data is not an array:", topicsData)
        setTopics([])
      }

      setLastFetched(new Date())
    } catch (err) {
      console.error("❌ Error fetching topics:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch topics")
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const value: TopicsContextProps = {
    topics,
    loading,
    error,
    fetchTopics,
    lastFetched,
  }

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>
}

export const useTopics = (): TopicsContextProps => {
  const context = useContext(TopicsContext)
  if (!context) {
    throw new Error("useTopics must be used within a TopicsProvider")
  }
  return context
}

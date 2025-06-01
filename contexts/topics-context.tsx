"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { firebaseGetTopics } from "@/lib/firebase-service-fixed"

interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string
  level: string
  estimated_time: number
  createdAt?: string
  updatedAt?: string
}

interface TopicsContextType {
  topics: Topic[]
  loading: boolean
  error: string | null
  refreshTopics: () => Promise<void>
  lastFetched: string | null
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined)

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<string | null>(null)

  const sortTopicsByDifficulty = (topics: Topic[]) => {
    const difficultyOrder = { junior: 1, middle: 2, senior: 3 }
    return topics.sort((a, b) => {
      const aOrder = difficultyOrder[a.level as keyof typeof difficultyOrder] || 999
      const bOrder = difficultyOrder[b.level as keyof typeof difficultyOrder] || 999
      return aOrder - bOrder
    })
  }

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔥 Fetching topics from Firebase...")

      const fetchedTopics = await firebaseGetTopics()
      console.log("✅ Topics fetched:", fetchedTopics)

      const sortedTopics = sortTopicsByDifficulty(fetchedTopics)
      setTopics(sortedTopics)
      setLastFetched(new Date().toISOString())
    } catch (err) {
      console.error("❌ Error fetching topics:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch topics")
    } finally {
      setLoading(false)
    }
  }

  const refreshTopics = async () => {
    await fetchTopics()
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  return (
    <TopicsContext.Provider
      value={{
        topics,
        loading,
        error,
        refreshTopics,
        lastFetched,
      }}
    >
      {children}
    </TopicsContext.Provider>
  )
}

export function useTopics() {
  const context = useContext(TopicsContext)
  if (context === undefined) {
    throw new Error("useTopics must be used within a TopicsProvider")
  }
  return context
}

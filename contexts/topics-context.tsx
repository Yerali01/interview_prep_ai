"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getTopics, type Topic } from "@/lib/supabase"

interface TopicsContextType {
  topics: Topic[]
  loading: boolean
  error: string | null
  refreshTopics: () => Promise<void>
  lastFetched: number | null
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined)

export function TopicsProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<number | null>(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)
      const topicsData = await getTopics()

      // Sort topics by level: junior -> middle -> senior
      const levelOrder = { junior: 1, middle: 2, senior: 3 }
      const sortedTopics = [...topicsData].sort(
        (a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder],
      )

      setTopics(sortedTopics)
      setLastFetched(Date.now())

      // Store in localStorage for persistence across page refreshes
      localStorage.setItem("cachedTopics", JSON.stringify(sortedTopics))
      localStorage.setItem("topicsCacheTimestamp", Date.now().toString())
    } catch (err) {
      console.error("Error fetching topics:", err)
      setError("Failed to load topics")
    } finally {
      setLoading(false)
    }
  }

  const refreshTopics = async () => {
    await fetchTopics()
  }

  useEffect(() => {
    // Try to load from cache first
    const cachedTopics = localStorage.getItem("cachedTopics")
    const cacheTimestamp = localStorage.getItem("topicsCacheTimestamp")

    if (cachedTopics && cacheTimestamp) {
      try {
        const parsedTopics = JSON.parse(cachedTopics)
        setTopics(parsedTopics)
        setLastFetched(Number.parseInt(cacheTimestamp))
        setLoading(false)

        // If cache is older than 1 hour, refresh in background
        const ONE_HOUR = 60 * 60 * 1000
        if (Date.now() - Number.parseInt(cacheTimestamp) > ONE_HOUR) {
          fetchTopics()
        }
      } catch (err) {
        console.error("Error parsing cached topics:", err)
        fetchTopics()
      }
    } else {
      fetchTopics()
    }
  }, [])

  return (
    <TopicsContext.Provider value={{ topics, loading, error, refreshTopics, lastFetched }}>
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

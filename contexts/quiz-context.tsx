"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getQuizzes, type Quiz } from "@/lib/supabase"

interface QuizContextType {
  quizzes: Quiz[]
  loading: boolean
  error: string | null
  refreshQuizzes: () => Promise<void>
  lastFetched: number | null
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<number | null>(null)

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      const quizzesData = await getQuizzes()

      // Sort quizzes by level: junior -> middle -> senior
      const levelOrder = { junior: 1, middle: 2, senior: 3 }
      const sortedQuizzes = [...quizzesData].sort(
        (a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder],
      )

      setQuizzes(sortedQuizzes)
      setLastFetched(Date.now())

      // Store in localStorage for persistence across page refreshes
      localStorage.setItem("cachedQuizzes", JSON.stringify(sortedQuizzes))
      localStorage.setItem("quizzesCacheTimestamp", Date.now().toString())
    } catch (err) {
      console.error("Error fetching quizzes:", err)
      setError("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const refreshQuizzes = async () => {
    await fetchQuizzes()
  }

  useEffect(() => {
    // Try to load from cache first
    const cachedQuizzes = localStorage.getItem("cachedQuizzes")
    const cacheTimestamp = localStorage.getItem("quizzesCacheTimestamp")

    if (cachedQuizzes && cacheTimestamp) {
      try {
        const parsedQuizzes = JSON.parse(cachedQuizzes)
        setQuizzes(parsedQuizzes)
        setLastFetched(Number.parseInt(cacheTimestamp))
        setLoading(false)

        // If cache is older than 1 hour, refresh in background
        const ONE_HOUR = 60 * 60 * 1000
        if (Date.now() - Number.parseInt(cacheTimestamp) > ONE_HOUR) {
          fetchQuizzes()
        }
      } catch (err) {
        console.error("Error parsing cached quizzes:", err)
        fetchQuizzes()
      }
    } else {
      fetchQuizzes()
    }
  }, [])

  return (
    <QuizContext.Provider value={{ quizzes, loading, error, refreshQuizzes, lastFetched }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuizzes() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuizzes must be used within a QuizProvider")
  }
  return context
}

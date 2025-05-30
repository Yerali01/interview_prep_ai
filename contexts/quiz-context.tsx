"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { firebaseGetQuizzes, type Quiz } from "@/lib/firebase-service-fixed"

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
      console.log("🔥 Fetching quizzes from Firebase...")

      const quizzesData = await firebaseGetQuizzes()
      console.log("🔥 Firebase quizzes received:", quizzesData.length)

      // Sort quizzes by level: junior -> middle -> senior
      const levelOrder = { junior: 1, middle: 2, senior: 3 }
      const sortedQuizzes = [...quizzesData].sort(
        (a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder],
      )

      setQuizzes(sortedQuizzes)
      setLastFetched(Date.now())

      // Store in localStorage for persistence across page refreshes (only on client)
      if (typeof window !== "undefined") {
        localStorage.setItem("cachedQuizzes", JSON.stringify(sortedQuizzes))
        localStorage.setItem("quizzesCacheTimestamp", Date.now().toString())
      }
    } catch (err) {
      console.error("❌ Error fetching quizzes from Firebase:", err)
      setError("Failed to load quizzes from Firebase")
    } finally {
      setLoading(false)
    }
  }

  const refreshQuizzes = async () => {
    await fetchQuizzes()
  }

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
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
            console.log("🔥 Cache expired, refreshing quizzes from Firebase...")
            fetchQuizzes()
          }
        } catch (err) {
          console.error("Error parsing cached quizzes:", err)
          fetchQuizzes()
        }
      } else {
        fetchQuizzes()
      }
    } else {
      // On server side, just fetch without cache
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

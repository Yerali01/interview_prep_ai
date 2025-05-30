"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { firebaseGetQuizzes } from "@/lib/firebase-service-fixed"

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  slug?: string
  level?: string
  createdAt?: string
}

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface QuizContextProps {
  quizzes: Quiz[]
  loading: boolean
  error: string | null
  refreshQuizzes: () => Promise<void>
  lastFetched: Date | null
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined)

interface QuizProviderProps {
  children: ReactNode
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const refreshQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔥 Fetching quizzes from Firebase...")

      const quizzesData = await firebaseGetQuizzes()
      console.log("🔥 Firebase quizzes data received:", quizzesData)

      if (Array.isArray(quizzesData)) {
        setQuizzes(quizzesData)
      } else {
        console.warn("⚠️ Quizzes data is not an array:", quizzesData)
        setQuizzes([])
      }

      setLastFetched(new Date())
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch quizzes")
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshQuizzes()
  }, [])

  return (
    <QuizContext.Provider value={{ quizzes, loading, error, refreshQuizzes, lastFetched }}>
      {children}
    </QuizContext.Provider>
  )
}

// Export the hook with the correct name that matches the import
export const useQuizzes = () => {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuizzes must be used within a QuizProvider")
  }
  return context
}

// Also export with the alternative name for backward compatibility
export const useQuiz = useQuizzes

"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { firebaseGetQuizzes } from "@/lib/firebase-service-fixed"

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
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
  fetchQuizzes: () => Promise<void>
  lastFetched: Date | null
}

const QuizContext = createContext<QuizContextProps>({
  quizzes: [],
  loading: false,
  error: null,
  fetchQuizzes: async () => {},
  lastFetched: null,
})

interface QuizProviderProps {
  children: ReactNode
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchQuizzes = async () => {
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
    fetchQuizzes()
  }, [])

  return (
    <QuizContext.Provider value={{ quizzes, loading, error, fetchQuizzes, lastFetched }}>
      {children}
    </QuizContext.Provider>
  )
}

export const useQuiz = () => useContext(QuizContext)

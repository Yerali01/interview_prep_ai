import { createClient } from "@supabase/supabase-js"

// Types for our database
export type Topic = {
  id: string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
  estimated_time: number
  content: Array<{
    title: string
    content: string
    code?: string
  }>
  summary?: string
}

export type Quiz = {
  id: string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
}

export type Question = {
  id: string
  quiz_id?: string
  quiz_slug: string
  question: string
  options: Record<string, string>
  correct_answer: string
  explanation: string
  category?: string
}

export type UserProgress = {
  id: string
  user_id: string
  quiz_id: string
  score: number
  completed_at: string
  answers?: Record<number, string>
}

export type QuizResult = {
  id: string
  quiz_id: string
  quiz_name: string
  user_id: string
  score: number
  total_questions: number
  completion_time: number
  completed_at: string
}

// Validate URL function
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}

// Default values for development/preview
const DEFAULT_SUPABASE_URL = "https://supabase.example.com"
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZtbG9iaXB6YmZ0Y3ZhaXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0MzQwMDAsImV4cCI6MjAxMDAxMDAwMH0.example"

// Get Supabase URL with validation
const getSupabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  if (!isValidUrl(url)) {
    console.warn("Invalid Supabase URL. Using mock implementation.")
    return DEFAULT_SUPABASE_URL
  }
  return url
}

// Get Supabase anon key with validation
const getSupabaseAnonKey = (): string => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
}

// Create a single supabase client for interacting with your database
const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

// Create client for server-side operations with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a singleton client for client-side operations
let clientSideSupabase: ReturnType<typeof createClient> | null = null

export const getClientSupabase = () => {
  // Skip the check during build time
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    // Return the server supabase instance during build
    return supabase
  }

  if (!clientSideSupabase) {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    clientSideSupabase = createClient(url, key)
  }
  return clientSideSupabase
}

// Mock implementations for when Supabase is not available
const mockTopics: Topic[] = [
  {
    id: "1",
    slug: "flutter-basics",
    title: "Flutter Basics",
    description: "Learn the fundamentals of Flutter development",
    level: "junior",
    estimated_time: 30,
    content: [
      {
        title: "Introduction",
        content:
          "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      },
    ],
  },
]

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    slug: "flutter-basics-quiz",
    title: "Flutter Basics Quiz",
    description: "Test your knowledge of Flutter basics",
    level: "junior",
  },
]

const mockQuestions: Question[] = [
  {
    id: "1",
    quiz_slug: "flutter-basics-quiz",
    question: "What language is Flutter built with?",
    options: {
      a: "JavaScript",
      b: "Dart",
      c: "Kotlin",
      d: "Swift",
    },
    correct_answer: "b",
    explanation: "Flutter is built with Dart, a client-optimized language for fast apps on any platform.",
  },
]

// Cache implementation
const topicCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds

export function getCachedData<T>(key: string): T | null {
  const cached = topicCache.get(key)
  if (!cached) return null

  // Check if cache has expired
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    topicCache.delete(key)
    return null
  }

  return cached.data as T
}

export function setCachedData<T>(key: string, data: T): void {
  topicCache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

// Utility functions for topics with error handling
export async function getTopics() {
  try {
    // Check cache first
    const cachedTopics = getCachedData<Topic[]>("all_topics")
    if (cachedTopics) return cachedTopics

    const { data, error } = await supabase.from("topics").select("*").order("title")

    if (error) {
      console.error("Error fetching topics:", error)
      return mockTopics // Return mock data on error
    }

    // Cache the result
    setCachedData("all_topics", data)
    return data as Topic[]
  } catch (error) {
    console.error("Exception fetching topics:", error)
    return mockTopics // Return mock data on exception
  }
}

export async function getTopicBySlug(slug: string) {
  try {
    // Check cache first
    const cacheKey = `topic_${slug}`
    const cachedTopic = getCachedData<Topic>(cacheKey)
    if (cachedTopic) return cachedTopic

    const { data, error } = await supabase.from("topics").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching topic with slug ${slug}:`, error)
      return mockTopics.find((t) => t.slug === slug) || null
    }

    // Cache the result
    setCachedData(cacheKey, data)
    return data as Topic
  } catch (error) {
    console.error(`Exception fetching topic with slug ${slug}:`, error)
    return mockTopics.find((t) => t.slug === slug) || null
  }
}

// Utility functions for quizzes with error handling
export async function getQuizzes() {
  try {
    const { data, error } = await supabase.from("quizzes").select("*").order("title")

    if (error) {
      console.error("Error fetching quizzes:", error)
      return mockQuizzes
    }

    return data as Quiz[]
  } catch (error) {
    console.error("Exception fetching quizzes:", error)
    return mockQuizzes
  }
}

export async function getQuizBySlug(slug: string) {
  try {
    const { data, error } = await supabase.from("quizzes").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching quiz with slug ${slug}:`, error)
      return mockQuizzes.find((q) => q.slug === slug) || null
    }

    return data as Quiz
  } catch (error) {
    console.error(`Exception fetching quiz with slug ${slug}:`, error)
    return mockQuizzes.find((q) => q.slug === slug) || null
  }
}

// Updated to use quiz_slug instead of quiz_id with error handling
export async function getQuestionsByQuizId(quizId: string) {
  try {
    // This function now actually gets questions by quiz slug
    const { data: quiz, error: quizError } = await supabase.from("quizzes").select("slug").eq("id", quizId).single()

    if (quizError) {
      console.error(`Error fetching quiz with id ${quizId}:`, quizError)
      return mockQuestions
    }

    const quizSlug = quiz.slug

    const { data, error } = await supabase.from("questions").select("*").eq("quiz_slug", quizSlug)

    if (error) {
      console.error(`Error fetching questions for quiz slug ${quizSlug}:`, error)
      return mockQuestions
    }

    return data as Question[]
  } catch (error) {
    console.error(`Exception fetching questions for quiz id ${quizId}:`, error)
    return mockQuestions
  }
}

// New function to get questions directly by quiz slug with error handling
export async function getQuestionsByQuizSlug(slug: string) {
  try {
    const { data, error } = await supabase.from("questions").select("*").eq("quiz_slug", slug)

    if (error) {
      console.error(`Error fetching questions for quiz slug ${slug}:`, error)
      return mockQuestions
    }

    return data as Question[]
  } catch (error) {
    console.error(`Exception fetching questions for quiz slug ${slug}:`, error)
    return mockQuestions
  }
}

// Utility functions for user progress with error handling
export async function saveUserProgress(userProgress: Omit<UserProgress, "id" | "completed_at">) {
  try {
    const { data, error } = await supabase.from("user_progress").insert([userProgress]).select().single()

    if (error) {
      console.error("Error saving user progress:", error)
      return null
    }

    return data as UserProgress
  } catch (error) {
    console.error("Exception saving user progress:", error)
    return null
  }
}

export async function getUserProgressByQuizId(userId: string, quizId: string) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("quiz_id", quizId)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error(`Error fetching user progress for quiz ${quizId}:`, error)
      return []
    }

    return data as UserProgress[]
  } catch (error) {
    console.error(`Exception fetching user progress for quiz ${quizId}:`, error)
    return []
  }
}

export async function getUserQuizResults(userId: string): Promise<QuizResult[]> {
  try {
    const { data, error } = await supabase.from("quiz_results").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user quiz results:", error)
      return []
    }

    return data as QuizResult[]
  } catch (error) {
    console.error("Exception fetching user quiz results:", error)
    return []
  }
}

export async function saveQuizResult(quizResult: Omit<QuizResult, "id" | "completed_at">) {
  try {
    const { data, error } = await supabase
      .from("quiz_results")
      .insert([
        {
          quiz_id: quizResult.quiz_id,
          quiz_name: quizResult.quiz_name,
          user_id: quizResult.user_id,
          score: quizResult.score,
          total_questions: quizResult.total_questions,
          completion_time: quizResult.completion_time,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving quiz result:", error)
      return null
    }

    return data as QuizResult
  } catch (error) {
    console.error("Exception saving quiz result:", error)
    return null
  }
}

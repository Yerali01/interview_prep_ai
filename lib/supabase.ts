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

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client for server-side operations
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
    clientSideSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return clientSideSupabase
}

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

// Utility functions for topics
export async function getTopics() {
  // Check cache first
  const cachedTopics = getCachedData<Topic[]>("all_topics")
  if (cachedTopics) return cachedTopics

  const { data, error } = await supabase.from("topics").select("*").order("title")

  if (error) {
    console.error("Error fetching topics:", error)
    return []
  }

  // Cache the result
  setCachedData("all_topics", data)
  return data as Topic[]
}

export async function getTopicBySlug(slug: string) {
  // Check cache first
  const cacheKey = `topic_${slug}`
  const cachedTopic = getCachedData<Topic>(cacheKey)
  if (cachedTopic) return cachedTopic

  const { data, error } = await supabase.from("topics").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching topic with slug ${slug}:`, error)
    return null
  }

  // Cache the result
  setCachedData(cacheKey, data)
  return data as Topic
}

// Utility functions for quizzes
export async function getQuizzes() {
  const { data, error } = await supabase.from("quizzes").select("*").order("title")

  if (error) {
    console.error("Error fetching quizzes:", error)
    return []
  }

  return data as Quiz[]
}

export async function getQuizBySlug(slug: string) {
  const { data, error } = await supabase.from("quizzes").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching quiz with slug ${slug}:`, error)
    return null
  }

  return data as Quiz
}

// Updated to use quiz_slug instead of quiz_id
export async function getQuestionsByQuizId(quizId: string) {
  // This function now actually gets questions by quiz slug
  const { data: quiz, error: quizError } = await supabase.from("quizzes").select("slug").eq("id", quizId).single()

  if (quizError) {
    console.error(`Error fetching quiz with id ${quizId}:`, quizError)
    return []
  }

  const quizSlug = quiz.slug

  const { data, error } = await supabase.from("questions").select("*").eq("quiz_slug", quizSlug)

  if (error) {
    console.error(`Error fetching questions for quiz slug ${quizSlug}:`, error)
    return []
  }

  return data as Question[]
}

// New function to get questions directly by quiz slug
export async function getQuestionsByQuizSlug(slug: string) {
  const { data, error } = await supabase.from("questions").select("*").eq("quiz_slug", slug)

  if (error) {
    console.error(`Error fetching questions for quiz slug ${slug}:`, error)
    return []
  }

  return data as Question[]
}

// Utility functions for user progress
export async function saveUserProgress(userProgress: Omit<UserProgress, "id" | "completed_at">) {
  const { data, error } = await supabase.from("user_progress").insert([userProgress]).select().single()

  if (error) {
    console.error("Error saving user progress:", error)
    return null
  }

  return data as UserProgress
}

export async function getUserProgressByQuizId(userId: string, quizId: string) {
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
}

export async function getUserQuizResults(userId: string): Promise<QuizResult[]> {
  const { data, error } = await supabase.from("quiz_results").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user quiz results:", error)
    return []
  }

  return data as QuizResult[]
}

export async function saveQuizResult(quizResult: Omit<QuizResult, "id" | "completed_at">) {
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
}

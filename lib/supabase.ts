import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  return { data, error }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Topics functions
export async function getTopics() {
  const { data, error } = await supabase.from("topics").select("*").order("id", { ascending: true })

  if (error) {
    console.error("Error fetching topics:", error)
    throw error
  }

  return data || []
}

export async function getTopicBySlug(slug: string) {
  console.log("Fetching topic with slug:", slug)

  // Make sure to explicitly select all fields including content
  const { data, error } = await supabase
    .from("topics")
    .select("id, slug, title, description, level, estimated_time, content, summary")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching topic by slug:", error, "Slug:", slug)
    return null
  }

  console.log("Topic data retrieved:", data)

  // If content is a string that looks like JSON, try to parse it
  if (data && typeof data.content === "string" && (data.content.startsWith("[") || data.content.startsWith("{"))) {
    try {
      data.content = JSON.parse(data.content)
    } catch (e) {
      console.error("Error parsing content JSON:", e)
      // Keep the original string if parsing fails
    }
  }

  return data
}

// Quiz functions
export async function getQuizzes() {
  const { data, error } = await supabase.from("quizzes").select("*").order("id", { ascending: true })

  if (error) {
    console.error("Error fetching quizzes:", error)
    throw error
  }

  return data || []
}

export async function getQuizBySlug(slug: string) {
  console.log("Fetching quiz with slug:", slug)

  const { data: quiz, error: quizError } = await supabase.from("quizzes").select("*").eq("slug", slug).single()

  if (quizError) {
    console.error("Error fetching quiz by slug:", quizError, "Slug:", slug)
    return null
  }

  // Fetch questions for this quiz
  const { data: questions, error: questionsError } = await supabase.from("questions").select("*").eq("quiz_slug", slug)

  if (questionsError) {
    console.error("Error fetching questions for quiz:", questionsError, "Quiz slug:", slug)
    return { ...quiz, questions: [] }
  }

  // Parse options for each question
  const parsedQuestions = questions.map((question) => {
    try {
      if (typeof question.options === "string") {
        question.options = JSON.parse(question.options)
      }
    } catch (e) {
      console.error("Error parsing question options:", e)
    }
    return question
  })

  return { ...quiz, questions: parsedQuestions }
}

export async function getQuizById(id: number | string) {
  const { data: quiz, error: quizError } = await supabase.from("quizzes").select("*").eq("id", id).single()

  if (quizError) {
    console.error("Error fetching quiz by id:", quizError, "ID:", id)
    throw quizError
  }

  // Fetch questions for this quiz
  const { data: questions, error: questionsError } = await supabase.from("questions").select("*").eq("quiz_id", id)

  if (questionsError) {
    console.error("Error fetching questions for quiz:", questionsError, "Quiz ID:", id)
    throw questionsError
  }

  // Parse options for each question
  const parsedQuestions = questions.map((question) => {
    try {
      if (typeof question.options === "string") {
        question.options = JSON.parse(question.options)
      }
    } catch (e) {
      console.error("Error parsing question options:", e)
    }
    return question
  })

  return { ...quiz, questions: parsedQuestions }
}

// User progress functions
export async function saveQuizResult(userId: string, quizId: number | string, score: number, totalQuestions: number) {
  const { data, error } = await supabase.from("user_quiz_results").insert([
    {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      completed_at: new Date(),
    },
  ])

  if (error) {
    console.error("Error saving quiz result:", error)
    throw error
  }

  return data
}

export async function getUserQuizResults(userId: string) {
  const { data, error } = await supabase
    .from("user_quiz_results")
    .select("*, quizzes(*)")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching user quiz results:", error)
    throw error
  }

  return data || []
}

export async function markTopicAsRead(userId: string, topicId: number | string) {
  const { data, error } = await supabase
    .from("user_topic_progress")
    .insert([
      {
        user_id: userId,
        topic_id: topicId,
        read_at: new Date(),
      },
    ])
    .onConflict(["user_id", "topic_id"])
    .merge()

  if (error) {
    console.error("Error marking topic as read:", error)
    throw error
  }

  return data
}

export async function getUserTopicProgress(userId: string) {
  const { data, error } = await supabase.from("user_topic_progress").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user topic progress:", error)
    throw error
  }

  return data || []
}

// Resources functions
export async function getResources() {
  const { data, error } = await supabase.from("resources").select("*").order("id", { ascending: true })

  if (error) {
    console.error("Error fetching resources:", error)
    throw error
  }

  return data || []
}

export async function getClientSupabase() {
  return createClientComponentClient()
}

export interface TopicSection {
  title?: string
  content: string
  code?: string
}

export type Topic = {
  id: number | string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
  estimated_time: number
  content: TopicSection[] | string
  summary: string | null
}

export type QuizQuestion = {
  id: string
  quiz_id: string
  quiz_slug: string
  question: string
  options: Record<string, string> | string
  correct_answer: string
  explanation: string
  category?: string
}

export type Quiz = {
  id: string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
  questions?: QuizQuestion[]
}

export type QuizResult = {
  id: number
  user_id: string
  quiz_id: number | string
  score: number
  total_questions: number
  completed_at: string
  quizzes: Quiz
}

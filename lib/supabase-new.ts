import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Define types for our data
export interface Topic {
  id: number
  title: string
  slug: string
  description: string
  content: string | TopicSection[]
  level: string
  estimated_time: number
  created_at: string
  updated_at: string
}

export interface TopicSection {
  title: string
  content: string
  code?: string
}

export interface Definition {
  id: number
  term: string
  definition: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  name: string
  slug: string
  description: string
  difficulty_level: "beginner" | "intermediate" | "advanced"
  estimated_duration: string
  category: string
  github_url?: string
  demo_url?: string
  image_url?: string
  is_pet_project: boolean
  real_world_example?: string
  created_at: string
  updated_at: string
  technologies?: ProjectTechnology[]
  features?: ProjectFeature[]
}

export interface ProjectTechnology {
  id: number
  project_id: number
  technology_name: string
  explanation: string
  is_required: boolean
  category: string
}

export interface ProjectFeature {
  id: number
  project_id: number
  feature_name: string
  description: string
  priority: "low" | "medium" | "high"
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

// Topic functions - EXPLICITLY EXPORTED
export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase.from("topics").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching topics:", error)
    throw error
  }

  return data as Topic[]
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const { data, error } = await supabase.from("topics").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching topic with slug ${slug}:`, error)
    return null
  }

  return data as Topic
}

// Export with supabase prefix for dual database service
export const supabaseGetTopics = getTopics
export const supabaseGetTopicBySlug = getTopicBySlug

// Definition functions
export async function getDefinitions(): Promise<Definition[]> {
  const { data, error } = await supabase.from("definitions").select("*").order("term", { ascending: true })

  if (error) {
    console.error("Error fetching definitions:", error)
    throw error
  }

  return data as Definition[]
}

export async function getDefinitionByTerm(term: string): Promise<Definition | null> {
  const { data, error } = await supabase.from("definitions").select("*").ilike("term", term).single()

  if (error) {
    console.error("Error fetching definition:", error)
    return null
  }

  return data as Definition
}

// Project functions
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_technologies(*),
      project_features(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }

  return data as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_technologies(*),
      project_features(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    return null
  }

  return data as Project
}

// Export with supabase prefix for dual database service
export const supabaseGetProjects = getProjects
export const supabaseGetProjectBySlug = getProjectBySlug

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
  const { data: quiz, error: quizError } = await supabase.from("quizzes").select("*").eq("slug", slug).single()

  if (quizError) {
    console.error("Error fetching quiz by slug:", quizError)
    return null
  }

  const { data: questions, error: questionsError } = await supabase.from("questions").select("*").eq("quiz_slug", slug)

  if (questionsError) {
    console.error("Error fetching questions for quiz:", questionsError)
    return { ...quiz, questions: [] }
  }

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

export async function getQuestionsByQuizSlug(quizSlug: string) {
  const { data: questions, error } = await supabase.from("questions").select("*").eq("quiz_slug", quizSlug)

  if (error) {
    console.error("Error fetching questions for quiz:", error)
    throw error
  }

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

  return parsedQuestions
}

// Export with supabase prefix for dual database service
export const supabaseGetQuizzes = getQuizzes
export const supabaseGetQuizBySlug = getQuizBySlug
export const supabaseGetQuestionsByQuizSlug = getQuestionsByQuizSlug

export async function getQuizById(id: number | string) {
  const { data: quiz, error: quizError } = await supabase.from("quizzes").select("*").eq("id", id).single()

  if (quizError) {
    console.error("Error fetching quiz by id:", quizError)
    throw quizError
  }

  const { data: questions, error: questionsError } = await supabase.from("questions").select("*").eq("quiz_id", id)

  if (questionsError) {
    console.error("Error fetching questions for quiz:", questionsError)
    throw questionsError
  }

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
    .upsert([
      {
        user_id: userId,
        topic_id: topicId,
        read_at: new Date(),
      },
    ])
    .select()

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

import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define types for our data
export interface Topic {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string | TopicSection[];
  level: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
}

export interface TopicSection {
  title: string;
  content: string;
  code?: string;
}

export interface Definition {
  id: number;
  term: string;
  definition: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  difficulty_level: string;
  estimated_duration: string;
  is_pet_project: boolean;
  github_url?: string;
  demo_url?: string;
  real_world_example?: string;
  technologies?: Technology[];
  features?: Feature[];
}

export interface Technology {
  technology_name: string;
  explanation: string;
  category: string;
  is_required: boolean;
  package_name?: string;
  version_requirement?: string;
  installation_command?: string;
  documentation_url?: string;
  purpose?: string;
}

export interface Feature {
  feature_name: string;
  description: string;
  priority: string;
}

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  quiz_slug: string;
  question: string;
  options: Record<string, string> | string;
  correct_answer: string;
  explanation: string;
  category?: string;
};

export type Quiz = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "junior" | "middle" | "senior";
  questions?: QuizQuestion[];
};

export type QuizResult = {
  id: number;
  user_id: string;
  quiz_id: number | string;
  score: number;
  total_questions: number;
  completed_at: string;
  quizzes: Quiz;
};

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the client component client function
export function getClientSupabase() {
  return createClientComponentClient();
}

// Auth functions
export async function signUp(email: string, password: string) {
  console.log("🚀 supabase.ts: signUp called with email:", email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("📥 supabase.ts: signUp response:", { data, error });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  console.log("🚀 supabase.ts: signIn called with email:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("📥 supabase.ts: signIn response:", { data, error });
  return { data, error };
}

export async function signOut() {
  console.log("🚀 supabase.ts: signOut called");

  const { error } = await supabase.auth.signOut();

  console.log("📥 supabase.ts: signOut response:", { error });
  return { error };
}

export async function resetPassword(email: string) {
  console.log("🚀 supabase.ts: resetPassword called with email:", email);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  console.log("📥 supabase.ts: resetPassword response:", { data, error });
  return { data, error };
}

export async function updatePassword(password: string) {
  console.log("🚀 supabase.ts: updatePassword called");

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  console.log("📥 supabase.ts: updatePassword response:", { data, error });
  return { data, error };
}

export async function getCurrentUser() {
  console.log("🚀 supabase.ts: getCurrentUser called");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("📥 supabase.ts: getCurrentUser response:", { user, error });
  return user;
}

// Topic functions
export async function getTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }

  return data as Topic[];
}

export async function getTopicBySlug(slug: string) {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching topic with slug ${slug}:`, error);
    return null;
  }

  return data as Topic;
}

// Definition functions
export async function getDefinitions() {
  const { data, error } = await supabase
    .from("definitions")
    .select("*")
    .order("term", { ascending: true });

  if (error) {
    console.error("Error fetching definitions:", error);
    throw error;
  }

  return data as Definition[];
}

export async function getDefinitionByTerm(term: string) {
  const { data, error } = await supabase
    .from("definitions")
    .select("*")
    .ilike("term", term)
    .single();

  if (error) {
    console.error("Error fetching definition:", error);
    return null;
  }

  return data;
}

// Project functions
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      technologies:project_technologies(*),
      features:project_features(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      technologies:project_technologies(*),
      features:project_features(*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }

  return data;
}

// Quiz functions
export async function getQuizzes() {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }

  return data || [];
}

export async function getQuizBySlug(slug: string) {
  console.log("Fetching quiz with slug:", slug);

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (quizError) {
    console.error("Error fetching quiz by slug:", quizError, "Slug:", slug);
    return null;
  }

  // Fetch questions for this quiz
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_slug", slug);

  if (questionsError) {
    console.error(
      "Error fetching questions for quiz:",
      questionsError,
      "Quiz slug:",
      slug
    );
    return { ...quiz, questions: [] };
  }

  // Parse options for each question
  const parsedQuestions = questions.map((question: QuizQuestion) => {
    try {
      if (typeof question.options === "string") {
        question.options = JSON.parse(question.options);
      }
    } catch (e) {
      console.error("Error parsing question options:", e);
    }
    return question;
  });

  return { ...quiz, questions: parsedQuestions };
}

export async function getQuizById(id: number | string) {
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (quizError) {
    console.error("Error fetching quiz by id:", quizError, "ID:", id);
    throw quizError;
  }

  // Fetch questions for this quiz
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", id);

  if (questionsError) {
    console.error(
      "Error fetching questions for quiz:",
      questionsError,
      "Quiz ID:",
      id
    );
    throw questionsError;
  }

  // Parse options for each question
  const parsedQuestions = questions.map((question: QuizQuestion) => {
    try {
      if (typeof question.options === "string") {
        question.options = JSON.parse(question.options);
      }
    } catch (e) {
      console.error("Error parsing question options:", e);
    }
    return question;
  });

  return { ...quiz, questions: parsedQuestions };
}

// User progress functions
export async function saveQuizResult(
  userId: string,
  quizId: number | string,
  score: number,
  totalQuestions: number
) {
  const { data, error } = await supabase.from("quiz_results").insert([
    {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      completed_at: new Date(),
    },
  ]);

  if (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }

  return data;
}

export async function getUserQuizResults(userId: string) {
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*, quizzes(*)")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error fetching user quiz results:", error);
    throw error;
  }

  return data || [];
}

export async function markTopicAsRead(
  userId: string,
  topicId: number | string
) {
  const { data, error } = await supabase
    .from("user_topic_progress")
    .upsert([
      {
        user_id: userId,
        topic_id: topicId,
        read_at: new Date(),
      },
    ])
    .select();

  if (error) {
    console.error("Error marking topic as read:", error);
    throw error;
  }

  return data;
}

export async function getUserTopicProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user topic progress:", error);
    throw error;
  }

  return data || [];
}

// Resources functions
export async function getResources() {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }

  return data || [];
}

// Helper function for topic recommendations (client-side only)
export function getTopicRecommendations(
  allTopics: Topic[],
  currentSlug: string,
  level: "junior" | "middle" | "senior"
): Topic[] {
  // Filter out the current topic
  const otherTopics = allTopics.filter((topic) => topic.slug !== currentSlug);

  // First, try to find topics of the same level
  const sameLevelTopics = otherTopics.filter((topic) => topic.level === level);

  // If we have enough topics of the same level, return a subset
  if (sameLevelTopics.length >= 3) {
    return shuffleArray(sameLevelTopics).slice(0, 3);
  }

  // If we don't have enough topics of the same level, include topics from adjacent levels
  let recommendedTopics = [...sameLevelTopics];

  // Add topics from adjacent levels if needed
  if (level === "junior") {
    const middleTopics = otherTopics.filter(
      (topic) => topic.level === "middle"
    );
    recommendedTopics = [...recommendedTopics, ...middleTopics];
  } else if (level === "senior") {
    const middleTopics = otherTopics.filter(
      (topic) => topic.level === "middle"
    );
    recommendedTopics = [...recommendedTopics, ...middleTopics];
  } else {
    const juniorTopics = otherTopics.filter(
      (topic) => topic.level === "junior"
    );
    const seniorTopics = otherTopics.filter(
      (topic) => topic.level === "senior"
    );
    recommendedTopics = [
      ...recommendedTopics,
      ...juniorTopics,
      ...seniorTopics,
    ];
  }

  // Shuffle and return up to 3 topics
  return shuffleArray(recommendedTopics).slice(0, 3);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

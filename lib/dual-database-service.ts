import {
  // Supabase functions
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  getDefinitions as supabaseGetDefinitions,
  getDefinitionByTerm as supabaseGetDefinitionByTerm,
  getQuizById as supabaseGetQuizById,
  saveQuizResult as supabaseSaveQuizResult,
  getUserQuizResults as supabaseGetUserQuizResults,
  markTopicAsRead as supabaseMarkTopicAsRead,
  getUserTopicProgress as supabaseGetUserTopicProgress,
} from "./supabase-new"

import {
  // Firebase functions
  firebaseSignUp,
  firebaseSignIn,
  firebaseSignOut,
  firebaseResetPassword,
  firebaseGetDefinitions,
  firebaseGetDefinitionByTerm,
  firebaseGetQuizById,
  firebaseSaveQuizResult,
  firebaseGetUserQuizResults,
  firebaseMarkTopicAsRead,
  firebaseGetUserTopicProgress,
} from "./firebase-service"

import {
  firebaseGetTopics,
  firebaseGetTopicBySlug,
  firebaseGetQuizzes,
  firebaseGetQuizBySlug,
  firebaseGetQuestionsByQuizSlug,
  firebaseGetProjects,
  firebaseGetProjectBySlug,
} from "./firebase-service-fixed"

import {
  supabaseGetTopics,
  supabaseGetTopicBySlug,
  supabaseGetQuizzes,
  supabaseGetQuizBySlug,
  supabaseGetQuestionsByQuizSlug,
  supabaseGetProjects,
  supabaseGetProjectBySlug,
} from "./supabase-new"

// Configuration for which database to use as primary
const USE_FIREBASE_AS_PRIMARY = process.env.NEXT_PUBLIC_USE_FIREBASE_PRIMARY === "true"
const ENABLE_DUAL_WRITE = process.env.NEXT_PUBLIC_ENABLE_DUAL_WRITE !== "false" // Default to true

// Check if we should use Firebase as the primary data source
const useFirebasePrimary = process.env.NEXT_PUBLIC_USE_FIREBASE_PRIMARY === "true"
// Check if we should enable dual writes
const enableDualWrite = process.env.NEXT_PUBLIC_ENABLE_DUAL_WRITE === "true"

console.log(`🔄 Dual Database Service: Primary source is ${useFirebasePrimary ? "Firebase" : "Supabase"}`)
console.log(`🔄 Dual Database Service: Dual write is ${enableDualWrite ? "enabled" : "disabled"}`)

// Helper function to execute operations on both databases
async function executeDualOperation<T>(
  primaryOperation: () => Promise<T>,
  backupOperation: () => Promise<any>,
  operationName: string,
): Promise<T> {
  try {
    // Execute primary operation
    const primaryResult = await primaryOperation()

    // Execute backup operation if dual write is enabled
    if (ENABLE_DUAL_WRITE) {
      try {
        await backupOperation()
        console.log(`✅ Dual write successful for ${operationName}`)
      } catch (backupError) {
        console.error(`⚠️ Backup operation failed for ${operationName}:`, backupError)
        // Don't throw - primary operation succeeded
      }
    }

    return primaryResult
  } catch (primaryError) {
    console.error(`❌ Primary operation failed for ${operationName}:`, primaryError)
    throw primaryError
  }
}

// Helper function to try both databases for read operations
async function executeWithFallback<T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  try {
    return await primaryOperation()
  } catch (primaryError) {
    console.warn(`⚠️ Primary database failed for ${operationName}, trying fallback:`, primaryError)
    try {
      const fallbackResult = await fallbackOperation()
      console.log(`✅ Fallback successful for ${operationName}`)
      return fallbackResult
    } catch (fallbackError) {
      console.error(`❌ Both databases failed for ${operationName}:`, { primaryError, fallbackError })
      throw primaryError // Throw original error
    }
  }
}

// Generic function to get data from primary source with fallback
async function getDataWithFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  entityName: string,
): Promise<T> {
  try {
    console.log(`🔄 Fetching ${entityName} from primary source...`)
    return await primaryFn()
  } catch (primaryError) {
    console.error(`❌ Error fetching ${entityName} from primary source:`, primaryError)
    console.log(`🔄 Falling back to secondary source for ${entityName}...`)

    try {
      return await fallbackFn()
    } catch (fallbackError) {
      console.error(`❌ Error fetching ${entityName} from fallback source:`, fallbackError)
      throw new Error(`Failed to fetch ${entityName} from both sources`)
    }
  }
}

// Auth functions with dual database support
export async function dualSignUp(email: string, password: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeDualOperation(
      () => firebaseSignUp(email, password),
      () => supabaseSignUp(email, password),
      "signUp",
    )
  } else {
    return executeDualOperation(
      () => supabaseSignUp(email, password),
      () => firebaseSignUp(email, password),
      "signUp",
    )
  }
}

export async function dualSignIn(email: string, password: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseSignIn(email, password),
      () => supabaseSignIn(email, password),
      "signIn",
    )
  } else {
    return executeWithFallback(
      () => supabaseSignIn(email, password),
      () => firebaseSignIn(email, password),
      "signIn",
    )
  }
}

export async function dualSignOut() {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeDualOperation(
      () => firebaseSignOut(),
      () => supabaseSignOut(),
      "signOut",
    )
  } else {
    return executeDualOperation(
      () => supabaseSignOut(),
      () => firebaseSignOut(),
      "signOut",
    )
  }
}

export async function dualResetPassword(email: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeDualOperation(
      () => firebaseResetPassword(email),
      () => supabaseResetPassword(email),
      "resetPassword",
    )
  } else {
    return executeDualOperation(
      () => supabaseResetPassword(email),
      () => firebaseResetPassword(email),
      "resetPassword",
    )
  }
}

// Topic functions with dual database support
export async function dualGetTopics() {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetTopics(),
      () => supabaseGetTopics(),
      "getTopics",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetTopics(),
      () => firebaseGetTopics(),
      "getTopics",
    )
  }
}

export async function dualGetTopicBySlug(slug: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetTopicBySlug(slug),
      () => supabaseGetTopicBySlug(slug),
      "getTopicBySlug",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetTopicBySlug(slug),
      () => firebaseGetTopicBySlug(slug),
      "getTopicBySlug",
    )
  }
}

// Definition functions with dual database support
export async function dualGetDefinitions() {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetDefinitions(),
      () => supabaseGetDefinitions(),
      "getDefinitions",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetDefinitions(),
      () => firebaseGetDefinitions(),
      "getDefinitions",
    )
  }
}

export async function dualGetDefinitionByTerm(term: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetDefinitionByTerm(term),
      () => supabaseGetDefinitionByTerm(term),
      "getDefinitionByTerm",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetDefinitionByTerm(term),
      () => firebaseGetDefinitionByTerm(term),
      "getDefinitionByTerm",
    )
  }
}

// Project functions with dual database support
export async function dualGetProjects() {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetProjects(),
      () => supabaseGetProjects(),
      "getProjects",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetProjects(),
      () => firebaseGetProjects(),
      "getProjects",
    )
  }
}

export async function dualGetProjectBySlug(slug: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetProjectBySlug(slug),
      () => supabaseGetProjectBySlug(slug),
      "getProjectBySlug",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetProjectBySlug(slug),
      () => firebaseGetProjectBySlug(slug),
      "getProjectBySlug",
    )
  }
}

// Quiz functions with dual database support
export async function dualGetQuizzes() {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetQuizzes(),
      () => supabaseGetQuizzes(),
      "getQuizzes",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetQuizzes(),
      () => firebaseGetQuizzes(),
      "getQuizzes",
    )
  }
}

export async function dualGetQuizBySlug(slug: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetQuizBySlug(slug),
      () => supabaseGetQuizBySlug(slug),
      "getQuizBySlug",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetQuizBySlug(slug),
      () => firebaseGetQuizBySlug(slug),
      "getQuizBySlug",
    )
  }
}

export async function dualGetQuizById(id: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetQuizById(id),
      () => supabaseGetQuizById(id),
      "getQuizById",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetQuizById(id),
      () => firebaseGetQuizById(id),
      "getQuizById",
    )
  }
}

// User progress functions with dual database support
export async function dualSaveQuizResult(userId: string, quizId: string, score: number, totalQuestions: number) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeDualOperation(
      () => firebaseSaveQuizResult(userId, quizId, score, totalQuestions),
      () => supabaseSaveQuizResult(userId, quizId, score, totalQuestions),
      "saveQuizResult",
    )
  } else {
    return executeDualOperation(
      () => supabaseSaveQuizResult(userId, quizId, score, totalQuestions),
      () => firebaseSaveQuizResult(userId, quizId, score, totalQuestions),
      "saveQuizResult",
    )
  }
}

export async function dualGetUserQuizResults(userId: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetUserQuizResults(userId),
      () => supabaseGetUserQuizResults(userId),
      "getUserQuizResults",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetUserQuizResults(userId),
      () => firebaseGetUserQuizResults(userId),
      "getUserQuizResults",
    )
  }
}

export async function dualMarkTopicAsRead(userId: string, topicId: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeDualOperation(
      () => firebaseMarkTopicAsRead(userId, topicId),
      () => supabaseMarkTopicAsRead(userId, topicId),
      "markTopicAsRead",
    )
  } else {
    return executeDualOperation(
      () => supabaseMarkTopicAsRead(userId, topicId),
      () => firebaseMarkTopicAsRead(userId, topicId),
      "markTopicAsRead",
    )
  }
}

export async function dualGetUserTopicProgress(userId: string) {
  if (USE_FIREBASE_AS_PRIMARY) {
    return executeWithFallback(
      () => firebaseGetUserTopicProgress(userId),
      () => supabaseGetUserTopicProgress(userId),
      "getUserTopicProgress",
    )
  } else {
    return executeWithFallback(
      () => supabaseGetUserTopicProgress(userId),
      () => firebaseGetUserTopicProgress(userId),
      "getUserTopicProgress",
    )
  }
}

// Export configuration helpers
export const getDatabaseConfig = () => ({
  primaryDatabase: USE_FIREBASE_AS_PRIMARY ? "Firebase" : "Supabase",
  backupDatabase: USE_FIREBASE_AS_PRIMARY ? "Supabase" : "Firebase",
  dualWriteEnabled: ENABLE_DUAL_WRITE,
})

export const switchPrimaryDatabase = () => {
  console.log(
    `Switching primary database from ${USE_FIREBASE_AS_PRIMARY ? "Firebase" : "Supabase"} to ${USE_FIREBASE_AS_PRIMARY ? "Supabase" : "Firebase"}`,
  )
  // This would require updating environment variables and restarting the app
}

// Get all topics
export async function getTopics() {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetTopics() : supabaseGetTopics()),
    () => (useFirebasePrimary ? supabaseGetTopics() : firebaseGetTopics()),
    "topics",
  )
}

// Get topic by slug
export async function getTopicBySlug(slug: string) {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetTopicBySlug(slug) : supabaseGetTopicBySlug(slug)),
    () => (useFirebasePrimary ? supabaseGetTopicBySlug(slug) : firebaseGetTopicBySlug(slug)),
    `topic with slug "${slug}"`,
  )
}

// Get all quizzes
export async function getQuizzes() {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetQuizzes() : supabaseGetQuizzes()),
    () => (useFirebasePrimary ? supabaseGetQuizzes() : firebaseGetQuizzes()),
    "quizzes",
  )
}

// Get quiz by slug
export async function getQuizBySlug(slug: string) {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetQuizBySlug(slug) : supabaseGetQuizBySlug(slug)),
    () => (useFirebasePrimary ? supabaseGetQuizBySlug(slug) : firebaseGetQuizBySlug(slug)),
    `quiz with slug "${slug}"`,
  )
}

// Get questions by quiz slug
export async function getQuestionsByQuizSlug(quizSlug: string) {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetQuestionsByQuizSlug(quizSlug) : supabaseGetQuestionsByQuizSlug(quizSlug)),
    () => (useFirebasePrimary ? supabaseGetQuestionsByQuizSlug(quizSlug) : firebaseGetQuestionsByQuizSlug(quizSlug)),
    `questions for quiz "${quizSlug}"`,
  )
}

// Get all projects
export async function getProjects() {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetProjects() : supabaseGetProjects()),
    () => (useFirebasePrimary ? supabaseGetProjects() : firebaseGetProjects()),
    "projects",
  )
}

// Get project by slug
export async function getProjectBySlug(slug: string) {
  return getDataWithFallback(
    () => (useFirebasePrimary ? firebaseGetProjectBySlug(slug) : supabaseGetProjectBySlug(slug)),
    () => (useFirebasePrimary ? supabaseGetProjectBySlug(slug) : firebaseGetProjectBySlug(slug)),
    `project with slug "${slug}"`,
  )
}

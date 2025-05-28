import {
  // Supabase functions
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  getTopics as supabaseGetTopics,
  getTopicBySlug as supabaseGetTopicBySlug,
  getDefinitions as supabaseGetDefinitions,
  getDefinitionByTerm as supabaseGetDefinitionByTerm,
  getProjects as supabaseGetProjects,
  getProjectBySlug as supabaseGetProjectBySlug,
  getQuizzes as supabaseGetQuizzes,
  getQuizBySlug as supabaseGetQuizBySlug,
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
  firebaseGetTopics,
  firebaseGetTopicBySlug,
  firebaseGetDefinitions,
  firebaseGetDefinitionByTerm,
  firebaseGetProjects,
  firebaseGetProjectBySlug,
  firebaseGetQuizzes,
  firebaseGetQuizBySlug,
  firebaseGetQuizById,
  firebaseSaveQuizResult,
  firebaseGetUserQuizResults,
  firebaseMarkTopicAsRead,
  firebaseGetUserTopicProgress,
} from "./firebase-service"

// Configuration for which database to use as primary
const USE_FIREBASE_AS_PRIMARY = process.env.NEXT_PUBLIC_USE_FIREBASE_PRIMARY === "true"
const ENABLE_DUAL_WRITE = process.env.NEXT_PUBLIC_ENABLE_DUAL_WRITE !== "false" // Default to true

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

// Database configuration - now using Firebase as primary
export const DATABASE_CONFIG = {
  USE_FIREBASE_PRIMARY: true,
  ENABLE_DUAL_WRITE: false, // Disable dual write since we're going Firebase-only
  ENABLE_FALLBACK: false, // Disable Supabase fallback
} as const

export const getDatabaseProvider = () => {
  return DATABASE_CONFIG.USE_FIREBASE_PRIMARY ? "Firebase" : "Supabase"
}

export const shouldUseDualWrite = () => {
  return DATABASE_CONFIG.ENABLE_DUAL_WRITE
}

export const shouldUseFallback = () => {
  return DATABASE_CONFIG.ENABLE_FALLBACK
}

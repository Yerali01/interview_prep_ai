"use client"

// This file is now deprecated - all functionality has been moved to components/auth/auth-provider.tsx
// We're keeping this file to avoid breaking imports, but it should be removed in the future

import { auth, db } from "./firebase"

// Re-export auth and db for backward compatibility
export { auth, db }

// Warn about deprecated usage
console.warn("firebase-service.ts is deprecated. Please use components/auth/auth-provider.tsx instead.")

// Export empty functions for backward compatibility
export const firebaseSignUp = async () => {
  console.error("firebaseSignUp is deprecated. Please use useAuth().signUp instead.")
  return { user: null, error: { message: "Function deprecated", code: "deprecated" } }
}

export const firebaseSignIn = async () => {
  console.error("firebaseSignIn is deprecated. Please use useAuth().signIn instead.")
  return { user: null, error: { message: "Function deprecated", code: "deprecated" } }
}

export const firebaseSignInWithGitHub = async () => {
  console.error("firebaseSignInWithGitHub is deprecated. Please use useAuth().signInWithGitHub instead.")
  return { user: null, error: { message: "Function deprecated", code: "deprecated" } }
}

export const firebaseLinkGitHubAccount = async () => {
  console.error("firebaseLinkGitHubAccount is deprecated. Please use useAuth().linkGitHubAccount instead.")
  return { user: null, error: { message: "Function deprecated", code: "deprecated" } }
}

export const firebaseSignOut = async () => {
  console.error("firebaseSignOut is deprecated. Please use useAuth().signOut instead.")
  return { error: { message: "Function deprecated", code: "deprecated" } }
}

export const firebaseResetPassword = async () => {
  console.error("firebaseResetPassword is deprecated. Please use useAuth().resetPassword instead.")
  return { error: { message: "Function deprecated", code: "deprecated" } }
}

export const onFirebaseAuthStateChanged = () => {
  console.error("onFirebaseAuthStateChanged is deprecated. Please use useAuth() instead.")
  return () => {}
}

// Keep data functions for backward compatibility
export const firebaseGetTopics = async () => {
  console.error("firebaseGetTopics is deprecated. Please update your code.")
  return []
}

export const firebaseGetTopicBySlug = async () => {
  console.error("firebaseGetTopicBySlug is deprecated. Please update your code.")
  return null
}

// Add other deprecated functions as needed

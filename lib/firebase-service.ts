export interface User {
  id: string | null
  email: string | null
  email_confirmed_at: string | null
}

export interface AuthResult {
  user: User | null
  error: { code: string; message: string } | null
}

import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"

export async function firebaseSignUp(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔥 Firebase: Starting sign up process...")
    console.log("📧 Email:", email)

    // Validate inputs
    if (!email || !password) {
      return {
        user: null,
        error: { code: "auth/invalid-input", message: "Email and password are required" },
      }
    }

    if (password.length < 6) {
      return {
        user: null,
        error: { code: "auth/weak-password", message: "Password must be at least 6 characters long" },
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    console.log("✅ Firebase: User created successfully")
    console.log("👤 User ID:", firebaseUser.uid)
    console.log("📧 User email:", firebaseUser.email)

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      email_confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
    }

    return { user, error: null }
  } catch (error: any) {
    console.error("❌ Firebase sign up error:", error)

    // Map Firebase errors to user-friendly messages
    let errorMessage = "An unexpected error occurred. Please try again."
    const errorCode = error.code || "auth/unknown"

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "An account with this email already exists. Please sign in instead."
        break
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address."
        break
      case "auth/weak-password":
        errorMessage = "Password is too weak. Please choose a stronger password (at least 6 characters)."
        break
      case "auth/operation-not-allowed":
        errorMessage = "Email/password accounts are not enabled. Please contact support."
        break
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection and try again."
        break
      default:
        errorMessage = error.message || errorMessage
    }

    return {
      user: null,
      error: { code: errorCode, message: errorMessage },
    }
  }
}

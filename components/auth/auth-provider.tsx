"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onFirebaseAuthStateChanged,
  firebaseSignUp,
  firebaseSignIn,
  firebaseSignOut,
  firebaseResetPassword,
} from "@/lib/firebase-service"
import type { User as FirebaseUser } from "firebase/auth"

interface User {
  id: string
  email: string | null
  email_confirmed_at: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔥 AuthProvider: Setting up Firebase auth listener...")

    const unsubscribe = onFirebaseAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      console.log("🔥 Firebase auth state changed:", firebaseUser?.email || "No user")

      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          email_confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      console.log("🔥 AuthProvider: Cleaning up Firebase auth listener")
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log("🔥 AuthProvider: Sign up called")
    setLoading(true)

    try {
      const result = await firebaseSignUp(email, password)

      if (result.error) {
        throw new Error(result.error.message)
      }

      console.log("✅ AuthProvider: Sign up successful")
      // User state will be updated by the auth state listener
    } catch (error: any) {
      console.error("❌ AuthProvider: Sign up failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log("🔥 AuthProvider: Sign in called")
    setLoading(true)

    try {
      const result = await firebaseSignIn(email, password)

      if (result.error) {
        throw new Error(result.error.message)
      }

      console.log("✅ AuthProvider: Sign in successful")
      // User state will be updated by the auth state listener
    } catch (error: any) {
      console.error("❌ AuthProvider: Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log("🔥 AuthProvider: Sign out called")
    setLoading(true)

    try {
      const result = await firebaseSignOut()

      if (result.error) {
        throw new Error(result.error.message)
      }

      console.log("✅ AuthProvider: Sign out successful")
      // User state will be updated by the auth state listener
    } catch (error: any) {
      console.error("❌ AuthProvider: Sign out failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    console.log("🔥 AuthProvider: Reset password called")

    try {
      const result = await firebaseResetPassword(email)

      if (result.error) {
        throw new Error(result.error.message)
      }

      console.log("✅ AuthProvider: Reset password email sent")
    } catch (error: any) {
      console.error("❌ AuthProvider: Reset password failed:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

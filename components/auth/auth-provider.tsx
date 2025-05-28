"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  firebaseSignUp,
  firebaseSignIn,
  firebaseSignOut,
  firebaseResetPassword,
  onFirebaseAuthStateChanged,
} from "@/lib/firebase-service"
import type { User as FirebaseUser } from "firebase/auth"

interface User {
  id: string
  email: string | null
  email_confirmed_at: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    console.log("🔧 AuthProvider: Initializing Firebase Auth...")

    const unsubscribe = onFirebaseAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      console.log("🔧 AuthProvider: Firebase auth state changed:", firebaseUser?.email || "No user")

      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          email_confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
        })
        console.log("✅ AuthProvider: User set:", firebaseUser.email)
      } else {
        setUser(null)
        console.log("✅ AuthProvider: User cleared")
      }

      setIsLoading(false)
    })

    return () => {
      console.log("🔧 AuthProvider: Cleaning up Firebase auth listener")
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log("🚀 AuthProvider: Starting Firebase sign up process...")
    console.log("📧 Email:", email)
    console.log("🔒 Password length:", password.length)

    setIsLoading(true)
    try {
      const { user: newUser, error } = await firebaseSignUp(email, password)

      if (error) {
        console.error("❌ AuthProvider: Firebase sign up error:", error)

        let errorMessage = "An unexpected error occurred. Please try again."

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "An account with this email already exists. Please sign in instead."
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address."
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak. Please choose a stronger password (at least 6 characters)."
        } else if (error.code === "auth/operation-not-allowed") {
          errorMessage = "Email/password accounts are not enabled. Please contact support."
        } else {
          errorMessage = error.message || errorMessage
        }

        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        })

        throw new Error(errorMessage)
      }

      if (newUser) {
        console.log("✅ AuthProvider: Firebase user created successfully")
        console.log("👤 User ID:", newUser.id)
        console.log("📧 User email:", newUser.email)

        toast({
          title: "Account created successfully!",
          description: "Welcome! You can now start using the app.",
        })

        router.push("/")
      } else {
        console.log("⚠️ AuthProvider: No user data received")
        throw new Error("Failed to create account. Please try again.")
      }
    } catch (error: any) {
      console.error("💥 AuthProvider: Sign up error in catch block:", error)
      throw error
    } finally {
      setIsLoading(false)
      console.log("🏁 AuthProvider: Sign up process completed")
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log("🚀 AuthProvider: Starting Firebase sign in process...")
    console.log("📧 Email:", email)

    setIsLoading(true)
    try {
      const { user: signedInUser, error } = await firebaseSignIn(email, password)

      if (error) {
        console.error("❌ AuthProvider: Firebase sign in error:", error)

        let errorMessage = "An unexpected error occurred. Please try again."

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address."
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address."
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled. Please contact support."
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many sign in attempts. Please wait a moment and try again."
        } else {
          errorMessage = error.message || errorMessage
        }

        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        })

        throw new Error(errorMessage)
      }

      if (signedInUser) {
        console.log("✅ AuthProvider: Firebase sign in successful")
        console.log("👤 User:", signedInUser.email)

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })

        router.push("/")
      } else {
        console.log("⚠️ AuthProvider: Sign in completed but missing user")
        throw new Error("Sign in failed. Please try again.")
      }
    } catch (error: any) {
      console.error("💥 AuthProvider: Sign in error in catch block:", error)
      throw error
    } finally {
      setIsLoading(false)
      console.log("🏁 AuthProvider: Sign in process completed")
    }
  }

  const signOut = async () => {
    console.log("🚀 AuthProvider: Starting Firebase sign out process...")
    setIsLoading(true)
    try {
      const { error } = await firebaseSignOut()

      if (error) {
        console.error("❌ AuthProvider: Firebase sign out error:", error)
        toast({
          title: "Sign out failed",
          description: error.message || "Failed to sign out",
          variant: "destructive",
        })
        throw error
      }

      console.log("✅ AuthProvider: Firebase sign out successful")
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })

      router.push("/auth/sign-in")
    } catch (error: any) {
      console.error("💥 AuthProvider: Sign out error in catch block:", error)
    } finally {
      setIsLoading(false)
      console.log("🏁 AuthProvider: Sign out process completed")
    }
  }

  const resetPassword = async (email: string) => {
    console.log("🚀 AuthProvider: Starting Firebase password reset...")
    setIsLoading(true)
    try {
      const { error } = await firebaseResetPassword(email)

      if (error) {
        console.error("❌ AuthProvider: Firebase reset password error:", error)

        let errorMessage = "Failed to send reset email. Please try again."

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address."
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address."
        } else {
          errorMessage = error.message || errorMessage
        }

        toast({
          title: "Reset failed",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      }

      console.log("✅ AuthProvider: Password reset email sent")
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error: any) {
      console.error("💥 AuthProvider: Reset password error in catch block:", error)
    } finally {
      setIsLoading(false)
      console.log("🏁 AuthProvider: Reset password process completed")
    }
  }

  const value = { user, isLoading, signUp, signIn, signOut, resetPassword }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

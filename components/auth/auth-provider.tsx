"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Only run on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Dynamically import Firebase only on client side
    const initializeAuth = async () => {
      try {
        const { onFirebaseAuthStateChanged } = await import("@/lib/firebase-service")

        const unsubscribe = onFirebaseAuthStateChanged((firebaseUser: any) => {
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

        return unsubscribe
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        setLoading(false)
      }
    }

    let unsubscribe: (() => void) | undefined

    initializeAuth().then((unsub) => {
      unsubscribe = unsub
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [isClient])

  const signUp = async (email: string, password: string) => {
    if (!isClient) return

    setLoading(true)
    try {
      const { firebaseSignUp } = await import("@/lib/firebase-service")
      const result = await firebaseSignUp(email, password)

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error: any) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isClient) return

    setLoading(true)
    try {
      const { firebaseSignIn } = await import("@/lib/firebase-service")
      const result = await firebaseSignIn(email, password)

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error: any) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!isClient) return

    setLoading(true)
    try {
      const { firebaseSignOut } = await import("@/lib/firebase-service")
      const result = await firebaseSignOut()

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error: any) {
      console.error("Sign out failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    if (!isClient) return

    try {
      const { firebaseResetPassword } = await import("@/lib/firebase-service")
      const result = await firebaseResetPassword(email)

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error: any) {
      console.error("Reset password failed:", error)
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
  return context
}

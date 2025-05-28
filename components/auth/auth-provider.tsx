"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import {
  dualSignUp,
  dualSignIn,
  dualSignOut,
  dualResetPassword,
  onFirebaseAuthStateChanged,
} from "@/lib/dual-database-service"
import { supabase } from "@/lib/supabase-new"

interface User {
  id: string | null
  email: string | null
  email_confirmed_at: string | null
}

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ user: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ user: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  signUp: async () => ({ user: null, error: null }),
  signIn: async () => ({ user: null, error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Listen to both Firebase and Supabase auth state changes
    const unsubscribeFirebase = onFirebaseAuthStateChanged((firebaseUser) => {
      if (mounted && firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          email_confirmed_at: firebaseUser.emailVerified ? new Date().toISOString() : null,
        })
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            email_confirmed_at: session.user.email_confirmed_at,
          })
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      unsubscribeFirebase()
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, error } = await dualSignUp(email, password)
      if (error) throw error
      return { user, error: null }
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { user: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, error } = await dualSignIn(email, password)
      if (error) throw error
      return { user, error: null }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { user: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await dualSignOut()
      if (error) throw error
      setUser(null)
      return { error: null }
    } catch (error: any) {
      console.error("Sign out error:", error)
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      await dualResetPassword(email)
    } catch (error: any) {
      console.error("Reset password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getClientSupabase } from "@/lib/supabase"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Initialize Supabase client only on the client side
    const supabaseClient = getClientSupabase()
    setSupabase(supabaseClient)

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabaseClient.auth.getSession()
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
          })
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    setLoading(false)
  }

  const signOut = async () => {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setLoading(false)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

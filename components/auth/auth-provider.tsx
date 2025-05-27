"use client"
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    console.log("🔧 AuthProvider: Initializing...")

    const getSession = async () => {
      try {
        console.log("🔧 AuthProvider: Getting initial session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("🔧 AuthProvider: Initial session result:", { session, error })

        if (error) {
          console.error("❌ AuthProvider: Error getting session:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
        console.log("🔧 AuthProvider: Set initial user:", session?.user?.email || "No user")
      } catch (error) {
        console.error("❌ AuthProvider: Error getting auth session:", error)
      } finally {
        setIsLoading(false)
        console.log("🔧 AuthProvider: Initialization complete")
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔧 AuthProvider: Auth state changed:", event, session?.user?.email || "No user")
      setSession(session)
      setUser(session?.user ?? null)

      if (event === "SIGNED_IN") {
        console.log("✅ AuthProvider: User signed in successfully")
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        })
      }

      if (event === "SIGNED_OUT") {
        console.log("✅ AuthProvider: User signed out successfully")
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        })
      }

      if (event === "SIGNED_UP") {
        console.log("✅ AuthProvider: User signed up successfully")
        toast({
          title: "Account created!",
          description: "Welcome to the platform! You can now start using all features.",
        })
      }
    })

    return () => {
      console.log("🔧 AuthProvider: Cleaning up subscription")
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  const signUp = async (email: string, password: string) => {
    console.log("🚀 AuthProvider: Starting sign up process...")
    console.log("📧 Email:", email)
    console.log("🔒 Password length:", password.length)

    setIsLoading(true)
    try {
      console.log("📤 AuthProvider: Sending sign up request to Supabase...")

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log("📥 AuthProvider: Sign up response received")
      console.log("✅ Data:", data)
      console.log("❌ Error:", error)

      if (error) {
        console.error("❌ AuthProvider: Sign up error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          cause: error.cause,
        })

        let errorMessage = "An unexpected error occurred. Please try again."

        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead."
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address."
        } else if (error.message.includes("Password")) {
          errorMessage = error.message
        } else if (error.message.includes("weak")) {
          errorMessage = "Password is too weak. Please choose a stronger password."
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many attempts. Please wait a moment and try again."
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

      if (data.user) {
        console.log("✅ AuthProvider: User created successfully")
        console.log("👤 User ID:", data.user.id)
        console.log("📧 User email:", data.user.email)
        console.log("🎫 Session:", data.session ? "Created" : "No session")

        // Since email verification is disabled, user should be signed in immediately
        if (data.session) {
          console.log("✅ AuthProvider: User automatically signed in")
          toast({
            title: "Account created successfully!",
            description: "Welcome! You can now start using the app.",
          })
        } else {
          console.log("⚠️ AuthProvider: User created but no session")
          toast({
            title: "Account created",
            description: "Your account has been created successfully.",
          })
        }
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
    console.log("🚀 AuthProvider: Starting sign in process...")
    console.log("📧 Email:", email)

    setIsLoading(true)
    try {
      console.log("📤 AuthProvider: Sending sign in request to Supabase...")

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("📥 AuthProvider: Sign in response received")
      console.log("✅ Data:", data)
      console.log("❌ Error:", error)

      if (error) {
        console.error("❌ AuthProvider: Sign in error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
        })

        let errorMessage = "An unexpected error occurred. Please try again."

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before signing in."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many sign in attempts. Please wait a moment and try again."
        } else if (error.message.includes("User not found")) {
          errorMessage = "No account found with this email address."
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

      if (data.user && data.session) {
        console.log("✅ AuthProvider: Sign in successful")
        console.log("👤 User:", data.user.email)
        console.log("🎫 Session:", data.session.access_token ? "Present" : "Missing")
        // Toast will be shown by the auth state change listener
      } else {
        console.log("⚠️ AuthProvider: Sign in completed but missing user or session")
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
    console.log("🚀 AuthProvider: Starting sign out process...")
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("❌ AuthProvider: Sign out error:", error)
        toast({
          title: "Sign out failed",
          description: error.message || "Failed to sign out",
          variant: "destructive",
        })
        throw error
      }

      console.log("✅ AuthProvider: Sign out successful")
      router.push("/")
    } catch (error: any) {
      console.error("💥 AuthProvider: Sign out error in catch block:", error)
    } finally {
      setIsLoading(false)
      console.log("🏁 AuthProvider: Sign out process completed")
    }
  }

  const value = { user, session, isLoading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

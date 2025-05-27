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
          title: "Welcome back!",
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
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("🔄 AuthProvider: Token refreshed")
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
    console.log("🌐 Current origin:", window.location.origin)

    setIsLoading(true)
    try {
      console.log("📤 AuthProvider: Sending sign up request to Supabase...")

      const signUpData = {
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      }

      console.log("📋 AuthProvider: Sign up data:", signUpData)

      const { data, error } = await supabase.auth.signUp(signUpData)

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

        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          console.log("⚠️ AuthProvider: User already exists")
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          })
        } else if (error.message.includes("Invalid email")) {
          console.log("⚠️ AuthProvider: Invalid email format")
          toast({
            title: "Invalid email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          })
        } else if (error.message.includes("Password")) {
          console.log("⚠️ AuthProvider: Password error")
          toast({
            title: "Password error",
            description: error.message,
            variant: "destructive",
          })
        } else {
          console.log("⚠️ AuthProvider: General sign up error")
          toast({
            title: "Sign up failed",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        }
        throw error
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        console.log("📧 AuthProvider: User created, email confirmation required")
        console.log("👤 User ID:", data.user.id)
        console.log("📧 User email:", data.user.email)
        console.log("✅ Email confirmed:", data.user.email_confirmed_at)
        console.log("📅 Created at:", data.user.created_at)

        toast({
          title: "Check your email",
          description:
            "We've sent you a confirmation link. Please check your email and click the link to complete your registration.",
          duration: 8000,
        })
      } else if (data.user && data.session) {
        console.log("✅ AuthProvider: User created and automatically signed in")
        console.log("👤 User:", data.user.email)
        console.log("🎫 Session:", data.session.access_token ? "Present" : "Missing")

        toast({
          title: "Account created successfully",
          description: "Welcome! You can now start using the app.",
        })
      } else {
        console.log("⚠️ AuthProvider: Unexpected sign up result")
        console.log("👤 User:", data.user)
        console.log("🎫 Session:", data.session)

        toast({
          title: "Sign up completed",
          description: "Please check your email for further instructions.",
        })
      }
    } catch (error: any) {
      console.error("💥 AuthProvider: Sign up error in catch block:", error)
      console.error("💥 Error stack:", error.stack)
      // Error already handled above, just re-throw
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

        if (error.message.includes("Email not confirmed")) {
          console.log("⚠️ AuthProvider: Email not confirmed")
          toast({
            title: "Email not verified",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          })
        } else if (error.message.includes("Invalid login credentials")) {
          console.log("⚠️ AuthProvider: Invalid credentials")
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          })
        } else {
          console.log("⚠️ AuthProvider: General sign in error")
          toast({
            title: "Sign in failed",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        }
        throw error
      }

      if (data.user) {
        console.log("✅ AuthProvider: Sign in successful")
        console.log("👤 User:", data.user.email)
        console.log("🎫 Session:", data.session?.access_token ? "Present" : "Missing")
        // Toast will be shown by the auth state change listener
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

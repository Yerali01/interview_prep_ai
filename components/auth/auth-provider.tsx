"use client"
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
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
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting auth session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)

      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      }

      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign up with email:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Sign up response:", { data, error })

      if (error) {
        console.error("Sign up error:", error)

        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          })
        } else if (error.message.includes("Invalid email")) {
          toast({
            title: "Invalid email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          })
        } else if (error.message.includes("Password")) {
          toast({
            title: "Password error",
            description: error.message,
            variant: "destructive",
          })
        } else {
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
        console.log("User created, email confirmation required")
        toast({
          title: "Check your email",
          description:
            "We've sent you a confirmation link. Please check your email and click the link to complete your registration.",
          duration: 8000,
        })
      } else if (data.user && data.session) {
        console.log("User created and automatically signed in")
        toast({
          title: "Account created successfully",
          description: "Welcome! You can now start using the app.",
        })
      } else {
        console.log("Unexpected sign up result:", data)
        toast({
          title: "Sign up completed",
          description: "Please check your email for further instructions.",
        })
      }
    } catch (error: any) {
      console.error("Sign up error in catch:", error)
      // Error already handled above, just re-throw
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign in with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in response:", { data, error })

      if (error) {
        console.error("Sign in error:", error)

        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not verified",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          })
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Sign in failed",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        }
        throw error
      }

      if (data.user) {
        console.log("Sign in successful for user:", data.user.email)
        // Toast will be shown by the auth state change listener
      }
    } catch (error: any) {
      console.error("Sign in error in catch:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        toast({
          title: "Sign out failed",
          description: error.message || "Failed to sign out",
          variant: "destructive",
        })
        throw error
      }

      router.push("/")
    } catch (error: any) {
      console.error("Sign out error in catch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = { user, session, isLoading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

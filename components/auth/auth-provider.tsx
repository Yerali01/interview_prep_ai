"use client"
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: any | null
  session: any | null
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
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await (await supabase).auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting auth session:", error)
        // Continue with null user/session on error
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await (await supabase).auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/sign-up-success`,
        },
      })

      if (error) throw error

      toast({
        title: "Sign up successful",
        description: "A confirmation email has been sent to your email address.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Sign in successful",
        description: "You have successfully signed in.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      toast({
        title: "Sign out successful",
        description: "You have successfully signed out.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
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

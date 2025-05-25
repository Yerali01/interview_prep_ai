"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          toast({
            title: "Authentication Error",
            description: "There was an error confirming your email. Please try again.",
            variant: "destructive",
          })
          router.push("/auth/sign-in")
          return
        }

        if (data.session) {
          toast({
            title: "Email confirmed!",
            description: "Your email has been verified successfully. Welcome!",
          })
          router.push("/")
        } else {
          router.push("/auth/sign-in")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try signing in again.",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
      }
    }

    handleAuthCallback()
  }, [router, supabase, toast])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h2 className="text-xl font-semibold">Confirming your email...</h2>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    </div>
  )
}

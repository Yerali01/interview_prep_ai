"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { getClientSupabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    console.log("🔧 ResetPassword: Initializing...")

    // Check if we have access to the hash fragment
    const checkSession = async () => {
      try {
        console.log("🔧 ResetPassword: Getting client supabase...")
        const supabase = getClientSupabase()

        console.log("🔧 ResetPassword: Checking session...")
        const { data, error } = await supabase.auth.getSession()

        console.log("🔧 ResetPassword: Session check result:", { data, error })

        if (error || !data.session) {
          console.log("❌ ResetPassword: Invalid or expired link")
          toast({
            title: "Invalid or expired link",
            description: "Please request a new password reset link",
            variant: "destructive",
          })
          router.push("/auth/forgot-password")
        } else {
          console.log("✅ ResetPassword: Valid session found")
          setIsReady(true)
        }
      } catch (error) {
        console.error("💥 ResetPassword: Error checking session:", error)
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        })
        router.push("/auth/forgot-password")
      }
    }

    checkSession()
  }, [router, toast])

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 ResetPassword: Form submitted")

    if (!validatePassword()) {
      console.log("❌ ResetPassword: Password validation failed")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("🔧 ResetPassword: Getting client supabase...")
      const supabase = getClientSupabase()

      console.log("📤 ResetPassword: Updating password...")
      const { error } = await supabase.auth.updateUser({ password })

      console.log("📥 ResetPassword: Update response:", { error })

      if (error) {
        console.error("❌ ResetPassword: Update error:", error)
        throw error
      }

      console.log("✅ ResetPassword: Password updated successfully")
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      })

      router.push("/auth/sign-in")
    } catch (error: any) {
      console.error("💥 ResetPassword: Error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isReady) {
    return (
      <div className="container max-w-md mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

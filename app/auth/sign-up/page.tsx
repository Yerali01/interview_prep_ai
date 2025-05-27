"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const validatePassword = () => {
    console.log("🔍 Validating password...")
    console.log("Password length:", password.length)
    console.log("Passwords match:", password === confirmPassword)

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      console.log("❌ Password validation failed: passwords don't match")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      console.log("❌ Password validation failed: too short")
      return false
    }
    setPasswordError("")
    console.log("✅ Password validation passed")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Sign up form submitted")
    console.log("📧 Email:", email)
    console.log("🔒 Password length:", password.length)

    setGeneralError("")

    if (!validatePassword()) {
      console.log("❌ Form submission stopped: password validation failed")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("📤 Calling signUp function...")

      await signUp(email, password)

      console.log("✅ Sign up function completed successfully")
      setShowSuccess(true)

      // Don't redirect immediately, let user see the success message
      setTimeout(() => {
        console.log("🔄 Redirecting to success page...")
        router.push("/auth/sign-up-success")
      }, 2000)
    } catch (error: any) {
      console.error("❌ Sign up form error:", error)
      console.error("Error message:", error.message)
      console.error("Error details:", error)

      setGeneralError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
      console.log("🏁 Form submission process completed")
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Sign up to track your progress and save your quiz results</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              {showSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>
                    Account created successfully! Please check your email for a confirmation link.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting || showSuccess}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : showSuccess ? (
                  "Account Created!"
                ) : (
                  "Sign Up"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

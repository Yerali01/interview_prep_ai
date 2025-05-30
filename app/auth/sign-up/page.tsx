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
import { ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Github } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { signUp, signInWithGitHub } = useAuth()
  const router = useRouter()

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
    setGeneralError("")

    if (!validatePassword()) {
      return
    }

    try {
      setIsSubmitting(true)
      await signUp(email, password)
      setShowSuccess(true)

      // Show success message and redirect
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      console.error("Sign up error:", error)

      // Handle specific Firebase auth errors
      let errorMessage = error.message || "An unexpected error occurred. Please try again."

      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "An account with this email already exists. Please sign in instead."
      } else if (errorMessage.includes("invalid-email")) {
        errorMessage = "Please enter a valid email address."
      } else if (errorMessage.includes("weak-password")) {
        errorMessage = "Password is too weak. Please choose a stronger password."
      }

      setGeneralError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGitHubSignUp = async () => {
    try {
      setIsSubmitting(true)
      setGeneralError("")
      await signInWithGitHub()
      router.push("/")
    } catch (error: any) {
      console.error("GitHub sign up error:", error)
      setGeneralError(error.message || "Failed to sign up with GitHub. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                    Account created successfully! Please check your email for a verification link, then you'll be
                    redirected to the home page.
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
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

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGitHubSignUp}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                Sign up with GitHub
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

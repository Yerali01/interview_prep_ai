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
import { ArrowLeft, Loader2, Eye, EyeOff, AlertCircle, Github } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const { signIn, signInWithGitHub } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    try {
      setIsSubmitting(true)
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      console.error("Sign in error:", error)

      // Handle specific Firebase auth errors
      let errorMessage = error.message || "An unexpected error occurred. Please try again."

      if (errorMessage.includes("user-not-found") || errorMessage.includes("wrong-password")) {
        errorMessage = "Invalid email or password. Please try again."
      } else if (errorMessage.includes("too-many-requests")) {
        errorMessage = "Too many failed login attempts. Please try again later."
      }

      setGeneralError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      setIsSubmitting(true)
      setGeneralError("")
      await signInWithGitHub()
      router.push("/")
    } catch (error: any) {
      console.error("GitHub sign in error:", error)
      setGeneralError(error.message || "Failed to sign in with GitHub. Please try again.")
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
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  "Sign In"
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
                onClick={handleGitHubSignIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                Sign in with GitHub
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

// Add this export to make the page dynamic instead of static
export const dynamic = "force-dynamic"

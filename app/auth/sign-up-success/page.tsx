"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We've sent you a confirmation link to complete your registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the confirmation link in the email</li>
                  <li>You'll be redirected back to sign in</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/auth/sign-up">Try Again</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

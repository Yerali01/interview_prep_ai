"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function AuthTestPage() {
  const { user, loading } = useAuth()
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("password123")
  const [testResult, setTestResult] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      console.log("Firebase Auth State:", user)
    })

    return () => unsubscribe()
  }, [])

  const testSignUp = async () => {
    try {
      setTestResult("Testing sign up...")
      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
      setTestResult(`✅ Sign up successful! User: ${userCredential.user.email}`)
    } catch (error: any) {
      setTestResult(`❌ Sign up failed: ${error.message}`)
    }
  }

  const testSignIn = async () => {
    try {
      setTestResult("Testing sign in...")
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword)
      setTestResult(`✅ Sign in successful! User: ${userCredential.user.email}`)
    } catch (error: any) {
      setTestResult(`❌ Sign in failed: ${error.message}`)
    }
  }

  const testSignOut = async () => {
    try {
      setTestResult("Testing sign out...")
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
      setTestResult("✅ Sign out successful!")
    } catch (error: any) {
      setTestResult(`❌ Sign out failed: ${error.message}`)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Authentication Test</CardTitle>
          <CardDescription>Test Firebase auth functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Auth Provider State</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify({ user, loading }, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Firebase Auth State</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(
                  firebaseUser
                    ? {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        emailVerified: firebaseUser.emailVerified,
                      }
                    : null,
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email</Label>
            <Input id="testEmail" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testPassword">Test Password</Label>
            <Input
              id="testPassword"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testSignUp}>Test Sign Up</Button>
            <Button onClick={testSignIn}>Test Sign In</Button>
            <Button onClick={testSignOut} variant="outline">
              Test Sign Out
            </Button>
          </div>

          {testResult && (
            <Alert>
              <AlertDescription>{testResult}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

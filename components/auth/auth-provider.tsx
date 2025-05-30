"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGitHub: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user")
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log("Signing up with email:", email)

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      console.log("User created successfully:", user.uid)

      // Send email verification
      await sendEmailVerification(user)
      console.log("Verification email sent")

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        email_verified: user.emailVerified,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })

      console.log("User profile created in Firestore")
    } catch (error: any) {
      console.error("Sign up error:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log("Signing in with email:", email)

      await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful")
    } catch (error: any) {
      console.error("Sign in error:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      setLoading(true)
      console.log("Signing in with GitHub")

      const provider = new GithubAuthProvider()
      provider.addScope("user:email")
      provider.addScope("read:user")

      const result = await signInWithPopup(auth, provider)
      const credential = GithubAuthProvider.credentialFromResult(result)
      const user = result.user

      console.log("GitHub sign in successful")

      if (credential?.accessToken) {
        // Get GitHub user data
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${credential.accessToken}`,
          },
        })

        const githubData = await response.json()

        // Update user profile in Firestore
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            email: user.email,
            email_verified: user.emailVerified,
            display_name: githubData.name || githubData.login,
            github_username: githubData.login,
            github_avatar: githubData.avatar_url,
            github_access_token: credential.accessToken,
            updated_at: serverTimestamp(),
          },
          { merge: true },
        )

        console.log("GitHub profile saved to Firestore")
      }
    } catch (error: any) {
      console.error("GitHub sign in error:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      console.log("Signing out")

      await firebaseSignOut(auth)
      console.log("Sign out successful")
    } catch (error: any) {
      console.error("Sign out error:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      console.log("Sending password reset email to:", email)

      await sendPasswordResetEmail(auth, email)
      console.log("Password reset email sent")
    } catch (error: any) {
      console.error("Password reset error:", error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGitHub,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

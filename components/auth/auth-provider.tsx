"use client"

import { useState, useEffect, useContext, createContext, type ReactNode } from "react"
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  updateProfile,
  type User,
  linkWithPopup,
} from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import app from "@/lib/firebase"

const auth = getAuth(app)
const db = getFirestore(app)

interface Auth {
  user: User | null
  loading: boolean
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  linkGitHubAccount: () => Promise<void>
}

const AuthContext = createContext<Auth>({
  user: null,
  loading: true,
  signInWithGitHub: async () => {},
  signOut: async () => {},
  linkGitHubAccount: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGitHub = async () => {
    setLoading(true)
    const provider = new GithubAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const credential = GithubAuthProvider.credentialFromResult(result)

      if (credential) {
        const githubResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${credential.accessToken}`,
          },
        })

        const githubUserData = await githubResponse.json()

        await updateProfile(user, {
          displayName: githubUserData.name || githubUserData.login,
        })

        await setDoc(
          doc(db, "users", user.uid),
          {
            github_username: githubUserData.login,
            github_avatar: githubUserData.avatar_url,
            github_access_token: credential.accessToken,
            updated_at: new Date().toISOString(),
          },
          { merge: true },
        )
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error)
    } finally {
      setLoading(false)
    }
  }

  const signOutUser = async () => {
    try {
      setLoading(true)
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  const linkGitHubAccount = async () => {
    const provider = new GithubAuthProvider()

    try {
      const result = await linkWithPopup(auth.currentUser!, provider)
      const credential = GithubAuthProvider.credentialFromResult(result)

      if (credential) {
        const githubResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${credential.accessToken}`,
          },
        })

        // After getting GitHub user data
        const githubUserData = await githubResponse.json()

        // Update user profile with GitHub info
        await updateProfile(auth.currentUser!, {
          displayName: githubUserData.name || githubUserData.login,
        })

        // Store GitHub info in Firestore with correct field names
        await setDoc(
          doc(db, "users", auth.currentUser!.uid),
          {
            github_username: githubUserData.login, // This should be 'login', not 'username'
            github_avatar: githubUserData.avatar_url,
            github_access_token: credential.accessToken,
            updated_at: new Date().toISOString(),
          },
          { merge: true },
        )
      }
    } catch (error) {
      console.error("Error linking GitHub account:", error)
    }
  }

  const value: Auth = {
    user,
    loading,
    signInWithGitHub,
    signOut: signOutUser,
    linkGitHubAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

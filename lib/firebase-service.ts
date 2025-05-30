import { signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

const githubProvider = new GithubAuthProvider()

const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider)
    const credential = GithubAuthProvider.credentialFromResult(result)
    const user = result.user

    if (credential?.accessToken) {
      const githubResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${credential.accessToken}`,
        },
      })

      const githubUser = await githubResponse.json()

      // When storing GitHub user data
      const userData = {
        email: user.email,
        display_name: githubUser.name || githubUser.login,
        github_username: githubUser.login, // Use 'login' field from GitHub API
        github_avatar: githubUser.avatar_url,
        github_access_token: credential.accessToken,
        email_confirmed_at: user.emailVerified ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const userDocRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(userDocRef)

      if (!docSnap.exists()) {
        await setDoc(userDocRef, userData)
      } else {
        await setDoc(userDocRef, {
          ...userData,
          updated_at: new Date().toISOString(),
        })
      }
    }

    return user
  } catch (error) {
    console.error("Error signing in with GitHub", error)
    throw error
  }
}

const signOutFirebase = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out", error)
    throw error
  }
}

export { auth, db, signInWithGitHub, signOutFirebase }

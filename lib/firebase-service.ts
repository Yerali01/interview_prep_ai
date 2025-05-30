import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithPopup,
  linkWithPopup,
  GithubAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth"
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { auth, db } from "./firebase"

// Types
interface User {
  id: string
  email: string | null
  email_confirmed_at: string | null
  github_username?: string | null
  github_avatar?: string | null
  display_name?: string | null
}

interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string
  level: string
  estimated_time: number
  created_at: string
  updated_at: string
}

interface Definition {
  id: string
  term: string
  definition: string
  category: string
  created_at: string
  updated_at: string
}

interface Project {
  id: string
  name: string
  slug: string
  description: string
  difficulty_level: string
  estimated_duration: string
  category: string
  github_url?: string
  demo_url?: string
  image_url?: string
  is_pet_project: boolean
  real_world_example?: string
  created_at: string
  updated_at: string
  technologies?: any[]
  features?: any[]
}

interface Quiz {
  id: string
  slug: string
  title: string
  description: string
  level: string
  created_at: string
  updated_at: string
  questions?: any[]
}

// Auth functions
export async function firebaseSignUp(email: string, password: string) {
  try {
    console.log("🔥 Firebase: Starting sign up process...")
    console.log("📧 Email:", email)

    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Firebase: User created successfully")
    console.log("👤 User ID:", user.uid)
    console.log("📧 User email:", user.email)

    // Send email verification
    try {
      await sendEmailVerification(user)
      console.log("📧 Email verification sent")
    } catch (emailError) {
      console.warn("⚠️ Failed to send email verification:", emailError)
      // Don't fail the signup if email verification fails
    }

    // Create user profile in Firestore
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        email_verified: user.emailVerified,
        display_name: user.displayName,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
      console.log("✅ User profile created in Firestore")
    } catch (firestoreError) {
      console.warn("⚠️ Failed to create user profile in Firestore:", firestoreError)
      // Don't fail the signup if Firestore write fails
    }

    return {
      user: {
        id: user.uid,
        email: user.email,
        email_confirmed_at: user.emailVerified ? new Date().toISOString() : null,
        display_name: user.displayName,
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase sign up error:", error)

    // Map Firebase errors to user-friendly messages
    let errorMessage = "An unexpected error occurred. Please try again."

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "An account with this email already exists. Please sign in instead."
        break
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address."
        break
      case "auth/weak-password":
        errorMessage = "Password is too weak. Please choose a stronger password (at least 6 characters)."
        break
      case "auth/operation-not-allowed":
        errorMessage = "Email/password accounts are not enabled. Please contact support."
        break
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection and try again."
        break
      default:
        errorMessage = error.message || errorMessage
    }

    return { user: null, error: { message: errorMessage, code: error.code } }
  }
}

export async function firebaseSignIn(email: string, password: string) {
  try {
    console.log("🔥 Firebase: Starting sign in process...")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Firebase: Sign in successful")
    return {
      user: {
        id: user.uid,
        email: user.email,
        email_confirmed_at: user.emailVerified ? new Date().toISOString() : null,
        display_name: user.displayName,
        github_username: user.providerData.find((p) => p.providerId === "github.com")?.displayName,
        github_avatar: user.providerData.find((p) => p.providerId === "github.com")?.photoURL,
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase: Sign in error:", error)
    return { user: null, error }
  }
}

export async function firebaseSignInWithGitHub() {
  try {
    console.log("🔥 Firebase: Starting GitHub sign in...")
    const provider = new GithubAuthProvider()
    provider.addScope("user:email")
    provider.addScope("read:user")

    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const credential = GithubAuthProvider.credentialFromResult(result)

    console.log("✅ Firebase: GitHub sign in successful")
    console.log("👤 GitHub user:", user.displayName)

    // Update user profile in Firestore
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          email_verified: user.emailVerified,
          display_name: user.displayName,
          github_username: user.displayName,
          github_avatar: user.photoURL,
          github_access_token: credential?.accessToken,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        },
        { merge: true },
      )
      console.log("✅ GitHub user profile updated in Firestore")
    } catch (firestoreError) {
      console.warn("⚠️ Failed to update user profile in Firestore:", firestoreError)
    }

    return {
      user: {
        id: user.uid,
        email: user.email,
        email_confirmed_at: user.emailVerified ? new Date().toISOString() : null,
        display_name: user.displayName,
        github_username: user.displayName,
        github_avatar: user.photoURL,
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase: GitHub sign in error:", error)

    let errorMessage = "Failed to sign in with GitHub. Please try again."

    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        errorMessage = "An account already exists with the same email address but different sign-in credentials."
        break
      case "auth/popup-closed-by-user":
        errorMessage = "Sign-in popup was closed. Please try again."
        break
      case "auth/popup-blocked":
        errorMessage = "Sign-in popup was blocked by your browser. Please allow popups and try again."
        break
      case "auth/cancelled-popup-request":
        errorMessage = "Sign-in was cancelled. Please try again."
        break
      default:
        errorMessage = error.message || errorMessage
    }

    return { user: null, error: { message: errorMessage, code: error.code } }
  }
}

export async function firebaseLinkGitHubAccount() {
  try {
    console.log("🔥 Firebase: Linking GitHub account...")
    const user = auth.currentUser
    if (!user) {
      throw new Error("No user is currently signed in")
    }

    const provider = new GithubAuthProvider()
    provider.addScope("user:email")
    provider.addScope("read:user")

    const result = await linkWithPopup(user, provider)
    const credential = GithubAuthProvider.credentialFromResult(result)

    console.log("✅ Firebase: GitHub account linked successfully")

    // Update user profile in Firestore
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          github_username: result.user.displayName,
          github_avatar: result.user.photoURL,
          github_access_token: credential?.accessToken,
          updated_at: serverTimestamp(),
        },
        { merge: true },
      )
      console.log("✅ GitHub account info updated in Firestore")
    } catch (firestoreError) {
      console.warn("⚠️ Failed to update GitHub info in Firestore:", firestoreError)
    }

    return {
      user: {
        id: result.user.uid,
        email: result.user.email,
        email_confirmed_at: result.user.emailVerified ? new Date().toISOString() : null,
        display_name: result.user.displayName,
        github_username: result.user.displayName,
        github_avatar: result.user.photoURL,
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase: GitHub linking error:", error)

    let errorMessage = "Failed to link GitHub account. Please try again."

    switch (error.code) {
      case "auth/credential-already-in-use":
        errorMessage = "This GitHub account is already linked to another user."
        break
      case "auth/popup-closed-by-user":
        errorMessage = "Linking popup was closed. Please try again."
        break
      case "auth/popup-blocked":
        errorMessage = "Linking popup was blocked by your browser. Please allow popups and try again."
        break
      default:
        errorMessage = error.message || errorMessage
    }

    return { user: null, error: { message: errorMessage, code: error.code } }
  }
}

export async function firebaseSignOut() {
  try {
    console.log("🔥 Firebase: Starting sign out process...")
    await signOut(auth)
    console.log("✅ Firebase: Sign out successful")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase: Sign out error:", error)
    return { error }
  }
}

export async function firebaseResetPassword(email: string) {
  try {
    console.log("🔥 Firebase: Sending password reset email...")
    await sendPasswordResetEmail(auth, email)
    console.log("✅ Firebase: Password reset email sent")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase: Reset password error:", error)
    return { error }
  }
}

export function onFirebaseAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// Data functions
export async function firebaseGetTopics(): Promise<Topic[]> {
  try {
    console.log("🔥 Firebase: Fetching topics...")
    const querySnapshot = await getDocs(collection(db, "topics"))
    const topics: Topic[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      topics.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        level: data.level,
        estimated_time: data.estimated_time,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      })
    })

    console.log(`✅ Firebase: Retrieved ${topics.length} topics`)
    return topics
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching topics:", error)
    throw error
  }
}

export async function firebaseGetTopicBySlug(slug: string): Promise<Topic | null> {
  try {
    console.log(`🔥 Firebase: Fetching topic by slug: ${slug}`)
    const q = query(collection(db, "topics"), where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("❌ Firebase: Topic not found")
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    const topic: Topic = {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      level: data.level,
      estimated_time: data.estimated_time,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
    }

    console.log("✅ Firebase: Topic retrieved successfully")
    return topic
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching topic:", error)
    throw error
  }
}

export async function firebaseGetDefinitions(): Promise<Definition[]> {
  try {
    console.log("🔥 Firebase: Fetching definitions...")
    const querySnapshot = await getDocs(collection(db, "definitions"))
    const definitions: Definition[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      definitions.push({
        id: doc.id,
        term: data.term,
        definition: data.definition,
        category: data.category,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      })
    })

    console.log(`✅ Firebase: Retrieved ${definitions.length} definitions`)
    return definitions
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching definitions:", error)
    throw error
  }
}

export async function firebaseGetDefinitionByTerm(term: string): Promise<Definition | null> {
  try {
    console.log(`🔥 Firebase: Fetching definition by term: ${term}`)
    const q = query(collection(db, "definitions"), where("term", "==", term), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("❌ Firebase: Definition not found")
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    const definition: Definition = {
      id: doc.id,
      term: data.term,
      definition: data.definition,
      category: data.category,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
    }

    console.log("✅ Firebase: Definition retrieved successfully")
    return definition
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching definition:", error)
    throw error
  }
}

export async function firebaseGetProjects(): Promise<Project[]> {
  try {
    console.log("🔥 Firebase: Fetching projects...")
    const querySnapshot = await getDocs(collection(db, "projects"))
    const projects: Project[] = []

    for (const doc of querySnapshot.docs) {
      const data = doc.data()

      // Get technologies for this project
      const techQuery = query(collection(db, "project_technologies"), where("project_id", "==", doc.id))
      const techSnapshot = await getDocs(techQuery)
      const technologies = techSnapshot.docs.map((techDoc) => techDoc.data())

      // Get features for this project
      const featuresQuery = query(collection(db, "project_features"), where("project_id", "==", doc.id))
      const featuresSnapshot = await getDocs(featuresQuery)
      const features = featuresSnapshot.docs.map((featureDoc) => featureDoc.data())

      projects.push({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        difficulty_level: data.difficulty_level,
        estimated_duration: data.estimated_duration,
        category: data.category,
        github_url: data.github_url,
        demo_url: data.demo_url,
        image_url: data.image_url,
        is_pet_project: data.is_pet_project,
        real_world_example: data.real_world_example,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        technologies,
        features,
      })
    }

    console.log(`✅ Firebase: Retrieved ${projects.length} projects`)
    return projects
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching projects:", error)
    throw error
  }
}

export async function firebaseGetProjectBySlug(slug: string): Promise<Project | null> {
  try {
    console.log(`🔥 Firebase: Fetching project by slug: ${slug}`)
    const q = query(collection(db, "projects"), where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("❌ Firebase: Project not found")
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    // Get technologies for this project
    const techQuery = query(collection(db, "project_technologies"), where("project_id", "==", doc.id))
    const techSnapshot = await getDocs(techQuery)
    const technologies = techSnapshot.docs.map((techDoc) => techDoc.data())

    // Get features for this project
    const featuresQuery = query(collection(db, "project_features"), where("project_id", "==", doc.id))
    const featuresSnapshot = await getDocs(featuresQuery)
    const features = featuresSnapshot.docs.map((featureDoc) => featureDoc.data())

    const project: Project = {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      difficulty_level: data.difficulty_level,
      estimated_duration: data.estimated_duration,
      category: data.category,
      github_url: data.github_url,
      demo_url: data.demo_url,
      image_url: data.image_url,
      is_pet_project: data.is_pet_project,
      real_world_example: data.real_world_example,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      technologies,
      features,
    }

    console.log("✅ Firebase: Project retrieved successfully")
    return project
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching project:", error)
    throw error
  }
}

export async function firebaseGetQuizzes(): Promise<Quiz[]> {
  try {
    console.log("🔥 Firebase: Fetching quizzes...")
    const querySnapshot = await getDocs(collection(db, "quizzes"))
    const quizzes: Quiz[] = []

    for (const doc of querySnapshot.docs) {
      const data = doc.data()

      // Get questions for this quiz
      const questionsQuery = query(collection(db, "quiz_questions"), where("quiz_id", "==", doc.id))
      const questionsSnapshot = await getDocs(questionsQuery)
      const questions = questionsSnapshot.docs.map((questionDoc) => questionDoc.data())

      quizzes.push({
        id: doc.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        level: data.level,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        questions,
      })
    }

    console.log(`✅ Firebase: Retrieved ${quizzes.length} quizzes`)
    return quizzes
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching quizzes:", error)
    throw error
  }
}

export async function firebaseGetQuizBySlug(slug: string): Promise<Quiz | null> {
  try {
    console.log(`🔥 Firebase: Fetching quiz by slug: ${slug}`)
    const q = query(collection(db, "quizzes"), where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("❌ Firebase: Quiz not found")
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    // Get questions for this quiz
    const questionsQuery = query(collection(db, "quiz_questions"), where("quiz_id", "==", doc.id))
    const questionsSnapshot = await getDocs(questionsQuery)
    const questions = questionsSnapshot.docs.map((questionDoc) => questionDoc.data())

    const quiz: Quiz = {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      level: data.level,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      questions,
    }

    console.log("✅ Firebase: Quiz retrieved successfully")
    return quiz
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching quiz:", error)
    throw error
  }
}

export async function firebaseGetQuizById(id: string): Promise<Quiz | null> {
  try {
    console.log(`🔥 Firebase: Fetching quiz by ID: ${id}`)
    const docRef = doc(db, "quizzes", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log("❌ Firebase: Quiz not found")
      return null
    }

    const data = docSnap.data()

    // Get questions for this quiz
    const questionsQuery = query(collection(db, "quiz_questions"), where("quiz_id", "==", id))
    const questionsSnapshot = await getDocs(questionsQuery)
    const questions = questionsSnapshot.docs.map((questionDoc) => questionDoc.data())

    const quiz: Quiz = {
      id: docSnap.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      level: data.level,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      questions,
    }

    console.log("✅ Firebase: Quiz retrieved successfully")
    return quiz
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching quiz:", error)
    throw error
  }
}

// Repository showcase functions
export async function firebaseSaveUserRepositories(userId: string, repositories: any[]) {
  try {
    console.log(`🔥 Firebase: Saving showcased repositories for user ${userId}`)
    await setDoc(
      doc(db, "user_repositories", userId),
      {
        user_id: userId,
        repositories,
        updated_at: serverTimestamp(),
      },
      { merge: true },
    )
    console.log("✅ Firebase: User repositories saved successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase: Error saving user repositories:", error)
    return { error }
  }
}

export async function firebaseGetUserRepositories(userId: string) {
  try {
    console.log(`🔥 Firebase: Fetching showcased repositories for user ${userId}`)
    const docRef = doc(db, "user_repositories", userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.log("❌ Firebase: No repositories found for user")
      return []
    }

    const data = docSnap.data()
    console.log(`✅ Firebase: Retrieved ${data.repositories?.length || 0} repositories`)
    return data.repositories || []
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching user repositories:", error)
    throw error
  }
}

export async function firebaseGetPublicUserProfile(userId: string) {
  try {
    console.log(`🔥 Firebase: Fetching public profile for user ${userId}`)

    // Get user basic info
    const userDocRef = doc(db, "users", userId)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return null
    }

    const userData = userDocSnap.data()

    // Get user's showcased repositories
    const repositories = await firebaseGetUserRepositories(userId)

    // Get user's quiz results count
    const quizResultsQuery = query(collection(db, "user_quiz_results"), where("user_id", "==", userId))
    const quizResultsSnapshot = await getDocs(quizResultsQuery)

    const profile = {
      id: userId,
      display_name: userData.display_name,
      github_username: userData.github_username,
      github_avatar: userData.github_avatar,
      repositories,
      quiz_count: quizResultsSnapshot.size,
      created_at: userData.created_at?.toDate?.()?.toISOString() || userData.created_at,
    }

    console.log("✅ Firebase: Public profile retrieved successfully")
    return profile
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching public profile:", error)
    throw error
  }
}

// User progress functions
export async function firebaseSaveQuizResult(userId: string, quizId: string, score: number, totalQuestions: number) {
  try {
    console.log(`🔥 Firebase: Saving quiz result for user ${userId}`)
    await addDoc(collection(db, "user_quiz_results"), {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      completed_at: serverTimestamp(),
      created_at: serverTimestamp(),
    })
    console.log("✅ Firebase: Quiz result saved successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase: Error saving quiz result:", error)
    return { error }
  }
}

export async function firebaseGetUserQuizResults(userId: string) {
  try {
    console.log(`🔥 Firebase: Fetching quiz results for user ${userId}`)
    const q = query(collection(db, "user_quiz_results"), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      completed_at: doc.data().completed_at?.toDate?.()?.toISOString() || doc.data().completed_at,
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
    }))

    console.log(`✅ Firebase: Retrieved ${results.length} quiz results`)
    return results
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching quiz results:", error)
    throw error
  }
}

export async function firebaseMarkTopicAsRead(userId: string, topicId: string) {
  try {
    console.log(`🔥 Firebase: Marking topic as read for user ${userId}`)
    await addDoc(collection(db, "user_topic_progress"), {
      user_id: userId,
      topic_id: topicId,
      is_read: true,
      read_at: serverTimestamp(),
      created_at: serverTimestamp(),
    })
    console.log("✅ Firebase: Topic marked as read successfully")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase: Error marking topic as read:", error)
    return { error }
  }
}

export async function firebaseGetUserTopicProgress(userId: string) {
  try {
    console.log(`🔥 Firebase: Fetching topic progress for user ${userId}`)
    const q = query(collection(db, "user_topic_progress"), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)

    const progress = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      read_at: doc.data().read_at?.toDate?.()?.toISOString() || doc.data().read_at,
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
    }))

    console.log(`✅ Firebase: Retrieved ${progress.length} topic progress records`)
    return progress
  } catch (error: any) {
    console.error("❌ Firebase: Error fetching topic progress:", error)
    throw error
  }
}

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOutFn,
  sendPasswordResetEmail,
} from "firebase/auth"
import { app } from "./firebase"

const db = getFirestore(app)
const auth = getAuth(app)

// Types
export interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string | TopicSection[]
  level: string
  estimated_time: number
  created_at: string
  updated_at: string
}

export interface TopicSection {
  title: string
  content: string
  code?: string
}

export interface Quiz {
  id: string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
  questions?: QuizQuestion[]
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  quiz_slug: string
  question: string
  options: Record<string, string>
  correct_answer: string
  explanation: string
  category?: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  difficulty_level: "beginner" | "intermediate" | "advanced"
  estimated_duration: string
  category: string
  github_url?: string
  demo_url?: string
  image_url?: string
  is_pet_project: boolean
  real_world_example?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
}

// Helper function to handle Firestore errors
function handleFirestoreError(error: any, operation: string) {
  console.error(`❌ Firebase ${operation} failed:`, error)

  if (error.code === "permission-denied") {
    throw new Error(`Permission denied for ${operation}. Please check Firebase security rules.`)
  } else if (error.code === "unavailable") {
    throw new Error(`Firebase is currently unavailable. Please try again later.`)
  } else if (error.code === "not-found") {
    throw new Error(`Data not found for ${operation}.`)
  } else {
    throw new Error(`${operation} failed: ${error.message}`)
  }
}

// Auth functions
export async function firebaseSignUp(email: string, password: string) {
  try {
    console.log("🔥 Firebase signup attempt for:", email)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Firebase signup successful:", user.uid)
    return {
      data: {
        user: {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase signup failed:", error)
    return { data: null, error: { message: error.message } }
  }
}

export async function firebaseSignIn(email: string, password: string) {
  try {
    console.log("🔥 Firebase signin attempt for:", email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Firebase signin successful:", user.uid)
    return {
      data: {
        user: {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      },
      error: null,
    }
  } catch (error: any) {
    console.error("❌ Firebase signin failed:", error)
    return { data: null, error: { message: error.message } }
  }
}

export async function firebaseSignOut() {
  try {
    console.log("🔥 Firebase signout attempt")
    await firebaseSignOutFn()
    console.log("✅ Firebase signout successful")
    return { error: null }
  } catch (error: any) {
    console.error("❌ Firebase signout failed:", error)
    return { error: { message: error.message } }
  }
}

export async function firebaseResetPassword(email: string) {
  try {
    console.log("🔥 Firebase password reset for:", email)
    await sendPasswordResetEmail(auth, email)
    console.log("✅ Firebase password reset email sent")
    return { data: { message: "Password reset email sent" }, error: null }
  } catch (error: any) {
    console.error("❌ Firebase password reset failed:", error)
    return { data: null, error: { message: error.message } }
  }
}

// Topic functions
export async function firebaseGetTopics(): Promise<Topic[]> {
  try {
    console.log("🔥 Fetching topics from Firebase...")
    const topicsRef = collection(db, "topics")
    const snapshot = await getDocs(topicsRef)

    if (snapshot.empty) {
      console.warn("⚠️ No topics found in Firebase")
      return []
    }

    const topics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Topic[]

    console.log(`✅ Successfully fetched ${topics.length} topics from Firebase`)
    return topics
  } catch (error) {
    handleFirestoreError(error, "get topics")
    return []
  }
}

export async function firebaseGetTopicBySlug(slug: string): Promise<Topic | null> {
  try {
    console.log(`🔥 Fetching topic by slug: ${slug}`)
    const topicsRef = collection(db, "topics")
    const q = query(topicsRef, where("slug", "==", slug))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn(`⚠️ No topic found with slug: ${slug}`)
      return null
    }

    const doc = snapshot.docs[0]
    const topic = { id: doc.id, ...doc.data() } as Topic

    console.log(`✅ Successfully fetched topic: ${topic.title}`)
    return topic
  } catch (error) {
    handleFirestoreError(error, `get topic by slug: ${slug}`)
    return null
  }
}

// Quiz functions
export async function firebaseGetQuizzes(): Promise<Quiz[]> {
  try {
    console.log("🔥 Fetching quizzes from Firebase...")
    const quizzesRef = collection(db, "quizzes")
    const snapshot = await getDocs(quizzesRef)

    if (snapshot.empty) {
      console.warn("⚠️ No quizzes found in Firebase")
      return []
    }

    const quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[]

    console.log(`✅ Successfully fetched ${quizzes.length} quizzes from Firebase`)
    return quizzes
  } catch (error) {
    handleFirestoreError(error, "get quizzes")
    return []
  }
}

export async function firebaseGetQuizBySlug(slug: string): Promise<Quiz | null> {
  try {
    console.log(`🔥 Fetching quiz by slug: ${slug}`)

    // Get quiz
    const quizzesRef = collection(db, "quizzes")
    const quizQuery = query(quizzesRef, where("slug", "==", slug))
    const quizSnapshot = await getDocs(quizQuery)

    if (quizSnapshot.empty) {
      console.warn(`⚠️ No quiz found with slug: ${slug}`)
      return null
    }

    const quizDoc = quizSnapshot.docs[0]
    const quiz = { id: quizDoc.id, ...quizDoc.data() } as Quiz

    // Get questions for this quiz
    const questionsRef = collection(db, "questions")
    const questionsQuery = query(questionsRef, where("quiz_slug", "==", slug))
    const questionsSnapshot = await getDocs(questionsQuery)

    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizQuestion[]

    quiz.questions = questions

    console.log(`✅ Successfully fetched quiz: ${quiz.title} with ${questions.length} questions`)
    return quiz
  } catch (error) {
    handleFirestoreError(error, `get quiz by slug: ${slug}`)
    return null
  }
}

export async function firebaseGetQuizById(id: string): Promise<Quiz | null> {
  try {
    console.log(`🔥 Fetching quiz by ID: ${id}`)

    // Get quiz
    const quizRef = doc(db, "quizzes", id)
    const quizDoc = await getDoc(quizRef)

    if (!quizDoc.exists()) {
      console.warn(`⚠️ No quiz found with ID: ${id}`)
      return null
    }

    const quiz = { id: quizDoc.id, ...quizDoc.data() } as Quiz

    // Get questions for this quiz
    const questionsRef = collection(db, "questions")
    const questionsQuery = query(questionsRef, where("quiz_id", "==", id))
    const questionsSnapshot = await getDocs(questionsQuery)

    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizQuestion[]

    quiz.questions = questions

    console.log(`✅ Successfully fetched quiz: ${quiz.title} with ${questions.length} questions`)
    return quiz
  } catch (error) {
    handleFirestoreError(error, `get quiz by ID: ${id}`)
    return null
  }
}

// Project functions
export async function firebaseGetProjects(): Promise<Project[]> {
  try {
    console.log("🔥 Fetching projects from Firebase...")
    const projectsRef = collection(db, "projects")
    const snapshot = await getDocs(projectsRef)

    if (snapshot.empty) {
      console.warn("⚠️ No projects found in Firebase")
      return []
    }

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[]

    console.log(`✅ Successfully fetched ${projects.length} projects from Firebase`)
    return projects
  } catch (error) {
    handleFirestoreError(error, "get projects")
    return []
  }
}

export async function firebaseGetProjectBySlug(slug: string): Promise<Project | null> {
  try {
    console.log(`🔥 Fetching project by slug: ${slug}`)
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, where("slug", "==", slug))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn(`⚠️ No project found with slug: ${slug}`)
      return null
    }

    const doc = snapshot.docs[0]
    const project = { id: doc.id, ...doc.data() } as Project

    console.log(`✅ Successfully fetched project: ${project.name}`)
    return project
  } catch (error) {
    handleFirestoreError(error, `get project by slug: ${slug}`)
    return null
  }
}

// User progress functions
export async function firebaseSaveQuizResult(userId: string, quizId: string, score: number, totalQuestions: number) {
  try {
    console.log(`🔥 Saving quiz result for user ${userId}`)
    const resultRef = collection(db, "user_quiz_results")
    const result = {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      completed_at: Timestamp.now(),
    }

    await addDoc(resultRef, result)
    console.log("✅ Quiz result saved successfully")
    return result
  } catch (error) {
    handleFirestoreError(error, "save quiz result")
    return null
  }
}

export async function firebaseGetUserQuizResults(userId: string) {
  try {
    console.log(`🔥 Fetching quiz results for user ${userId}`)
    const resultsRef = collection(db, "user_quiz_results")
    const q = query(resultsRef, where("user_id", "==", userId), orderBy("completed_at", "desc"))
    const snapshot = await getDocs(q)

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`✅ Successfully fetched ${results.length} quiz results`)
    return results
  } catch (error) {
    handleFirestoreError(error, "get user quiz results")
    return []
  }
}

export async function firebaseMarkTopicAsRead(userId: string, topicId: string) {
  try {
    console.log(`🔥 Marking topic ${topicId} as read for user ${userId}`)
    const progressRef = doc(db, "user_topic_progress", `${userId}_${topicId}`)
    const progress = {
      user_id: userId,
      topic_id: topicId,
      read_at: Timestamp.now(),
    }

    await setDoc(progressRef, progress)
    console.log("✅ Topic marked as read successfully")
    return progress
  } catch (error) {
    handleFirestoreError(error, "mark topic as read")
    return null
  }
}

export async function firebaseGetUserTopicProgress(userId: string) {
  try {
    console.log(`🔥 Fetching topic progress for user ${userId}`)
    const progressRef = collection(db, "user_topic_progress")
    const q = query(progressRef, where("user_id", "==", userId))
    const snapshot = await getDocs(q)

    const progress = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`✅ Successfully fetched ${progress.length} topic progress records`)
    return progress
  } catch (error) {
    handleFirestoreError(error, "get user topic progress")
    return []
  }
}

// Definition functions (placeholder - add your definitions data)
export async function firebaseGetDefinitions() {
  try {
    console.log("🔥 Fetching definitions from Firebase...")
    const definitionsRef = collection(db, "definitions")
    const snapshot = await getDocs(definitionsRef)

    const definitions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`✅ Successfully fetched ${definitions.length} definitions`)
    return definitions
  } catch (error) {
    handleFirestoreError(error, "get definitions")
    return []
  }
}

export async function firebaseGetDefinitionByTerm(term: string) {
  try {
    console.log(`🔥 Fetching definition for term: ${term}`)
    const definitionsRef = collection(db, "definitions")
    const q = query(definitionsRef, where("term", "==", term))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn(`⚠️ No definition found for term: ${term}`)
      return null
    }

    const doc = snapshot.docs[0]
    const definition = { id: doc.id, ...doc.data() }

    console.log(`✅ Successfully fetched definition for: ${term}`)
    return definition
  } catch (error) {
    handleFirestoreError(error, `get definition by term: ${term}`)
    return null
  }
}

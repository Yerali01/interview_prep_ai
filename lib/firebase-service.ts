import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOutOriginal,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePasswordOriginal,
  type User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { auth, db } from "./firebase"

// Types matching your Supabase schema
export interface FirebaseTopic {
  id: string
  title: string
  slug: string
  description: string
  content: string | TopicSection[]
  level: string
  estimated_time: number
  created_at: Timestamp
  updated_at: Timestamp
}

export interface TopicSection {
  title: string
  content: string
  code?: string
}

export interface FirebaseDefinition {
  id: string
  term: string
  definition: string
  category?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirebaseProject {
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
  created_at: Timestamp
  updated_at: Timestamp
  technologies?: FirebaseProjectTechnology[]
  features?: FirebaseProjectFeature[]
}

export interface FirebaseProjectTechnology {
  id: string
  project_id: string
  technology_name: string
  explanation: string
  is_required: boolean
  category: string
}

export interface FirebaseProjectFeature {
  id: string
  project_id: string
  feature_name: string
  description: string
  priority: "low" | "medium" | "high"
}

export interface FirebaseQuiz {
  id: string
  slug: string
  title: string
  description: string
  level: "junior" | "middle" | "senior"
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirebaseQuizQuestion {
  id: string
  quiz_id: string
  quiz_slug: string
  question: string
  options: Record<string, string> | string
  correct_answer: string
  explanation: string
  category?: string
  created_at: Timestamp
}

export interface FirebaseQuizResult {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  completed_at: Timestamp
  quiz_title?: string
  quiz_level?: string
}

export interface FirebaseUserProgress {
  id: string
  user_id: string
  topic_id: string
  read_at: Timestamp
}

// Auth functions
export async function firebaseSignUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile document
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      email_verified: user.emailVerified,
    })

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
}

export async function firebaseSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
}

export async function firebaseSignOut() {
  try {
    await firebaseSignOutOriginal(auth)
    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

export async function firebaseResetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

export async function firebaseUpdatePassword(password: string) {
  try {
    if (auth.currentUser) {
      await firebaseUpdatePasswordOriginal(auth.currentUser, password)
      return { error: null }
    }
    return { error: new Error("No user logged in") }
  } catch (error: any) {
    return { error }
  }
}

export function onFirebaseAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// Topic functions
export async function firebaseGetTopics(): Promise<FirebaseTopic[]> {
  try {
    const topicsRef = collection(db, "topics")
    const q = query(topicsRef, orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseTopic[]
  } catch (error) {
    console.error("Error fetching topics from Firebase:", error)
    throw error
  }
}

export async function firebaseGetTopicBySlug(slug: string): Promise<FirebaseTopic | null> {
  try {
    const topicsRef = collection(db, "topics")
    const q = query(topicsRef, where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as FirebaseTopic
  } catch (error) {
    console.error("Error fetching topic by slug from Firebase:", error)
    return null
  }
}

export async function firebaseCreateTopic(topic: Omit<FirebaseTopic, "id" | "created_at" | "updated_at">) {
  try {
    const topicsRef = collection(db, "topics")
    const docRef = await addDoc(topicsRef, {
      ...topic,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return { id: docRef.id, error: null }
  } catch (error) {
    console.error("Error creating topic in Firebase:", error)
    return { id: null, error }
  }
}

// Definition functions
export async function firebaseGetDefinitions(): Promise<FirebaseDefinition[]> {
  try {
    const definitionsRef = collection(db, "definitions")
    const q = query(definitionsRef, orderBy("term", "asc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseDefinition[]
  } catch (error) {
    console.error("Error fetching definitions from Firebase:", error)
    throw error
  }
}

export async function firebaseGetDefinitionByTerm(term: string): Promise<FirebaseDefinition | null> {
  try {
    const definitionsRef = collection(db, "definitions")
    const q = query(definitionsRef, where("term", "==", term), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as FirebaseDefinition
  } catch (error) {
    console.error("Error fetching definition by term from Firebase:", error)
    return null
  }
}

// Project functions
export async function firebaseGetProjects(): Promise<FirebaseProject[]> {
  try {
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)

    const projects = await Promise.all(
      querySnapshot.docs.map(async (projectDoc) => {
        const projectData = { id: projectDoc.id, ...projectDoc.data() } as FirebaseProject

        // Fetch technologies
        const techRef = collection(db, "project_technologies")
        const techQuery = query(techRef, where("project_id", "==", projectDoc.id))
        const techSnapshot = await getDocs(techQuery)
        projectData.technologies = techSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirebaseProjectTechnology[]

        // Fetch features
        const featuresRef = collection(db, "project_features")
        const featuresQuery = query(featuresRef, where("project_id", "==", projectDoc.id))
        const featuresSnapshot = await getDocs(featuresQuery)
        projectData.features = featuresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirebaseProjectFeature[]

        return projectData
      }),
    )

    return projects
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error)
    throw error
  }
}

export async function firebaseGetProjectBySlug(slug: string): Promise<FirebaseProject | null> {
  try {
    const projectsRef = collection(db, "projects")
    const q = query(projectsRef, where("slug", "==", slug), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const projectDoc = querySnapshot.docs[0]
    const projectData = { id: projectDoc.id, ...projectDoc.data() } as FirebaseProject

    // Fetch technologies
    const techRef = collection(db, "project_technologies")
    const techQuery = query(techRef, where("project_id", "==", projectDoc.id))
    const techSnapshot = await getDocs(techQuery)
    projectData.technologies = techSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseProjectTechnology[]

    // Fetch features
    const featuresRef = collection(db, "project_features")
    const featuresQuery = query(featuresRef, where("project_id", "==", projectDoc.id))
    const featuresSnapshot = await getDocs(featuresQuery)
    projectData.features = featuresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseProjectFeature[]

    return projectData
  } catch (error) {
    console.error("Error fetching project by slug from Firebase:", error)
    return null
  }
}

// Quiz functions
export async function firebaseGetQuizzes(): Promise<FirebaseQuiz[]> {
  try {
    const quizzesRef = collection(db, "quizzes")
    const q = query(quizzesRef, orderBy("created_at", "asc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseQuiz[]
  } catch (error) {
    console.error("Error fetching quizzes from Firebase:", error)
    throw error
  }
}

export async function firebaseGetQuizBySlug(slug: string) {
  try {
    const quizzesRef = collection(db, "quizzes")
    const q = query(quizzesRef, where("slug", "==", slug), limit(1))
    const quizSnapshot = await getDocs(q)

    if (quizSnapshot.empty) {
      return null
    }

    const quizDoc = quizSnapshot.docs[0]
    const quiz = { id: quizDoc.id, ...quizDoc.data() }

    // Fetch questions
    const questionsRef = collection(db, "quiz_questions")
    const questionsQuery = query(questionsRef, where("quiz_slug", "==", slug))
    const questionsSnapshot = await getDocs(questionsQuery)

    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { ...quiz, questions }
  } catch (error) {
    console.error("Error fetching quiz by slug from Firebase:", error)
    return null
  }
}

export async function firebaseGetQuizById(id: string) {
  try {
    const quizDoc = await getDoc(doc(db, "quizzes", id))

    if (!quizDoc.exists()) {
      return null
    }

    const quiz = { id: quizDoc.id, ...quizDoc.data() }

    // Fetch questions
    const questionsRef = collection(db, "quiz_questions")
    const questionsQuery = query(questionsRef, where("quiz_id", "==", id))
    const questionsSnapshot = await getDocs(questionsQuery)

    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { ...quiz, questions }
  } catch (error) {
    console.error("Error fetching quiz by id from Firebase:", error)
    throw error
  }
}

// User progress functions
export async function firebaseSaveQuizResult(
  userId: string,
  quizId: string,
  score: number,
  totalQuestions: number,
  quizTitle?: string,
  quizLevel?: string,
) {
  try {
    const resultsRef = collection(db, "user_quiz_results")
    const docRef = await addDoc(resultsRef, {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      quiz_title: quizTitle,
      quiz_level: quizLevel,
      completed_at: serverTimestamp(),
    })
    return { id: docRef.id, error: null }
  } catch (error) {
    console.error("Error saving quiz result to Firebase:", error)
    return { id: null, error }
  }
}

export async function firebaseGetUserQuizResults(userId: string): Promise<FirebaseQuizResult[]> {
  try {
    const resultsRef = collection(db, "user_quiz_results")
    const q = query(resultsRef, where("user_id", "==", userId), orderBy("completed_at", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseQuizResult[]
  } catch (error) {
    console.error("Error fetching user quiz results from Firebase:", error)
    throw error
  }
}

export async function firebaseMarkTopicAsRead(userId: string, topicId: string) {
  try {
    const progressRef = collection(db, "user_topic_progress")
    const q = query(progressRef, where("user_id", "==", userId), where("topic_id", "==", topicId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // Create new progress record
      const docRef = await addDoc(progressRef, {
        user_id: userId,
        topic_id: topicId,
        read_at: serverTimestamp(),
      })
      return { id: docRef.id, error: null }
    } else {
      // Update existing record
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, {
        read_at: serverTimestamp(),
      })
      return { id: docRef.id, error: null }
    }
  } catch (error) {
    console.error("Error marking topic as read in Firebase:", error)
    return { id: null, error }
  }
}

export async function firebaseGetUserTopicProgress(userId: string): Promise<FirebaseUserProgress[]> {
  try {
    const progressRef = collection(db, "user_topic_progress")
    const q = query(progressRef, where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseUserProgress[]
  } catch (error) {
    console.error("Error fetching user topic progress from Firebase:", error)
    throw error
  }
}

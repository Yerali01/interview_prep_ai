import { collection, doc, getDocs, query, where, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"

// Type definitions
export interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string
  level: string
  estimated_time: number
  createdAt?: string
  updatedAt?: string
}

export interface Quiz {
  id: string
  slug: string
  title: string
  description: string
  level: string
  createdAt?: string
  updatedAt?: string
}

export interface Question {
  id: string
  quiz_id: string
  quiz_slug: string
  question: string
  options: Record<string, string>
  correct_answer: string
  explanation: string
  category: string
}

export interface Project {
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
  createdAt?: string
  updatedAt?: string
}

// Get all topics
export async function firebaseGetTopics(): Promise<Topic[]> {
  try {
    console.log("🔥 Fetching topics from Firebase...")
    const topicsCollection = collection(db, "topics")
    const topicsSnapshot = await getDocs(topicsCollection)

    if (topicsSnapshot.empty) {
      console.log("⚠️ No topics found in Firebase")
      return []
    }

    const topics = topicsSnapshot.docs.map((doc) => {
      const data = doc.data() as Topic
      return {
        ...data,
        id: doc.id,
      }
    })

    console.log(`✅ Successfully fetched ${topics.length} topics from Firebase`)
    return topics
  } catch (error) {
    console.error("❌ Error fetching topics from Firebase:", error)
    throw new Error(`Failed to fetch topics: ${error.message}`)
  }
}

// Get topic by slug
export async function firebaseGetTopicBySlug(slug: string): Promise<Topic | null> {
  try {
    console.log(`🔥 Fetching topic with slug "${slug}" from Firebase...`)
    const topicsCollection = collection(db, "topics")
    const q = query(topicsCollection, where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`⚠️ No topic found with slug "${slug}"`)
      return null
    }

    const doc = querySnapshot.docs[0]
    const topic = { ...doc.data(), id: doc.id } as Topic

    console.log(`✅ Successfully fetched topic "${topic.title}"`)
    return topic
  } catch (error) {
    console.error(`❌ Error fetching topic with slug "${slug}":`, error)
    throw new Error(`Failed to fetch topic: ${error.message}`)
  }
}

// Get all quizzes
export async function firebaseGetQuizzes(): Promise<Quiz[]> {
  try {
    console.log("🔥 Fetching quizzes from Firebase...")
    const quizzesCollection = collection(db, "quizzes")
    const quizzesSnapshot = await getDocs(quizzesCollection)

    if (quizzesSnapshot.empty) {
      console.log("⚠️ No quizzes found in Firebase")
      return []
    }

    const quizzes = quizzesSnapshot.docs.map((doc) => {
      const data = doc.data() as Quiz
      return {
        ...data,
        id: doc.id,
      }
    })

    console.log(`✅ Successfully fetched ${quizzes.length} quizzes from Firebase`)
    return quizzes
  } catch (error) {
    console.error("❌ Error fetching quizzes from Firebase:", error)
    throw new Error(`Failed to fetch quizzes: ${error.message}`)
  }
}

// Get quiz by slug
export async function firebaseGetQuizBySlug(slug: string): Promise<Quiz | null> {
  try {
    console.log(`🔥 Fetching quiz with slug "${slug}" from Firebase...`)
    const quizzesCollection = collection(db, "quizzes")
    const q = query(quizzesCollection, where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`⚠️ No quiz found with slug "${slug}"`)
      return null
    }

    const doc = querySnapshot.docs[0]
    const quiz = { ...doc.data(), id: doc.id } as Quiz

    console.log(`✅ Successfully fetched quiz "${quiz.title}"`)
    return quiz
  } catch (error) {
    console.error(`❌ Error fetching quiz with slug "${slug}":`, error)
    throw new Error(`Failed to fetch quiz: ${error.message}`)
  }
}

// Get questions by quiz slug
export async function firebaseGetQuestionsByQuizSlug(quizSlug: string): Promise<Question[]> {
  try {
    console.log(`🔥 Fetching questions for quiz "${quizSlug}" from Firebase...`)
    const questionsCollection = collection(db, "questions")
    const q = query(questionsCollection, where("quiz_slug", "==", quizSlug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`⚠️ No questions found for quiz "${quizSlug}"`)
      return []
    }

    const questions = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Question
      return {
        ...data,
        id: doc.id,
      }
    })

    console.log(`✅ Successfully fetched ${questions.length} questions for quiz "${quizSlug}"`)
    return questions
  } catch (error) {
    console.error(`❌ Error fetching questions for quiz "${quizSlug}":`, error)
    throw new Error(`Failed to fetch questions: ${error.message}`)
  }
}

// Get all projects
export async function firebaseGetProjects(): Promise<Project[]> {
  try {
    console.log("🔥 Fetching projects from Firebase...")
    const projectsCollection = collection(db, "projects")
    const projectsSnapshot = await getDocs(projectsCollection)

    if (projectsSnapshot.empty) {
      console.log("⚠️ No projects found in Firebase")
      return []
    }

    const projects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data() as Project
      return {
        ...data,
        id: doc.id,
      }
    })

    console.log(`✅ Successfully fetched ${projects.length} projects from Firebase`)
    return projects
  } catch (error) {
    console.error("❌ Error fetching projects from Firebase:", error)
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }
}

// Get project by slug
export async function firebaseGetProjectBySlug(slug: string): Promise<Project | null> {
  try {
    console.log(`🔥 Fetching project with slug "${slug}" from Firebase...`)
    const projectsCollection = collection(db, "projects")
    const q = query(projectsCollection, where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`⚠️ No project found with slug "${slug}"`)
      return null
    }

    const doc = querySnapshot.docs[0]
    const project = { ...doc.data(), id: doc.id } as Project

    console.log(`✅ Successfully fetched project "${project.name}"`)
    return project
  } catch (error) {
    console.error(`❌ Error fetching project with slug "${slug}":`, error)
    throw new Error(`Failed to fetch project: ${error.message}`)
  }
}

// CRUD Operations for Quizzes
export async function firebaseCreateQuiz(quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">): Promise<Quiz> {
  try {
    const docRef = doc(collection(db, "quizzes"))
    const now = new Date().toISOString()

    const quiz: Quiz = {
      id: docRef.id,
      ...quizData,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(docRef, quiz)
    console.log("✅ Quiz created successfully:", quiz.id)
    return quiz
  } catch (error) {
    console.error("❌ Error creating quiz:", error)
    throw new Error(`Failed to create quiz: ${error.message}`)
  }
}

export async function firebaseUpdateQuiz(id: string, updates: Partial<Quiz>): Promise<void> {
  try {
    const docRef = doc(db, "quizzes", id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    console.log("✅ Quiz updated successfully:", id)
  } catch (error) {
    console.error("❌ Error updating quiz:", error)
    throw new Error(`Failed to update quiz: ${error.message}`)
  }
}

export async function firebaseDeleteQuiz(id: string): Promise<void> {
  try {
    const docRef = doc(db, "quizzes", id)
    await deleteDoc(docRef)
    console.log("✅ Quiz deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting quiz:", error)
    throw new Error(`Failed to delete quiz: ${error.message}`)
  }
}

// CRUD Operations for Topics
export async function firebaseCreateTopic(topicData: Omit<Topic, "id" | "createdAt" | "updatedAt">): Promise<Topic> {
  try {
    const docRef = doc(collection(db, "topics"))
    const now = new Date().toISOString()

    const topic: Topic = {
      id: docRef.id,
      ...topicData,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(docRef, topic)
    console.log("✅ Topic created successfully:", topic.id)
    return topic
  } catch (error) {
    console.error("❌ Error creating topic:", error)
    throw new Error(`Failed to create topic: ${error.message}`)
  }
}

export async function firebaseUpdateTopic(id: string, updates: Partial<Topic>): Promise<void> {
  try {
    const docRef = doc(db, "topics", id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    console.log("✅ Topic updated successfully:", id)
  } catch (error) {
    console.error("❌ Error updating topic:", error)
    throw new Error(`Failed to update topic: ${error.message}`)
  }
}

export async function firebaseDeleteTopic(id: string): Promise<void> {
  try {
    const docRef = doc(db, "topics", id)
    await deleteDoc(docRef)
    console.log("✅ Topic deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting topic:", error)
    throw new Error(`Failed to delete topic: ${error.message}`)
  }
}

// CRUD Operations for Projects
export async function firebaseCreateProject(
  projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
  try {
    const docRef = doc(collection(db, "projects"))
    const now = new Date().toISOString()

    const project: Project = {
      id: docRef.id,
      ...projectData,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(docRef, project)
    console.log("✅ Project created successfully:", project.id)
    return project
  } catch (error) {
    console.error("❌ Error creating project:", error)
    throw new Error(`Failed to create project: ${error.message}`)
  }
}

export async function firebaseUpdateProject(id: string, updates: Partial<Project>): Promise<void> {
  try {
    const docRef = doc(db, "projects", id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    console.log("✅ Project updated successfully:", id)
  } catch (error) {
    console.error("❌ Error updating project:", error)
    throw new Error(`Failed to update project: ${error.message}`)
  }
}

export async function firebaseDeleteProject(id: string): Promise<void> {
  try {
    const docRef = doc(db, "projects", id)
    await deleteDoc(docRef)
    console.log("✅ Project deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting project:", error)
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}

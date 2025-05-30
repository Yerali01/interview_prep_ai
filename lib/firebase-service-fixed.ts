import { setDoc, updateDoc, deleteDoc } from "firebase/firestore"

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
    throw new Error(`Failed to create quiz: ${error}`)
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
    throw new Error(`Failed to update quiz: ${error}`)
  }
}

export async function firebaseDeleteQuiz(id: string): Promise<void> {
  try {
    const docRef = doc(db, "quizzes", id)
    await deleteDoc(docRef)
    console.log("✅ Quiz deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting quiz:", error)
    throw new Error(`Failed to delete quiz: ${error}`)
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
    throw new Error(`Failed to create topic: ${error}`)
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
    throw new Error(`Failed to update topic: ${error}`)
  }
}

export async function firebaseDeleteTopic(id: string): Promise<void> {
  try {
    const docRef = doc(db, "topics", id)
    await deleteDoc(docRef)
    console.log("✅ Topic deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting topic:", error)
    throw new Error(`Failed to delete topic: ${error}`)
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
    throw new Error(`Failed to create project: ${error}`)
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
    throw new Error(`Failed to update project: ${error}`)
  }
}

export async function firebaseDeleteProject(id: string): Promise<void> {
  try {
    const docRef = doc(db, "projects", id)
    await deleteDoc(docRef)
    console.log("✅ Project deleted successfully:", id)
  } catch (error) {
    console.error("❌ Error deleting project:", error)
    throw new Error(`Failed to delete project: ${error}`)
  }
}

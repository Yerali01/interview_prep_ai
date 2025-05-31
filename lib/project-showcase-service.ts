import { db } from "./firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore"

export interface UserProject {
  id: string
  userId: string
  userName: string
  userPhotoUrl: string | null
  projectId: string
  projectSlug: string
  projectName: string
  githubUrl: string
  demoUrl: string | null
  description: string | null
  isPublic: boolean
  createdAt: Date | null
}

export interface UserProjectInput {
  userId: string
  userName: string
  userPhotoUrl: string | null
  projectId: string
  projectSlug: string
  projectName: string
  githubUrl: string
  demoUrl: string | null
  description: string | null
  isPublic: boolean
  createdAt: Date
}

const USER_PROJECTS_COLLECTION = "user_projects"

// Add a new user project
export async function addUserProject(project: UserProjectInput): Promise<string> {
  try {
    // Check if user already has this project
    const existingQuery = query(
      collection(db, USER_PROJECTS_COLLECTION),
      where("userId", "==", project.userId),
      where("projectSlug", "==", project.projectSlug),
    )

    const existingDocs = await getDocs(existingQuery)

    if (!existingDocs.empty) {
      throw new Error("You have already added this project to your profile")
    }

    const docRef = await addDoc(collection(db, USER_PROJECTS_COLLECTION), {
      ...project,
      createdAt: project.createdAt.toISOString(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding user project:", error)
    throw error
  }
}

// Get all public projects for a specific project slug
export async function getUserProjectsByProjectSlug(projectSlug: string): Promise<UserProject[]> {
  try {
    const q = query(
      collection(db, USER_PROJECTS_COLLECTION),
      where("projectSlug", "==", projectSlug),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userPhotoUrl: data.userPhotoUrl,
        projectId: data.projectId,
        projectSlug: data.projectSlug,
        projectName: data.projectName,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        description: data.description,
        isPublic: data.isPublic,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
      }
    })
  } catch (error) {
    console.error("Error getting user projects by project slug:", error)
    throw error
  }
}

// Get all projects for a specific user
export async function getUserProjectsByUserId(userId: string, includePrivate = false): Promise<UserProject[]> {
  try {
    let q

    if (includePrivate) {
      // Get all projects (public and private) if viewing own profile
      q = query(collection(db, USER_PROJECTS_COLLECTION), where("userId", "==", userId), orderBy("createdAt", "desc"))
    } else {
      // Get only public projects if viewing someone else's profile
      q = query(
        collection(db, USER_PROJECTS_COLLECTION),
        where("userId", "==", userId),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
      )
    }

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userPhotoUrl: data.userPhotoUrl,
        projectId: data.projectId,
        projectSlug: data.projectSlug,
        projectName: data.projectName,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        description: data.description,
        isPublic: data.isPublic,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
      }
    })
  } catch (error) {
    console.error("Error getting user projects by user ID:", error)
    throw error
  }
}

// Update a user project
export async function updateUserProject(projectId: string, updates: Partial<UserProject>): Promise<void> {
  try {
    const projectRef = doc(db, USER_PROJECTS_COLLECTION, projectId)

    // Ensure the project exists
    const projectDoc = await getDoc(projectRef)
    if (!projectDoc.exists()) {
      throw new Error("Project not found")
    }

    await updateDoc(projectRef, updates)
  } catch (error) {
    console.error("Error updating user project:", error)
    throw error
  }
}

// Delete a user project
export async function deleteUserProject(projectId: string): Promise<void> {
  try {
    const projectRef = doc(db, USER_PROJECTS_COLLECTION, projectId)

    // Ensure the project exists
    const projectDoc = await getDoc(projectRef)
    if (!projectDoc.exists()) {
      throw new Error("Project not found")
    }

    await deleteDoc(projectRef)
  } catch (error) {
    console.error("Error deleting user project:", error)
    throw error
  }
}

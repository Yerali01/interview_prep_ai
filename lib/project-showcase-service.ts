import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "./firebase"

export interface UserProject {
  id?: string
  userId: string
  userName?: string
  userAvatar?: string
  projectId: string
  projectSlug: string
  projectName: string
  projectTitle?: string
  githubUrl: string
  demoUrl?: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt?: string
}

// Service class for project showcase operations
export class ProjectShowcaseService {
  static async addUserProject(projectData: Omit<UserProject, "id" | "createdAt" | "updatedAt">) {
    try {
      const userProjectsRef = collection(db, "user_projects")

      const docData = {
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(userProjectsRef, docData)

      console.log("✅ User project added successfully:", docRef.id)
      return { data: { id: docRef.id, ...docData }, error: null }
    } catch (error: any) {
      console.error("❌ Error adding user project:", error)
      return { data: null, error: { message: error.message, code: error.code } }
    }
  }

  static async getUserProjects(userId: string): Promise<UserProject[]> {
    try {
      const userProjectsRef = collection(db, "user_projects")
      const q = query(userProjectsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)
      const projects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserProject[]

      console.log(`✅ Successfully fetched ${projects.length} user projects`)
      return projects
    } catch (error: any) {
      console.error("❌ Error fetching user projects:", error)
      throw new Error(`Failed to fetch user projects: ${error.message}`)
    }
  }

  static async getProjectShowcases(projectSlug: string): Promise<UserProject[]> {
    try {
      console.log(`🔍 Fetching showcases for project: ${projectSlug}`)

      // Modified query to avoid composite index requirement
      // First get all public projects
      const userProjectsRef = collection(db, "user_projects")
      const q = query(userProjectsRef, where("isPublic", "==", true))

      const querySnapshot = await getDocs(q)

      // Then filter by projectSlug in memory and sort manually
      const showcases = querySnapshot.docs
        .map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as UserProject,
        )
        .filter((project) => project.projectSlug === projectSlug)
        .sort((a, b) => {
          // Sort by createdAt in descending order
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })

      console.log(`✅ Successfully fetched ${showcases.length} project showcases`)
      return showcases
    } catch (error: any) {
      console.error("❌ Error fetching project showcases:", error)
      throw new Error(`Failed to fetch project showcases: ${error.message}`)
    }
  }

  static async updateProjectVisibility(projectId: string, isPublic: boolean) {
    try {
      const projectRef = doc(db, "user_projects", projectId)

      const updateData = {
        isPublic,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(projectRef, updateData)

      console.log("✅ Project visibility updated successfully:", projectId)
      return { error: null }
    } catch (error: any) {
      console.error("❌ Error updating project visibility:", error)
      return { error: { message: error.message, code: error.code } }
    }
  }

  static async updateUserProject(projectId: string, updates: Partial<UserProject>) {
    try {
      const projectRef = doc(db, "user_projects", projectId)

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(projectRef, updateData)

      console.log("✅ User project updated successfully:", projectId)
      return { error: null }
    } catch (error: any) {
      console.error("❌ Error updating user project:", error)
      return { error: { message: error.message, code: error.code } }
    }
  }

  static async deleteUserProject(projectId: string) {
    try {
      const projectRef = doc(db, "user_projects", projectId)
      await deleteDoc(projectRef)

      console.log("✅ User project deleted successfully:", projectId)
      return { error: null }
    } catch (error: any) {
      console.error("❌ Error deleting user project:", error)
      return { error: { message: error.message, code: error.code } }
    }
  }
}

// Also export individual functions for backward compatibility
export const addUserProject = ProjectShowcaseService.addUserProject
export const getUserProjects = ProjectShowcaseService.getUserProjects
export const getProjectShowcases = ProjectShowcaseService.getProjectShowcases
export const updateUserProject = ProjectShowcaseService.updateUserProject
export const deleteUserProject = ProjectShowcaseService.deleteUserProject

import { db, auth } from "./firebase"
import { doc, getDoc, setDoc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore"

export interface UserProject {
  id: string
  userId: string
  projectId: string
  projectSlug: string
  projectName: string
  githubUrl: string
  demoUrl?: string
  description?: string
  completedAt: string
  isPublic: boolean
}

export interface ProjectShowcase {
  project: UserProject
  user: {
    id: string
    display_name?: string
    github_username?: string
    github_avatar?: string
  }
}

/**
 * Service for managing user project showcases
 */
export class ProjectShowcaseService {
  private static async ensureAuthenticated(): Promise<string> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("User must be authenticated to manage projects")
    }
    return currentUser.uid
  }

  /**
   * Add a completed project to user's profile
   */
  static async addUserProject(projectData: Omit<UserProject, "id" | "userId" | "completedAt">): Promise<void> {
    try {
      const userId = await this.ensureAuthenticated()

      const userProjectRef = doc(collection(db, "user_projects"))
      const userProject: UserProject = {
        id: userProjectRef.id,
        userId,
        ...projectData,
        completedAt: new Date().toISOString(),
      }

      await setDoc(userProjectRef, userProject)
      console.log("✅ User project added successfully:", userProject.id)
    } catch (error: any) {
      console.error("❌ Error adding user project:", error)
      throw new Error(`Failed to add project: ${error.message}`)
    }
  }

  /**
   * Get user's completed projects
   */
  static async getUserProjects(userId?: string): Promise<UserProject[]> {
    try {
      const targetUserId = userId || (await this.ensureAuthenticated())

      const userProjectsRef = collection(db, "user_projects")
      const q = query(userProjectsRef, where("userId", "==", targetUserId))
      const querySnapshot = await getDocs(q)

      const userProjects = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as UserProject[]

      console.log(`✅ Found ${userProjects.length} user projects`)
      return userProjects
    } catch (error: any) {
      console.error("❌ Error fetching user projects:", error)
      throw new Error(`Failed to fetch user projects: ${error.message}`)
    }
  }

  /**
   * Get all users who completed a specific project
   */
  static async getProjectShowcases(projectSlug: string): Promise<ProjectShowcase[]> {
    try {
      const userProjectsRef = collection(db, "user_projects")
      const q = query(userProjectsRef, where("projectSlug", "==", projectSlug), where("isPublic", "==", true))
      const querySnapshot = await getDocs(q)

      const showcases: ProjectShowcase[] = []

      for (const docSnap of querySnapshot.docs) {
        const userProject = { ...docSnap.data(), id: docSnap.id } as UserProject

        // Get user info
        try {
          const userRef = doc(db, "users", userProject.userId)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userData = userSnap.data()
            showcases.push({
              project: userProject,
              user: {
                id: userProject.userId,
                display_name: userData.display_name,
                github_username: userData.github_username,
                github_avatar: userData.github_avatar,
              },
            })
          }
        } catch (error) {
          console.error("Error fetching user data for showcase:", error)
          // Still include the project even if user data fails
          showcases.push({
            project: userProject,
            user: {
              id: userProject.userId,
            },
          })
        }
      }

      console.log(`✅ Found ${showcases.length} project showcases for ${projectSlug}`)
      return showcases
    } catch (error: any) {
      console.error("❌ Error fetching project showcases:", error)
      throw new Error(`Failed to fetch project showcases: ${error.message}`)
    }
  }

  /**
   * Remove a project from user's profile
   */
  static async removeUserProject(projectId: string): Promise<void> {
    try {
      const userId = await this.ensureAuthenticated()

      // Verify the project belongs to the current user
      const projectRef = doc(db, "user_projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Project not found")
      }

      const projectData = projectSnap.data() as UserProject
      if (projectData.userId !== userId) {
        throw new Error("You can only remove your own projects")
      }

      await deleteDoc(projectRef)
      console.log("✅ User project removed successfully:", projectId)
    } catch (error: any) {
      console.error("❌ Error removing user project:", error)
      throw new Error(`Failed to remove project: ${error.message}`)
    }
  }

  /**
   * Update a user project
   */
  static async updateUserProject(projectId: string, updates: Partial<UserProject>): Promise<void> {
    try {
      const userId = await this.ensureAuthenticated()

      // Verify the project belongs to the current user
      const projectRef = doc(db, "user_projects", projectId)
      const projectSnap = await getDoc(projectRef)

      if (!projectSnap.exists()) {
        throw new Error("Project not found")
      }

      const projectData = projectSnap.data() as UserProject
      if (projectData.userId !== userId) {
        throw new Error("You can only update your own projects")
      }

      await setDoc(projectRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true })
      console.log("✅ User project updated successfully:", projectId)
    } catch (error: any) {
      console.error("❌ Error updating user project:", error)
      throw new Error(`Failed to update project: ${error.message}`)
    }
  }
}

// Export functions for easier use
export const addUserProject = ProjectShowcaseService.addUserProject.bind(ProjectShowcaseService)
export const getUserProjects = ProjectShowcaseService.getUserProjects.bind(ProjectShowcaseService)
export const getProjectShowcases = ProjectShowcaseService.getProjectShowcases.bind(ProjectShowcaseService)
export const removeUserProject = ProjectShowcaseService.removeUserProject.bind(ProjectShowcaseService)
export const updateUserProject = ProjectShowcaseService.updateUserProject.bind(ProjectShowcaseService)

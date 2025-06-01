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
  githubUrl: string
  demoUrl?: string
  description?: string
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

export async function addUserProject(projectData: Omit<UserProject, "id" | "createdAt" | "updatedAt">) {
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

export async function getUserProjects(userId: string) {
  try {
    const userProjectsRef = collection(db, "user_projects")
    const q = query(userProjectsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProject[]

    console.log(`✅ Successfully fetched ${projects.length} user projects`)
    return { data: projects, error: null }
  } catch (error: any) {
    console.error("❌ Error fetching user projects:", error)
    return { data: null, error: { message: error.message, code: error.code } }
  }
}

export async function getProjectShowcases(projectSlug: string) {
  try {
    const userProjectsRef = collection(db, "user_projects")
    const q = query(
      userProjectsRef,
      where("projectSlug", "==", projectSlug),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const showcases = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProject[]

    console.log(`✅ Successfully fetched ${showcases.length} project showcases`)
    return { data: showcases, error: null }
  } catch (error: any) {
    console.error("❌ Error fetching project showcases:", error)
    return { data: null, error: { message: error.message, code: error.code } }
  }
}

export async function updateUserProject(projectId: string, updates: Partial<UserProject>) {
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

export async function deleteUserProject(projectId: string) {
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

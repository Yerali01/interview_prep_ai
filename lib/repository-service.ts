import { db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { GitHubRepository } from "./github-api"

/**
 * Save user's selected repositories to Firestore
 */
export async function saveUserRepositories(userId: string, repositories: GitHubRepository[]): Promise<void> {
  if (!userId) {
    console.error("❌ saveUserRepositories: User ID is required")
    throw new Error("User ID is required")
  }

  try {
    console.log(`🔥 Saving ${repositories.length} repositories for user ${userId}`)

    // Validate repositories array
    if (!Array.isArray(repositories)) {
      console.error("❌ saveUserRepositories: repositories is not an array", repositories)
      throw new Error("Invalid repositories data")
    }

    // Prepare repository data for Firestore
    const repoData = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name || "Unknown Repository",
      full_name: repo.full_name || repo.name || "Unknown Repository",
      description: repo.description || null,
      html_url: repo.html_url || `https://github.com`,
      homepage: repo.homepage || null,
      language: repo.language || null,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      updated_at: repo.updated_at || new Date().toISOString(),
      created_at: repo.created_at || new Date().toISOString(),
    }))

    // Save to user's repositories collection
    const userReposRef = doc(db, "user_repositories", userId)

    await setDoc(userReposRef, {
      userId,
      repositories: repoData,
      updated_at: new Date().toISOString(),
    })

    console.log("✅ Repositories saved successfully")
  } catch (error) {
    console.error("❌ Error saving repositories:", error)
    throw new Error("Failed to save repositories. Please try again.")
  }
}

/**
 * Get user's saved repositories from Firestore
 */
export async function getUserRepositories(userId: string): Promise<GitHubRepository[]> {
  if (!userId) {
    console.error("❌ getUserRepositories: User ID is required")
    throw new Error("User ID is required")
  }

  try {
    console.log(`🔥 Getting repositories for user ${userId}`)

    const userReposRef = doc(db, "user_repositories", userId)
    const docSnap = await getDoc(userReposRef)

    if (!docSnap.exists()) {
      console.log("⚠️ No repositories found for user")
      return []
    }

    const data = docSnap.data()

    if (!data || !data.repositories || !Array.isArray(data.repositories)) {
      console.log("⚠️ Invalid repository data structure:", data)
      return []
    }

    const repositories = data.repositories || []

    console.log(`✅ Found ${repositories.length} repositories`)
    return repositories
  } catch (error) {
    console.error("❌ Error getting repositories:", error)
    throw new Error("Failed to get repositories. Please try again.")
  }
}

/**
 * Initialize repository structure for a new user
 */
export async function initializeUserRepositories(userId: string): Promise<void> {
  if (!userId) {
    console.error("❌ initializeUserRepositories: User ID is required")
    throw new Error("User ID is required")
  }

  try {
    console.log(`🔥 Initializing repository structure for user ${userId}`)

    const userReposRef = doc(db, "user_repositories", userId)
    const docSnap = await getDoc(userReposRef)

    if (!docSnap.exists()) {
      await setDoc(userReposRef, {
        userId,
        repositories: [],
        updated_at: new Date().toISOString(),
      })
      console.log("✅ Repository structure initialized")
    } else {
      console.log("ℹ️ Repository structure already exists")
    }
  } catch (error) {
    console.error("❌ Error initializing repository structure:", error)
    throw new Error("Failed to initialize repository structure")
  }
}

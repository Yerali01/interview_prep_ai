import { db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { GitHubRepository } from "./github-api"

/**
 * Save user's selected repositories to Firestore
 */
export async function saveUserRepositories(userId: string, repositories: GitHubRepository[]): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    console.log(`🔥 Saving ${repositories.length} repositories for user ${userId}`)

    // Save to user's repositories collection
    const userReposRef = doc(db, "user_repositories", userId)

    await setDoc(userReposRef, {
      userId,
      repositories: repositories.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        created_at: repo.created_at,
      })),
      updated_at: new Date().toISOString(),
    })

    console.log("✅ Repositories saved successfully")
  } catch (error) {
    console.error("❌ Error saving repositories:", error)
    throw new Error("Failed to save repositories")
  }
}

/**
 * Get user's saved repositories from Firestore
 */
export async function getUserRepositories(userId: string): Promise<GitHubRepository[]> {
  if (!userId) {
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
    const repositories = data.repositories || []

    console.log(`✅ Found ${repositories.length} repositories`)
    return repositories
  } catch (error) {
    console.error("❌ Error getting repositories:", error)
    throw new Error("Failed to get repositories")
  }
}

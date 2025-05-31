import { db, auth } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { GitHubRepository } from "./github-api"

/**
 * Enhanced repository service with comprehensive error handling
 */
export class RepositoryService {
  private static async ensureAuthenticated(): Promise<string> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("User must be authenticated to access repositories")
    }
    return currentUser.uid
  }

  private static async ensureUserRepositoryDocument(userId: string): Promise<void> {
    try {
      const userReposRef = doc(db, "user_repositories", userId)
      const docSnap = await getDoc(userReposRef)

      if (!docSnap.exists()) {
        console.log("🔧 Creating user repository document for:", userId)
        await setDoc(userReposRef, {
          userId,
          repositories: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        console.log("✅ User repository document created")
      }
    } catch (error: any) {
      console.error("❌ Failed to ensure user repository document:", error)
      throw new Error(`Failed to initialize user data: ${error.message}`)
    }
  }

  /**
   * Save repositories with comprehensive error handling
   */
  static async saveUserRepositories(repositories: GitHubRepository[]): Promise<void> {
    console.log("🔥 Starting repository save process...")

    try {
      // Step 1: Ensure user is authenticated
      const userId = await this.ensureAuthenticated()
      console.log("✅ User authenticated:", userId)

      // Step 2: Validate and prepare repository data
      if (!Array.isArray(repositories)) {
        throw new Error("Repositories must be an array")
      }

      const repoData = repositories.map((repo, index) => {
        if (!repo || typeof repo !== "object") {
          throw new Error(`Invalid repository data at index ${index}`)
        }

        return {
          id: repo.id || 0,
          name: repo.name || "Unknown Repository",
          full_name: repo.full_name || repo.name || "Unknown Repository",
          description: repo.description || null,
          html_url: repo.html_url || `https://github.com`,
          homepage: repo.homepage || null,
          language: repo.language || null,
          stargazers_count: Number(repo.stargazers_count) || 0,
          forks_count: Number(repo.forks_count) || 0,
          topics: Array.isArray(repo.topics) ? repo.topics : [],
          updated_at: repo.updated_at || new Date().toISOString(),
          created_at: repo.created_at || new Date().toISOString(),
        }
      })

      console.log(`📝 Prepared ${repoData.length} repositories for save`)

      // Step 3: Save to Firestore
      const userReposRef = doc(db, "user_repositories", userId)
      const saveData = {
        userId,
        repositories: repoData,
        updated_at: new Date().toISOString(),
        last_save_count: repoData.length,
      }

      await setDoc(userReposRef, saveData, { merge: true })
      console.log("✅ Repositories saved successfully to Firestore")
    } catch (error: any) {
      console.error("❌ Repository save failed:", error)
      throw new Error(`Failed to save repositories: ${error.message}`)
    }
  }

  /**
   * Get repositories with comprehensive error handling
   */
  static async getUserRepositories(): Promise<GitHubRepository[]> {
    console.log("🔥 Starting repository fetch process...")

    try {
      // Step 1: Ensure user is authenticated
      const userId = await this.ensureAuthenticated()
      console.log("✅ User authenticated:", userId)

      // Step 2: Fetch repositories
      const userReposRef = doc(db, "user_repositories", userId)
      const docSnap = await getDoc(userReposRef)

      if (!docSnap.exists()) {
        console.log("ℹ️ No repository document found, returning empty array")
        return []
      }

      const data = docSnap.data()
      if (!data || !Array.isArray(data.repositories)) {
        console.log("ℹ️ No repositories found in document, returning empty array")
        return []
      }

      console.log(`✅ Found ${data.repositories.length} repositories`)
      return data.repositories
    } catch (error: any) {
      console.error("❌ Repository fetch failed:", error)
      throw new Error(`Failed to load repositories: ${error.message}`)
    }
  }

  /**
   * Test repository operations
   */
  static async testRepositoryOperations(): Promise<any> {
    console.log("🧪 Testing repository operations...")

    const results = {
      authentication: false,
      firebaseConnection: false,
      documentCreation: false,
      saveOperation: false,
      loadOperation: false,
      error: null as string | null,
      details: {} as any,
    }

    try {
      // Test authentication
      const userId = await this.ensureAuthenticated()
      results.authentication = true
      results.details.userId = userId

      // Test document creation
      await this.ensureUserRepositoryDocument(userId)
      results.documentCreation = true
      results.firebaseConnection = true

      // Test save operation
      const testRepo: GitHubRepository = {
        id: 999999,
        name: "test-repo",
        full_name: "test-user/test-repo",
        description: "Test repository",
        html_url: "https://github.com/test-user/test-repo",
        homepage: null,
        language: "TypeScript",
        stargazers_count: 0,
        forks_count: 0,
        topics: ["test"],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        fork: false,
        archived: false,
        disabled: false,
        private: false,
        owner: {
          login: "test-user",
          avatar_url: "https://github.com/test-user.png",
        },
      }

      await this.saveUserRepositories([testRepo])
      results.saveOperation = true

      // Test load operation
      const loadedRepos = await this.getUserRepositories()
      results.loadOperation = loadedRepos.length > 0
      results.details.loadedCount = loadedRepos.length

      console.log("✅ All repository operations tested successfully")
    } catch (error: any) {
      results.error = error.message
      console.error("❌ Repository operation test failed:", error)
    }

    return results
  }
}

// Export the functions for backward compatibility
export const saveUserRepositories = RepositoryService.saveUserRepositories.bind(RepositoryService)
export const getUserRepositories = RepositoryService.getUserRepositories.bind(RepositoryService)
export const testRepositoryOperations = RepositoryService.testRepositoryOperations.bind(RepositoryService)

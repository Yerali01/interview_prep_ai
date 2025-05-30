// GitHub API service for fetching user repositories
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  default_branch: string
  topics: string[]
  visibility: "public" | "private"
  archived: boolean
  disabled: boolean
  fork: boolean
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
  ) {
    super(message)
    this.name = "GitHubAPIError"
  }
}

export class GitHubAPI {
  private baseUrl = "https://api.github.com"

  constructor(private accessToken?: string) {}

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Flutter-Interview-App",
    }

    if (this.accessToken) {
      headers.Authorization = `token ${this.accessToken}`
    }

    try {
      console.log(`🔄 GitHub API Request: ${endpoint}`)
      const response = await fetch(url, { headers })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ GitHub API Error: ${response.status}`, errorData)
        throw new GitHubAPIError(
          errorData.message || `GitHub API error: ${response.status}`,
          response.status,
          errorData,
        )
      }

      const data = await response.json()
      console.log(`✅ GitHub API Success: ${endpoint}`)
      return data
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error
      }
      console.error(`❌ GitHub API Network Error:`, error)
      throw new GitHubAPIError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getUser(username?: string): Promise<GitHubUser> {
    const endpoint = username ? `/users/${username}` : "/user"
    return this.makeRequest<GitHubUser>(endpoint)
  }

  async getUserRepositories(
    username?: string,
    options: {
      type?: "all" | "owner" | "member"
      sort?: "created" | "updated" | "pushed" | "full_name"
      direction?: "asc" | "desc"
      per_page?: number
      page?: number
    } = {},
  ): Promise<GitHubRepository[]> {
    const { type = "owner", sort = "updated", direction = "desc", per_page = 100, page = 1 } = options

    const params = new URLSearchParams({
      type,
      sort,
      direction,
      per_page: per_page.toString(),
      page: page.toString(),
    })

    const endpoint = username ? `/users/${username}/repos?${params}` : `/user/repos?${params}`

    try {
      return this.makeRequest<GitHubRepository[]>(endpoint)
    } catch (error) {
      console.error(`❌ Failed to fetch repositories for ${username || "current user"}:`, error)
      return [] // Return empty array instead of throwing to prevent app crashes
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`)
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    return this.makeRequest<Record<string, number>>(`/repos/${owner}/${repo}/languages`)
  }

  async getRepositoryTopics(owner: string, repo: string): Promise<{ names: string[] }> {
    const headers = {
      Accept: "application/vnd.github.mercy-preview+json",
    }
    return this.makeRequest<{ names: string[] }>(`/repos/${owner}/${repo}/topics`)
  }
}

// Helper functions
export function formatRepositorySize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return `${sizeInKB} KB`
  } else if (sizeInKB < 1024 * 1024) {
    return `${(sizeInKB / 1024).toFixed(1)} MB`
  } else {
    return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`
  }
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Shell: "#89e051",
    Vue: "#2c3e50",
    React: "#61dafb",
    Angular: "#dd0031",
    Flutter: "#02569B",
  }
  return colors[language] || "#586069"
}

export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} month${months > 1 ? "s" : ""} ago`
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return `${years} year${years > 1 ? "s" : ""} ago`
    }
  } catch (error) {
    console.error("❌ Error formatting date:", error)
    return "unknown time"
  }
}

// Add this function to get the correct GitHub profile URL
export async function getGitHubProfileUrl(username: string): Promise<string> {
  try {
    // Verify the username exists by making a simple API call
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (response.ok) {
      const userData = await response.json()
      return userData.html_url // This gives us the correct GitHub profile URL
    }
    // Fallback to constructed URL
    return `https://github.com/${username}`
  } catch (error) {
    console.error("Error verifying GitHub username:", error)
    return `https://github.com/${username}`
  }
}

// Add function to share repositories
export function shareRepositories(repositories: any[], username: string) {
  try {
    const repoList = repositories.map((repo) => `• ${repo.name}: ${repo.html_url}`).join("\n")
    const shareText = `Check out my GitHub repositories!\n\n${repoList}\n\nView all my projects: https://github.com/${username}`

    if (navigator.share) {
      navigator
        .share({
          title: "My GitHub Repositories",
          text: shareText,
        })
        .catch((error) => {
          console.error("❌ Share API error:", error)
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText)
        })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
    }
  } catch (error) {
    console.error("❌ Error sharing repositories:", error)
    throw new Error("Failed to share repositories")
  }
}

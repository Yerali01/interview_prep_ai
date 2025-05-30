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
  const repoList = repositories.map((repo) => `• ${repo.name}: ${repo.html_url}`).join("\n")
  const shareText = `Check out my GitHub repositories!\n\n${repoList}\n\nView all my projects: https://github.com/${username}`

  if (navigator.share) {
    navigator.share({
      title: "My GitHub Repositories",
      text: shareText,
    })
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      // You can show a toast here
      console.log("Repository list copied to clipboard!")
    })
  }
}

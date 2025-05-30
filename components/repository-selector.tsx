"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, GitFork, ExternalLink, RefreshCw, Share, AlertCircle, TestTube } from "lucide-react"
import { GitHubAPI, type GitHubRepository, getLanguageColor, timeAgo, shareRepositories } from "@/lib/github-api"
import { saveUserRepositories, getUserRepositories, testRepositoryOperations } from "@/lib/repository-service-v2"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RepositorySelectorProps {
  userId: string
  githubUsername?: string
}

export function RepositorySelector({ userId, githubUsername }: RepositorySelectorProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (userId && githubUsername) {
      loadRepositories()
      loadSavedRepositories()
    }
  }, [userId, githubUsername])

  const loadRepositories = async () => {
    if (!githubUsername) {
      setError("GitHub account not connected")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("🔄 Fetching repositories for GitHub user:", githubUsername)
      const github = new GitHubAPI()
      const repos = await github.getUserRepositories(githubUsername, {
        type: "owner",
        sort: "updated",
        per_page: 100,
      })

      console.log(`✅ Fetched ${repos.length} repositories`)

      // Filter out forks and archived repos by default
      const filteredRepos = repos.filter((repo) => !repo.archived && !repo.disabled)
      setRepositories(filteredRepos)
    } catch (error: any) {
      console.error("❌ Error fetching repositories:", error)
      setError(error.message || "Failed to fetch repositories")
    } finally {
      setLoading(false)
    }
  }

  const loadSavedRepositories = async () => {
    try {
      console.log("🔄 Loading saved repositories...")
      const savedRepos = await getUserRepositories()
      console.log(`✅ Loaded ${savedRepos.length} saved repositories`)

      const savedRepoIds = new Set(savedRepos.map((repo: any) => repo.id))
      setSelectedRepos(savedRepoIds)
    } catch (error: any) {
      console.error("❌ Error loading saved repositories:", error)
      // Don't show error for loading saved repos, just log it
    }
  }

  const handleRepoToggle = (repoId: number) => {
    const newSelected = new Set(selectedRepos)
    if (newSelected.has(repoId)) {
      newSelected.delete(repoId)
    } else {
      newSelected.add(repoId)
    }
    setSelectedRepos(newSelected)
  }

  const handleSaveSelection = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      console.log("💾 Saving repository selection...")
      const selectedRepositories = repositories.filter((repo) => selectedRepos.has(repo.id))

      await saveUserRepositories(selectedRepositories)
      console.log(`✅ Saved ${selectedRepositories.length} repositories`)

      toast({
        title: "Repositories Updated!",
        description: `${selectedRepositories.length} repositories selected for showcase.`,
      })
    } catch (error: any) {
      console.error("❌ Error saving repositories:", error)
      setSaveError(error.message || "Failed to save repositories")
      toast({
        title: "Failed to Save",
        description: error.message || "An error occurred while saving your repository selection.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestFirebase = async () => {
    setTesting(true)
    try {
      console.log("🧪 Testing Firebase operations...")
      const testResults = await testRepositoryOperations()

      if (testResults.error) {
        toast({
          title: "Firebase Test Failed",
          description: testResults.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Firebase Test Successful",
          description: "All repository operations are working correctly.",
        })
      }

      console.log("🧪 Test results:", testResults)
    } catch (error: any) {
      toast({
        title: "Firebase Test Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleShareSelected = () => {
    if (!githubUsername) return

    const selectedRepositories = repositories.filter((repo) => selectedRepos.has(repo.id))
    if (selectedRepositories.length === 0) {
      toast({
        title: "No Repositories Selected",
        description: "Please select repositories to share.",
        variant: "destructive",
      })
      return
    }

    try {
      shareRepositories(selectedRepositories, githubUsername)
      toast({
        title: "Repositories Shared!",
        description: "Repository list has been copied to clipboard or shared.",
      })
    } catch (error: any) {
      toast({
        title: "Share Failed",
        description: error.message || "Could not share repositories. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!githubUsername) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Repository Showcase</CardTitle>
          <CardDescription>Connect your GitHub account to showcase your repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">GitHub account not connected.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Repository Showcase</CardTitle>
          <CardDescription>Select repositories to display on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadRepositories} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Repository Showcase</CardTitle>
            <CardDescription>
              Select repositories to display on your profile ({selectedRepos.size} selected)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleTestFirebase} variant="outline" size="sm" disabled={testing}>
              {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TestTube className="h-4 w-4 mr-2" />}
              Test Firebase
            </Button>
            {selectedRepos.size > 0 && (
              <Button onClick={handleShareSelected} variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Selected
              </Button>
            )}
            <Button onClick={loadRepositories} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleSaveSelection} disabled={saving || selectedRepos.size === 0}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Selection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {saveError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Save Error</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No repositories found.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedRepos.has(repo.id)
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedRepos.has(repo.id)}
                    onCheckedChange={() => handleRepoToggle(repo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{repo.name}</h4>
                      {repo.fork && (
                        <Badge variant="secondary" className="text-xs">
                          Fork
                        </Badge>
                      )}
                      {repo.archived && (
                        <Badge variant="outline" className="text-xs">
                          Archived
                        </Badge>
                      )}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {repo.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{repo.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          {repo.language}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </div>

                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks_count}
                      </div>

                      <span>Updated {timeAgo(repo.updated_at)}</span>
                    </div>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {repo.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{repo.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

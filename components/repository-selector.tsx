"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, GitFork, ExternalLink, RefreshCw } from "lucide-react"
import { GitHubAPI, type GitHubRepository, getLanguageColor, timeAgo } from "@/lib/github-api"
import { firebaseSaveUserRepositories, firebaseGetUserRepositories } from "@/lib/firebase-service"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RepositorySelectorProps {
  userId: string
  githubAccessToken?: string
  githubUsername?: string
}

export function RepositorySelector({ userId, githubAccessToken, githubUsername }: RepositorySelectorProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadRepositories()
    loadSavedRepositories()
  }, [userId, githubAccessToken])

  const loadRepositories = async () => {
    if (!githubAccessToken && !githubUsername) {
      setError("GitHub account not connected")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const github = new GitHubAPI(githubAccessToken)
      const repos = await github.getUserRepositories(githubUsername, {
        type: "owner",
        sort: "updated",
        per_page: 100,
      })

      // Filter out forks and archived repos by default, but allow user to see them
      const filteredRepos = repos.filter((repo) => !repo.archived && !repo.disabled)
      setRepositories(filteredRepos)
    } catch (error: any) {
      console.error("Error fetching repositories:", error)
      setError(error.message || "Failed to fetch repositories")
    } finally {
      setLoading(false)
    }
  }

  const loadSavedRepositories = async () => {
    try {
      const savedRepos = await firebaseGetUserRepositories(userId)
      const savedRepoIds = new Set(savedRepos.map((repo: any) => repo.id))
      setSelectedRepos(savedRepoIds)
    } catch (error) {
      console.error("Error loading saved repositories:", error)
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
    try {
      const selectedRepositories = repositories
        .filter((repo) => selectedRepos.has(repo.id))
        .map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          topics: repo.topics,
          updated_at: repo.updated_at,
          created_at: repo.created_at,
        }))

      await firebaseSaveUserRepositories(userId, selectedRepositories)

      toast({
        title: "Repositories Updated!",
        description: `${selectedRepositories.length} repositories selected for showcase.`,
      })
    } catch (error: any) {
      toast({
        title: "Failed to Save",
        description: error.message || "An error occurred while saving your repository selection.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
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

                    {repo.topics.length > 0 && (
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

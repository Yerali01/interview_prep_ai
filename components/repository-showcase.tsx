"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, GitFork, ExternalLink, Github, Share } from "lucide-react"
import { getLanguageColor, timeAgo, shareRepositories } from "@/lib/github-api"
import { firebaseGetUserRepositories } from "@/lib/firebase-service"
import { useToast } from "@/hooks/use-toast"

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
  created_at: string
}

interface RepositoryShowcaseProps {
  userId: string
  isOwnProfile?: boolean
  githubUsername?: string
}

export function RepositoryShowcase({ userId, isOwnProfile = false, githubUsername }: RepositoryShowcaseProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadRepositories()
  }, [userId])

  const loadRepositories = async () => {
    try {
      const repos = await firebaseGetUserRepositories(userId)
      setRepositories(repos)
    } catch (error) {
      console.error("Error loading repositories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShareRepositories = () => {
    if (repositories.length === 0) return

    try {
      shareRepositories(repositories, githubUsername || "")
      toast({
        title: "Repositories Shared!",
        description: "Repository list has been copied to clipboard or shared.",
      })
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share repositories. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Featured Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (repositories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Featured Repositories
          </CardTitle>
          <CardDescription>
            {isOwnProfile ? "You haven't selected any repositories to showcase yet." : "No repositories to display."}
          </CardDescription>
        </CardHeader>
        {isOwnProfile && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Go to your profile settings to select repositories to showcase.
            </p>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Featured Repositories
            </CardTitle>
            <CardDescription>
              {repositories.length} repository{repositories.length !== 1 ? "ies" : ""} showcased
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {repositories.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleShareRepositories}>
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            )}
            {githubUsername && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                  View All on GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{repo.name}</h4>
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
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{repo.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
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
                <div className="flex flex-wrap gap-1">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{repo.topics.length - 5} more
                    </Badge>
                  )}
                </div>
              )}

              {repo.homepage && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                      View Demo
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

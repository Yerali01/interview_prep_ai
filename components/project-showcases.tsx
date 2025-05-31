"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, ExternalLink, User, Calendar, Loader2 } from "lucide-react"
import { getProjectShowcases, type ProjectShowcase } from "@/lib/project-showcase-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ProjectShowcasesProps {
  projectSlug: string
  projectName: string
}

export function ProjectShowcases({ projectSlug, projectName }: ProjectShowcasesProps) {
  const [showcases, setShowcases] = useState<ProjectShowcase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadShowcases()
  }, [projectSlug])

  const loadShowcases = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProjectShowcases(projectSlug)
      setShowcases(data)
    } catch (error: any) {
      console.error("Error loading project showcases:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Community Implementations
          </CardTitle>
          <CardDescription>See how others have built this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Community Implementations
          </CardTitle>
          <CardDescription>Error loading implementations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Failed to load community implementations: {error}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (showcases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Community Implementations
          </CardTitle>
          <CardDescription>See how others have built this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">No community implementations yet</p>
            <p className="text-xs text-muted-foreground">
              Be the first to showcase your implementation of {projectName}!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Community Implementations
        </CardTitle>
        <CardDescription>
          {showcases.length} developer{showcases.length !== 1 ? "s" : ""} have built this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showcases.map((showcase) => (
            <div key={showcase.project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={showcase.user.github_avatar || "/placeholder.svg"}
                      alt={showcase.user.display_name || showcase.user.github_username || "User"}
                    />
                    <AvatarFallback>
                      {(showcase.user.display_name || showcase.user.github_username || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">
                        {showcase.user.display_name || showcase.user.github_username || "Anonymous"}
                      </h4>
                      {showcase.user.github_username && (
                        <Badge variant="outline" className="text-xs">
                          @{showcase.user.github_username}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Completed {formatDate(showcase.project.completedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={showcase.project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />
                      Code
                    </a>
                  </Button>

                  {showcase.project.demoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={showcase.project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {showcase.project.description && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{showcase.project.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showcase.user.github_username && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/profile/${showcase.user.id}`}>View Profile</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

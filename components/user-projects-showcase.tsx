"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Calendar, Trash2, Loader2, Code, Eye, EyeOff } from "lucide-react"
import { getUserProjects, removeUserProject, updateUserProject, type UserProject } from "@/lib/project-showcase-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface UserProjectsShowcaseProps {
  userId: string
  isOwnProfile?: boolean
}

export function UserProjectsShowcase({ userId, isOwnProfile = false }: UserProjectsShowcaseProps) {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [userId])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getUserProjects(userId)
      setProjects(data)
    } catch (error: any) {
      console.error("Error loading user projects:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to remove this project from your profile?")) {
      return
    }

    try {
      await removeUserProject(projectId)
      toast({
        title: "Project Removed",
        description: "The project has been removed from your profile.",
      })
      loadProjects() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Failed to Remove Project",
        description: error.message || "An error occurred while removing the project.",
        variant: "destructive",
      })
    }
  }

  const handleToggleVisibility = async (projectId: string, currentVisibility: boolean) => {
    try {
      await updateUserProject(projectId, { isPublic: !currentVisibility })
      toast({
        title: "Visibility Updated",
        description: `Project is now ${!currentVisibility ? "public" : "private"}.`,
      })
      loadProjects() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Failed to Update Visibility",
        description: error.message || "An error occurred while updating visibility.",
        variant: "destructive",
      })
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
            <Code className="h-5 w-5" />
            Completed Projects
          </CardTitle>
          <CardDescription>
            {isOwnProfile ? "Projects you've built and showcased" : "Projects this user has completed"}
          </CardDescription>
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
            <Code className="h-5 w-5" />
            Completed Projects
          </CardTitle>
          <CardDescription>Error loading projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">Failed to load projects: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Completed Projects
          </CardTitle>
          <CardDescription>
            {isOwnProfile ? "Projects you've built and showcased" : "Projects this user has completed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">
              {isOwnProfile ? "No projects added yet" : "No public projects to display"}
            </p>
            {isOwnProfile && (
              <p className="text-xs text-muted-foreground">
                Visit project pages and click "I Built This" to showcase your work!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Completed Projects
        </CardTitle>
        <CardDescription>
          {projects.length} project{projects.length !== 1 ? "s" : ""} completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      <Link href={`/projects/${project.projectSlug}`} className="hover:text-primary transition-colors">
                        {project.projectName}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-1">
                      {project.isPublic ? (
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    Completed {formatDate(project.completedAt)}
                  </div>

                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
                  )}
                </div>

                {isOwnProfile && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(project.id, project.isPublic)}
                      title={project.isPublic ? "Make private" : "Make public"}
                    >
                      {project.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Remove project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Github className="h-3 w-3" />
                    View Code
                  </a>
                </Button>

                {project.demoUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Live Demo
                    </a>
                  </Button>
                )}

                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${project.projectSlug}`}>View Project Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

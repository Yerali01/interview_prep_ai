"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Github, ExternalLink, Eye, EyeOff, Trash2, Plus } from "lucide-react"
import { ProjectShowcaseService, type UserProject } from "@/lib/project-showcase-service"
import { AddProjectModal } from "@/components/add-project-modal"

interface UserProjectsShowcaseProps {
  userId: string
  isCurrentUser?: boolean
}

export function UserProjectsShowcase({ userId, isCurrentUser = false }: UserProjectsShowcaseProps) {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUserProjects()
  }, [userId])

  const loadUserProjects = async () => {
    try {
      setIsLoading(true)
      const userProjects = await ProjectShowcaseService.getUserProjects(userId)
      setProjects(userProjects)
    } catch (error) {
      console.error("Error loading user projects:", error)
      if (isCurrentUser) {
        toast({
          title: "Error",
          description: "Failed to load your projects.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = async (projectId: string, currentVisibility: boolean) => {
    try {
      await ProjectShowcaseService.updateProjectVisibility(projectId, !currentVisibility)
      setProjects(projects.map((p) => (p.id === projectId ? { ...p, isPublic: !currentVisibility } : p)))
      toast({
        title: "Project Updated",
        description: `Project is now ${!currentVisibility ? "public" : "private"}.`,
      })
    } catch (error) {
      console.error("Error updating project visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update project visibility.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await ProjectShowcaseService.deleteUserProject(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
      toast({
        title: "Project Deleted",
        description: "Project has been removed from your profile.",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      })
    }
  }

  const handleProjectAdded = (newProject: UserProject) => {
    setProjects([newProject, ...projects])
    setShowAddModal(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isCurrentUser && (
        <div className="flex justify-end">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {isCurrentUser ? "You haven't added any projects yet." : "No projects to display."}
          </p>
          {isCurrentUser && (
            <Button onClick={() => setShowAddModal(true)} variant="outline">
              Add Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.projectTitle}</CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
                  </div>
                  {isCurrentUser && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(project.id, project.isPublic)}
                        className="flex items-center gap-1"
                      >
                        {project.isPublic ? (
                          <>
                            <Eye className="h-4 w-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Private
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.isPublic ? "default" : "secondary"}>
                      {project.isPublic ? "Public" : "Private"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProjectAdded={handleProjectAdded}
          userId={userId}
        />
      )}
    </div>
  )
}

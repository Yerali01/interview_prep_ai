"use client"

import { useEffect, useState } from "react"
import {
  getUserProjectsByUserId,
  type UserProject,
  deleteUserProject,
  updateUserProject,
} from "@/lib/project-showcase-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ExternalLink, Github, Trash2, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserProjectsShowcaseProps {
  userId: string
  isCurrentUser: boolean
}

export function UserProjectsShowcase({ userId, isCurrentUser }: UserProjectsShowcaseProps) {
  const { toast } = useToast()
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserProjectsByUserId(userId, isCurrentUser)
        setProjects(data)
      } catch (err) {
        console.error("Error fetching user projects:", err)
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [userId, isCurrentUser])

  const handleToggleVisibility = async (project: UserProject) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [project.id]: true }))

      await updateUserProject(project.id, {
        isPublic: !project.isPublic,
      })

      // Update local state
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, isPublic: !project.isPublic } : p)))

      toast({
        title: "Project updated",
        description: `Project is now ${!project.isPublic ? "public" : "private"}.`,
      })
    } catch (err) {
      console.error("Error updating project visibility:", err)
      toast({
        title: "Update failed",
        description: "Failed to update project visibility.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [project.id]: false }))
    }
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      await deleteUserProject(projectToDelete)

      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete))

      toast({
        title: "Project removed",
        description: "The project has been removed from your profile.",
      })
    } catch (err) {
      console.error("Error deleting project:", err)
      toast({
        title: "Deletion failed",
        description: "Failed to remove the project.",
        variant: "destructive",
      })
    } finally {
      setProjectToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24 mr-2" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isCurrentUser
            ? "You haven't added any projects yet. Complete a project and add it to your profile!"
            : "This user hasn't added any projects yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{project.projectName}</CardTitle>
                <CardDescription>
                  Added on {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
                </CardDescription>
              </div>
              {!project.isPublic && (
                <Badge variant="outline" className="gap-1">
                  <EyeOff className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
          </CardHeader>
          {project.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
          )}
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1" />
                  GitHub
                </a>
              </Button>
              {project.demoUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
            {isCurrentUser && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{project.isPublic ? "Public" : "Private"}</span>
                  <Switch
                    checked={project.isPublic}
                    onCheckedChange={() => handleToggleVisibility(project)}
                    disabled={isUpdating[project.id]}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setProjectToDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the project from your profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

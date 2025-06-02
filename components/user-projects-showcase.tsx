"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Trash,
} from "lucide-react";
import Link from "next/link";
import {
  ProjectShowcaseService,
  type UserProject,
} from "@/lib/project-showcase-service";
import { useToast } from "@/hooks/use-toast";

interface UserProjectsShowcaseProps {
  userId: string;
  isCurrentUser: boolean;
}

export function UserProjectsShowcase({
  userId,
  isCurrentUser,
}: UserProjectsShowcaseProps) {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const projectsArr = await ProjectShowcaseService.getUserProjects(
          userId
        );
        setProjects(projectsArr);
      } catch (err) {
        console.error("Error fetching user projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }

    // Listen for custom event to refresh
    const handler = () => fetchProjects();
    window.addEventListener("userProjectAdded", handler);
    return () => window.removeEventListener("userProjectAdded", handler);
  }, [userId]);

  const handleVisibilityChange = async (
    projectId: string,
    isPublic: boolean
  ) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [projectId]: true }));

      // Use the service to update project visibility
      await ProjectShowcaseService.updateProjectVisibility(projectId, isPublic);

      // Update local state
      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, isPublic } : project
        )
      );

      toast({
        title: "Visibility updated",
        description: `Project is now ${isPublic ? "public" : "private"}`,
      });
    } catch (err) {
      console.error("Error updating project visibility:", err);
      toast({
        title: "Update failed",
        description: "Failed to update project visibility",
        variant: "destructive",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);

      // Use the service to delete the project
      await ProjectShowcaseService.deleteUserProject(projectToDelete);

      // Update local state
      setProjects(projects.filter((project) => project.id !== projectToDelete));

      toast({
        title: "Project deleted",
        description: "Your project has been removed",
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      toast({
        title: "Delete failed",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24 mr-2" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Failed to load projects</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isCurrentUser
            ? "You haven't added any projects yet. Visit a project page and click 'I Built This' to add your implementation."
            : "This user hasn't added any projects yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/projects/${project.projectSlug}`}
                  className="font-medium hover:underline"
                >
                  {project.projectName || project.projectTitle}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={project.isPublic ? "default" : "outline"}>
                    {project.isPublic ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" /> Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" /> Private
                      </>
                    )}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isCurrentUser && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    {isUpdating[project.id || ""] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Switch
                          id={`visibility-${project.id}`}
                          checked={project.isPublic}
                          onCheckedChange={(checked) =>
                            project.id &&
                            handleVisibilityChange(project.id, checked)
                          }
                        />
                        <Label
                          htmlFor={`visibility-${project.id}`}
                          className="sr-only"
                        >
                          Public
                        </Label>
                      </>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setProjectToDelete(project.id || null)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {project.description && (
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </CardContent>
          )}

          <CardFooter className="pt-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-1" />
                  View Code
                </a>
              </Button>

              {project.demoUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your project showcase. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Clock,
  Star,
  ExternalLink,
  Github,
  Code,
  Target,
  Lightbulb,
  CheckCircle,
  Circle,
  Package,
  Copy,
  Plus,
} from "lucide-react"
import { firebaseGetProjectBySlug } from "@/lib/firebase-service-fixed"
import { useToast } from "@/components/ui/use-toast"
import { ProjectShowcases } from "@/components/project-showcases"
import { AddProjectModal } from "@/components/add-project-modal"

// Define interfaces for better type safety
interface Technology {
  technology_name?: string
  package_name?: string
  category?: string
  is_required?: boolean
  purpose?: string
  explanation?: string
  installation_command?: string
  version_requirement?: string
  documentation_url?: string
}

interface Feature {
  feature_name?: string
  description?: string
  priority?: string
}

interface Project {
  id?: string
  name?: string
  slug?: string
  description?: string
  difficulty_level?: string
  estimated_duration?: string
  category?: string
  github_url?: string
  demo_url?: string
  image_url?: string
  is_pet_project?: boolean
  real_world_example?: string
  technologies?: Technology[] | any
  features?: Feature[] | any
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.slug) return

      try {
        setLoading(true)
        setError(null)
        console.log("🔥 Fetching project from Firebase with slug:", params.slug)

        const projectData = await firebaseGetProjectBySlug(params.slug as string)
        console.log("🔥 Firebase project data received:", projectData)

        if (!projectData) {
          setError("Project not found")
          return
        }

        setProject(projectData)
      } catch (err) {
        console.error("❌ Error fetching project from Firebase:", err)
        setError("Failed to load project from Firebase")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.slug])

  // Safe data extraction with fallbacks
  const safeGetTechnologies = (project: Project): Technology[] => {
    try {
      if (!project?.technologies) return []

      if (Array.isArray(project.technologies)) {
        return project.technologies.filter((tech) => tech && typeof tech === "object")
      }

      // If it's an object, try to extract values
      if (typeof project.technologies === "object") {
        const values = Object.values(project.technologies)
        return values.filter((tech) => tech && typeof tech === "object") as Technology[]
      }

      return []
    } catch (err) {
      console.error("Error processing technologies:", err)
      return []
    }
  }

  const safeGetFeatures = (project: Project): Feature[] => {
    try {
      if (!project?.features) return []

      if (Array.isArray(project.features)) {
        return project.features.filter((feature) => feature && typeof feature === "object")
      }

      // If it's an object, try to extract values
      if (typeof project.features === "object") {
        const values = Object.values(project.features)
        return values.filter((feature) => feature && typeof feature === "object") as Feature[]
      }

      return []
    } catch (err) {
      console.error("Error processing features:", err)
      return []
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const groupTechnologiesByCategory = (technologies: Technology[]) => {
    try {
      return technologies.reduce(
        (acc, tech) => {
          const category = tech?.category || "Other"
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(tech)
          return acc
        },
        {} as Record<string, Technology[]>,
      )
    } catch (err) {
      console.error("Error grouping technologies:", err)
      return {}
    }
  }

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: successMessage,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error || "Project not found"}</h1>
          <Button onClick={() => router.push("/projects")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  // Safely extract data
  const technologies = safeGetTechnologies(project)
  const features = safeGetFeatures(project)
  const groupedTechnologies = groupTechnologiesByCategory(technologies)

  console.log("Safe technologies:", technologies)
  console.log("Safe features:", features)
  console.log("Grouped technologies:", groupedTechnologies)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/projects")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{project.name || "Untitled Project"}</h1>
                  {project.is_pet_project && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Pet Project
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {project.difficulty_level && (
                    <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
                  )}
                  {project.estimated_duration && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {project.estimated_duration}
                    </Badge>
                  )}
                  {project.category && <Badge variant="outline">{project.category}</Badge>}
                </div>
              </div>
              <Button onClick={() => setShowAddProjectModal(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />I Built This
              </Button>
            </div>

            {project.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {project.github_url && (
                <Button asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="outline" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Real World Example */}
          {project.real_world_example && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Real-world Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{project.real_world_example}</p>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Features to Implement
                </CardTitle>
                <CardDescription>Key features and functionality for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <Circle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{feature.feature_name || "Unnamed Feature"}</h4>
                          {feature.priority && (
                            <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                              {feature.priority}
                            </Badge>
                          )}
                        </div>
                        {feature.description && <p className="text-sm text-muted-foreground">{feature.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies & Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Technologies & Packages
              </CardTitle>
              <CardDescription>Flutter packages and concepts you'll use in this project</CardDescription>
            </CardHeader>
            <CardContent>
              {technologies.length > 0 ? (
                <div className="space-y-6">
                  {Object.keys(groupedTechnologies).length > 0 ? (
                    Object.entries(groupedTechnologies).map(([category, techs]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-4 text-sm uppercase tracking-wide text-muted-foreground border-b pb-2">
                          {category}
                        </h4>
                        <div className="space-y-4">
                          {techs.map((tech, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {tech.is_required ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <h5 className="font-semibold">{tech.technology_name || "Unnamed Technology"}</h5>
                                    {tech.is_required && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                        Required
                                      </Badge>
                                    )}
                                  </div>

                                  {tech.package_name && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="secondary" className="font-mono text-xs">
                                        {tech.package_name}
                                      </Badge>
                                      {tech.version_requirement && (
                                        <span className="text-xs text-muted-foreground">
                                          {tech.version_requirement}
                                        </span>
                                      )}
                                      {tech.documentation_url && (
                                        <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                                          <a href={tech.documentation_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Purpose */}
                              {tech.purpose && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3">
                                  <h6 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Purpose</h6>
                                  <p className="text-sm text-blue-800 dark:text-blue-200">{tech.purpose}</p>
                                </div>
                              )}

                              {/* Installation Command */}
                              {tech.installation_command && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                                  <h6 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Code className="h-3 w-3" />
                                    Installation
                                  </h6>
                                  <div className="flex items-center gap-2">
                                    <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                                      {tech.installation_command}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2"
                                      onClick={() =>
                                        copyToClipboard(
                                          tech.installation_command || "",
                                          "Installation command copied to clipboard",
                                        )
                                      }
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Explanation (fallback if no purpose) */}
                              {!tech.purpose && tech.explanation && (
                                <p className="text-sm text-muted-foreground">{tech.explanation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No technologies data available for this project.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No technologies data available for this project.</p>
                  <p className="text-sm text-muted-foreground mt-2">Technologies will be added soon.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Implementations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Community Implementations
              </CardTitle>
              <CardDescription>See how others have built this project</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectShowcases projectSlug={project.slug || ""} projectName={project.name || ""} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.difficulty_level && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
                </div>
              )}
              {project.estimated_duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{project.estimated_duration}</span>
                </div>
              )}
              {project.category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm font-medium">{project.category}</span>
                </div>
              )}
              {technologies.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Technologies</span>
                  <span className="text-sm font-medium">{technologies.length}</span>
                </div>
              )}
              {features.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <span className="text-sm font-medium">{features.length}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Dependencies Summary */}
          {technologies.some((tech) => tech.package_name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Package Dependencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {technologies
                    .filter((tech) => tech.package_name)
                    .slice(0, 5)
                    .map((tech, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {tech.package_name}
                        </code>
                        {tech.is_required ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                </div>

                {technologies.filter((tech) => tech.package_name).length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{technologies.filter((tech) => tech.package_name).length - 5} more packages
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    const commands = technologies
                      .filter((tech) => tech.installation_command)
                      .map((tech) => tech.installation_command)
                      .join("\n")

                    copyToClipboard(commands, "All installation commands copied to clipboard")
                  }}
                >
                  Copy All Commands
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setShowAddProjectModal(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />I Built This Project
              </Button>
              {project.github_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={() => router.push("/projects")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        projectId={project.id || ""}
        projectSlug={project.slug || ""}
        projectName={project.name || ""}
        onSuccess={() => {
          toast({
            title: "Project added!",
            description: "Your implementation has been added to your profile.",
          })
          // Refresh the showcases
          window.location.reload()
        }}
      />
    </div>
  )
}

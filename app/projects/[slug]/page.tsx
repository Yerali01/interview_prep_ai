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
} from "lucide-react"
import { getProjectBySlug, type Project } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Technology {
  technology_name: string
  explanation: string
  category: string
  is_required: boolean
  package_name?: string
  version_requirement?: string
  installation_command?: string
  documentation_url?: string
  purpose?: string
}

interface Feature {
  feature_name: string
  description: string
  priority: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.slug) return

      try {
        setLoading(true)
        const projectData = await getProjectBySlug(params.slug as string)
        setProject(projectData)
      } catch (err) {
        setError("Failed to load project")
        console.error("Error fetching project:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.slug])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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
    return technologies.reduce(
      (acc, tech) => {
        if (!acc[tech.category]) {
          acc[tech.category] = []
        }
        acc[tech.category].push(tech)
        return acc
      },
      {} as Record<string, Technology[]>,
    )
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

  const technologies = (project.technologies as Technology[]) || []
  const features = (project.features as Feature[]) || []
  const groupedTechnologies = groupTechnologiesByCategory(technologies)

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
                  <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                  {project.is_pet_project && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Pet Project
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {project.estimated_duration}
                  </Badge>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

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
                          <h4 className="font-medium">{feature.feature_name}</h4>
                          <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                            {feature.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies & Packages */}
          {Object.keys(groupedTechnologies).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technologies & Packages
                </CardTitle>
                <CardDescription>Flutter packages and concepts you'll use in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedTechnologies).map(([category, techs]) => (
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
                                  <h5 className="font-semibold">{tech.technology_name}</h5>
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
                                      <span className="text-xs text-muted-foreground">{tech.version_requirement}</span>
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
                                    onClick={() => {
                                      navigator.clipboard.writeText(tech.installation_command || "")
                                      toast({
                                        title: "Copied!",
                                        description: "Installation command copied to clipboard",
                                      })
                                    }}
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium">{project.estimated_duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{project.category}</span>
              </div>
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

                    navigator.clipboard.writeText(commands)
                    toast({
                      title: "Copied!",
                      description: "All installation commands copied to clipboard",
                    })
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
              {project.github_url && (
                <Button className="w-full" asChild>
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
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Github, ExternalLink, Star, Code, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getProjectBySlug, type Project, type ProjectTechnology, type ProjectFeature } from "@/lib/supabase-new"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const slug = typeof params.slug === "string" ? params.slug : ""
        const projectData = await getProjectBySlug(slug)
        setProject(projectData)
      } catch (err) {
        setError("Failed to load project details")
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
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>{error || "The project you're looking for doesn't exist."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/projects")}>View All Projects</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      {/* Project Header */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              {project.is_pet_project && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Pet Project
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex gap-2">
            {project.github_url && (
              <Button variant="outline" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {project.demo_url && (
              <Button asChild>
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center gap-4 flex-wrap">
          <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {project.estimated_duration}
          </Badge>
          <Badge variant="outline">{project.category}</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Real World Example */}
          {project.real_world_example && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Real-World Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{project.real_world_example}</p>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Project Features
                </CardTitle>
                <CardDescription>Key features and functionality to implement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.features.map((feature: ProjectFeature, index: number) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{feature.feature_name}</h4>
                        <Badge className={getPriorityColor(feature.priority)}>{feature.priority} priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technologies & Concepts
                </CardTitle>
                <CardDescription>Technologies and Flutter concepts you'll learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Group technologies by category */}
                  {Array.from(new Set(project.technologies.map((tech: ProjectTechnology) => tech.category))).map(
                    (category) => (
                      <div key={category}>
                        <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {project.technologies
                            ?.filter((tech: ProjectTechnology) => tech.category === category)
                            .map((tech: ProjectTechnology, index: number) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">{tech.technology_name}</h5>
                                  {tech.is_required && (
                                    <Badge variant="secondary" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{tech.explanation}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Difficulty Level</h4>
                <Badge className={getDifficultyColor(project.difficulty_level)}>{project.difficulty_level}</Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-1">Estimated Duration</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {project.estimated_duration}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-1">Category</h4>
                <Badge variant="outline">{project.category}</Badge>
              </div>

              {project.is_pet_project && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Project Type</h4>
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Pet Project
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {project.technologies && project.features && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Technologies</span>
                  <span className="font-medium">{project.technologies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <span className="font-medium">{project.features.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Required Tech</span>
                  <span className="font-medium">
                    {project.technologies.filter((tech: ProjectTechnology) => tech.is_required).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.github_url && (
                <Button className="w-full" variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Source Code
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button className="w-full" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Live Demo
                  </a>
                </Button>
              )}
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/projects">Browse More Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

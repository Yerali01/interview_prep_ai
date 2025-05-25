"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, ExternalLink, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getProjects, type Project } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

const ProjectsPage = () => {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await getProjects()
        setProjects(projectsData || [])
      } catch (err) {
        setError("Failed to load projects")
        console.error("Error fetching projects:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.slug}`)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">{project.description}</CardDescription>

              {/* Technologies Section */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech.technology_name}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProjectClick(project)
                  }}
                >
                  <Code className="h-4 w-4 mr-2" />
                  View Details
                </Button>

                {project.github_url && (
                  <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}

                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage

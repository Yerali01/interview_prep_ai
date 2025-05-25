"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { projects } from "@/data/projects"
import { Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const ProjectsPage = () => {
  const router = useRouter()

  const handleProjectClick = (slug: string) => {
    router.push(`/projects/${slug}`)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleProjectClick(project.slug)}
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-x-2">
                {project.github_url && (
                  <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  </Button>
                )}

                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{project.technologies.join(", ")}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage

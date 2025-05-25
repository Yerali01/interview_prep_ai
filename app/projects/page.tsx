"use client"

import type { Metadata } from "next"
import { allProjects } from "contentlayer/generated"
import { sort } from "fast-sort"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shell } from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Share2, Code } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface ProjectProps {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects I've worked on.",
}

async function handleShare(project: any) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.origin + `/projects/${project.slug}`,
      })
      toast.success("Shared successfully!")
    } catch (error: any) {
      toast.error("Something went wrong.")
    }
  } else {
    navigator.clipboard.writeText(window.location.origin + `/projects/${project.slug}`)
    toast.success("Link copied to clipboard!")
  }
}

export default async function ProjectsPage({}: ProjectProps) {
  const projects = sort(allProjects, { direction: "desc", selector: (project) => project.date })

  return (
    <Shell>
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} className="block" key={project.id}>
            <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20 cursor-pointer">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {project.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
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
                <div className="flex gap-2 items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleShare(project)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button className="flex-1" size="sm" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      <Code className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </Shell>
  )
}

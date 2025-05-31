"use client"

import { useEffect, useState } from "react"
import { getUserProjectsByProjectSlug, type UserProject } from "@/lib/project-showcase-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Github, User } from "lucide-react"
import Link from "next/link"

interface ProjectShowcasesProps {
  projectSlug: string
  projectName: string
}

export function ProjectShowcases({ projectSlug, projectName }: ProjectShowcasesProps) {
  const [showcases, setShowcases] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserProjectsByProjectSlug(projectSlug)
        setShowcases(data)
      } catch (err) {
        console.error("Error fetching project showcases:", err)
        setError("Failed to load community implementations")
      } finally {
        setLoading(false)
      }
    }

    fetchShowcases()
  }, [projectSlug])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
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

  if (showcases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No implementations yet. Be the first to share yours!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showcases.map((showcase) => (
        <Card key={showcase.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={showcase.userPhotoUrl || undefined} alt={showcase.userName} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profile/${showcase.userId}`} className="font-medium hover:underline">
                  {showcase.userName}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {showcase.createdAt ? new Date(showcase.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
          </CardHeader>
          {showcase.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{showcase.description}</p>
            </CardContent>
          )}
          <CardFooter className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={showcase.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                View Code
              </a>
            </Button>
            {showcase.demoUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={showcase.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live Demo
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

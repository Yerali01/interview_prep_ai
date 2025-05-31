"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { notFound } from "next/navigation"
import { allProjects } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shell } from "@/components/shell"
import { useState } from "react"
import { AddProjectModal } from "@/components/add-project-modal"
import { ProjectShowcases } from "@/components/project-showcases"

interface Props {
  params: {
    slug: string
  }
}

export default function Page({ params }: Props) {
  const project = allProjects.find((project) => project.slug === params.slug)

  if (!project) {
    return notFound()
  }

  const MDXContent = useMDXComponent(project.body.code)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  return (
    <Shell className="md:py-24">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.author ? (
              <Avatar>
                <AvatarImage src={project.author.image || "/placeholder.svg"} alt={project.author.name} />
                <AvatarFallback>{project.author.name}</AvatarFallback>
              </Avatar>
            ) : null}
            <Button onClick={() => setShowAddProjectModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />I Built This
            </Button>
          </div>
        </div>
        <div className="border rounded-md bg-secondary">
          <MDXContent />
        </div>
      </div>

      <ProjectShowcases projectSlug={project.slug} projectName={project.name} />

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        projectId={project.id}
        projectSlug={project.slug}
        projectName={project.name}
        onSuccess={() => {
          // Refresh the showcases
          window.location.reload()
        }}
      />
    </Shell>
  )
}

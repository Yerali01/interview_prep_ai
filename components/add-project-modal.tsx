"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { addUserProject } from "@/lib/project-showcase-service"
import { useAuth } from "@/contexts/auth-context"

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectSlug: string
  projectName: string
  onSuccess?: () => void
}

export function AddProjectModal({
  isOpen,
  onClose,
  projectId,
  projectSlug,
  projectName,
  onSuccess,
}: AddProjectModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add your project implementation.",
        variant: "destructive",
      })
      return
    }

    if (!githubUrl) {
      toast({
        title: "GitHub URL required",
        description: "Please provide a link to your GitHub repository.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await addUserProject({
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhotoUrl: user.photoURL || null,
        projectId,
        projectSlug,
        projectName,
        githubUrl,
        demoUrl: demoUrl || null,
        description: description || null,
        isPublic,
        createdAt: new Date(),
      })

      toast({
        title: "Project added!",
        description: "Your implementation has been added to your profile.",
      })

      // Reset form
      setGithubUrl("")
      setDemoUrl("")
      setDescription("")
      setIsPublic(true)

      // Close modal
      onClose()

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: "Failed to add your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Your Implementation</DialogTitle>
          <DialogDescription>
            Share your implementation of <span className="font-medium">{projectName}</span> with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub Repository URL *</Label>
            <Input
              id="github-url"
              placeholder="https://github.com/yourusername/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-url">Demo URL (optional)</Label>
            <Input
              id="demo-url"
              placeholder="https://your-demo-site.com"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Share details about your implementation, challenges you faced, or unique features you added."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-switch">Make Public</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your implementation</p>
            </div>
            <Switch id="public-switch" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !githubUrl}>
              {isSubmitting ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

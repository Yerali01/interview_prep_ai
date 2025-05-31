"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { addUserProject } from "@/lib/project-showcase-service"
import { Loader2, Github, ExternalLink } from "lucide-react"

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
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!githubUrl.trim()) {
      toast({
        title: "GitHub URL Required",
        description: "Please provide a link to your GitHub repository.",
        variant: "destructive",
      })
      return
    }

    // Validate GitHub URL
    if (!githubUrl.includes("github.com")) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please provide a valid GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addUserProject({
        projectId,
        projectSlug,
        projectName,
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim() || undefined,
        description: description.trim() || undefined,
        isPublic,
      })

      toast({
        title: "Project Added!",
        description: "Your completed project has been added to your profile.",
      })

      onSuccess?.()
      onClose()

      // Reset form
      setGithubUrl("")
      setDemoUrl("")
      setDescription("")
      setIsPublic(true)
    } catch (error: any) {
      toast({
        title: "Failed to Add Project",
        description: error.message || "An error occurred while adding your project.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Completed Project</DialogTitle>
          <DialogDescription>Showcase your implementation of "{projectName}" on your profile.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-url">
              GitHub Repository URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-url">Demo URL (Optional)</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="demo-url"
                type="url"
                placeholder="https://your-demo-url.com"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your implementation, challenges faced, or unique features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="is-public">Make this project visible to others</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

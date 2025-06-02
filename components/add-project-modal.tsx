"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/auth/auth-provider";
import { addUserProject } from "@/lib/project-showcase-service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectSlug: string;
  projectName: string;
  onSuccess?: () => void;
}

export function AddProjectModal({
  isOpen,
  onClose,
  projectId,
  projectSlug,
  projectName,
  onSuccess,
}: AddProjectModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubUrl: "",
    demoUrl: "",
    description: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add your project.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.githubUrl.trim()) {
      toast({
        title: "GitHub URL required",
        description: "Please provide a link to your GitHub repository.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Log the payload
      console.log("[AddProjectModal] Submitting user project:", {
        userId: user.id,
        projectId,
        projectSlug,
        projectName,
        githubUrl: formData.githubUrl.trim(),
        demoUrl: formData.demoUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic,
      });

      const result = await addUserProject({
        userId: user.id,
        projectId,
        projectSlug,
        projectName,
        githubUrl: formData.githubUrl.trim(),
        demoUrl: formData.demoUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic,
      });

      // Log the result
      console.log("[AddProjectModal] addUserProject result:", result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Extra check: warn if not public or slug mismatch
      if (!formData.isPublic) {
        toast({
          title: "Project added as private",
          description:
            "Your implementation is private and will not appear in the community list.",
          variant: "destructive",
        });
      } else if (result.data && result.data.projectSlug !== projectSlug) {
        toast({
          title: "Project slug mismatch",
          description:
            "Your implementation's slug does not match the current project. It may not appear in the list.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project added!",
          description: "Your implementation has been added to your profile.",
        });
      }

      // Reset form
      setFormData({
        githubUrl: "",
        demoUrl: "",
        description: "",
        isPublic: true,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Your Implementation</DialogTitle>
          <DialogDescription>
            Share your implementation of "{projectName}" with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Repository URL *</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username/repository"
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL (optional)</Label>
            <Input
              id="demoUrl"
              type="url"
              placeholder="https://your-demo.com"
              value={formData.demoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your implementation, challenges you faced, or features you added..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isPublic: checked }))
              }
            />
            <Label htmlFor="isPublic">Make this project public</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

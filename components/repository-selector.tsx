"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, GitFork, Loader2, Share } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { shareRepositories } from "@/lib/github-api"

interface Repository {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
}

interface RepositorySelectorProps {
  repositories: Repository[]
  initialSelectedRepositories: Set<number>
  onSave: (selectedRepositories: Set<number>) => Promise<void>
  githubUsername: string
}

export function RepositorySelector({
  repositories,
  initialSelectedRepositories,
  onSave,
  githubUsername,
}: RepositorySelectorProps) {
  const [selectedRepositories, setSelectedRepositories] = useState<Set<number>>(new Set(initialSelectedRepositories))
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setSelectedRepositories(new Set(initialSelectedRepositories))
  }, [initialSelectedRepositories])

  const handleCheckboxChange = (repoId: number) => {
    setSelectedRepositories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(repoId)) {
        newSet.delete(repoId)
      } else {
        newSet.add(repoId)
      }
      return newSet
    })
  }

  const handleSaveSelection = async () => {
    setSaving(true)
    try {
      await onSave(selectedRepositories)
      toast({
        title: "Selection Saved",
        description: "Your repository selection has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error Saving Selection",
        description: "There was an error saving your selection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleShareSelected = () => {
    const selectedRepos = repositories.filter((repo) => selectedRepositories.has(repo.id))
    if (selectedRepos.length === 0) {
      toast({
        title: "No Repositories Selected",
        description: "Please select some repositories to share.",
        variant: "destructive",
      })
      return
    }

    try {
      shareRepositories(selectedRepos, githubUsername)
      toast({
        title: "Selected Repositories Shared!",
        description: "Selected repository list has been copied to clipboard or shared.",
      })
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share repositories. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Repositories to Showcase</CardTitle>
            <CardDescription>
              Choose which repositories you want to display on your profile
              {selectedRepositories.size > 0 && (
                <span className="ml-2 text-sm font-medium">({selectedRepositories.size} selected)</span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedRepositories.size > 0 && (
              <Button variant="outline" size="sm" onClick={handleShareSelected}>
                <Share className="h-3 w-3 mr-1" />
                Share Selected
              </Button>
            )}
            <Button onClick={handleSaveSelection} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Selection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`repo-${repo.id}`}
                  checked={selectedRepositories.has(repo.id)}
                  onCheckedChange={() => handleCheckboxChange(repo.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={`repo-${repo.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {repo.name}
                  </label>
                  <p className="text-sm text-muted-foreground">{repo.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

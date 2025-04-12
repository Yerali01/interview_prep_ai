"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { topics } from "@/lib/data"
import { Brain } from "lucide-react"
import Link from "next/link"

interface TopicDialogProps {
  topicId: string
  isOpen: boolean
  onClose: () => void
}

export default function TopicDialog({ topicId, isOpen, onClose }: TopicDialogProps) {
  const topic = topics.find((t) => t.id === topicId)

  if (!topic) return null

  // For small content topics, we'll show them in a dialog
  const isSmallContent = topic.content.reduce((acc, section) => acc + section.content.length, 0) < 500

  if (!isSmallContent) {
    // Redirect to full topic page for larger content
    if (isOpen) {
      onClose()
      window.location.href = `/topics/${topicId}`
    }
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <DifficultyBadge level={topic.level} />
            <span className="text-sm text-muted-foreground">{topic.estimatedTime} min read</span>
          </div>
          <DialogTitle className="text-2xl">{topic.title}</DialogTitle>
          <DialogDescription>{topic.description}</DialogDescription>
        </DialogHeader>

        <div className="prose prose-invert max-w-none">
          {topic.content.map((section, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              <p>{section.content}</p>
              {section.code && (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/quiz?topic=${topic.id}`}>
              <Brain className="mr-2 h-4 w-4" /> Take Quiz
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DifficultyBadge({ level }: { level: "junior" | "middle" | "senior" }) {
  const colors = {
    junior: "bg-green-500/20 text-green-400 border-green-500/30",
    middle: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    senior: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }

  const labels = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>{labels[level]}</span>
}

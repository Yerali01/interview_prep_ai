import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIRecommendationBadgeProps {
  className?: string
}

export function AIRecommendationBadge({ className }: AIRecommendationBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium text-yellow-400", className)}>
      <Sparkles className="h-3 w-3" />
      <span>AI Recommended</span>
    </div>
  )
}

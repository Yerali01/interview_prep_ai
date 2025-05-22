"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import heavy components
export const DynamicAIChat = dynamic(() => import("@/components/ai-chat"), {
  loading: () => (
    <div className="p-4 rounded-md bg-muted">
      <div className="flex items-start space-x-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-16 w-3/4 rounded-lg" />
      </div>
      <div className="flex items-start space-x-3 mb-4 justify-end">
        <Skeleton className="h-12 w-2/3 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex items-start space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-20 w-4/5 rounded-lg" />
      </div>
    </div>
  ),
  ssr: false,
})

export const DynamicFloatingAIChat = dynamic(() => import("./floating-ai-chat").then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
})

export const DynamicFeedbackModal = dynamic(() => import("@/components/feedback-modal").then(mod => ({ default: mod.FeedbackModal })), {
  loading: () => null,
  ssr: false,
})

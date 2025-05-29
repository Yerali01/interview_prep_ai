"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { firebaseGetTopicBySlug } from "@/lib/firebase-service"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Copy, Play } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import "highlight.js/styles/github-dark.css"
import { useTopics } from "@/contexts/topics-context"
import { useDefinitions } from "@/contexts/definitions-context"
import { EnhancedMarkdown } from "@/components/enhanced-markdown"
import { CodeSyntaxLegend } from "@/components/code-syntax-legend"
import { useToast } from "@/hooks/use-toast"

interface TopicSection {
  title: string
  content: string
  code?: string
}

export default function TopicPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { topics } = useTopics()
  const { definitions } = useDefinitions()
  const { toast } = useToast()
  const [topic, setTopic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        if (!slug) {
          setError("Topic not found")
          setLoading(false)
          return
        }

        // First try to find the topic in the cached topics
        const cachedTopic = topics.find((t) => t.slug === slug)

        if (cachedTopic && cachedTopic.content) {
          console.log("🔥 Using cached topic from Firebase:", cachedTopic)
          setTopic(cachedTopic)
          setLoading(false)
          return
        }

        // If not found in cache or content is missing, fetch from Firebase
        console.log("🔥 Fetching topic from Firebase with slug:", slug)
        const topicData = await firebaseGetTopicBySlug(slug)
        console.log("🔥 Firebase topic data received:", topicData)

        if (!topicData) {
          setError("Topic not found in Firebase")
        } else {
          setTopic(topicData)

          // Debug the content field
          if (!topicData.content) {
            console.warn("Topic content is empty or undefined:", topicData)
          }
        }
      } catch (error) {
        console.error("❌ Error fetching topic from Firebase:", error)
        setError("Failed to load topic from Firebase")
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [slug, topics])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      console.log("🔥 Refreshing topic from Firebase...")
      const topicData = await firebaseGetTopicBySlug(slug)
      if (topicData) {
        setTopic(topicData)
        setError(null)
        toast({
          title: "Topic refreshed",
          description: "Latest content loaded from Firebase",
        })
      } else {
        setError("Topic not found in Firebase")
      }
    } catch (error) {
      console.error("❌ Error refreshing topic from Firebase:", error)
      setError("Failed to refresh topic from Firebase")
    } finally {
      setRefreshing(false)
    }
  }

  // Function to prepare code for DartPad
  const prepareCodeForDartPad = (code: string): string => {
    const cleanCode = code.trim()

    // Check if it's already a complete program
    if (cleanCode.includes("void main(") || cleanCode.includes("main(")) {
      return cleanCode
    }

    // Check if it's a class definition
    if (cleanCode.includes("class ") && !cleanCode.includes("void main(")) {
      return `${cleanCode}

void main() {
  // Example usage - modify as needed
  print('Code is ready to run!');
}`
    }

    // Check if it's function definitions
    if (cleanCode.includes("Future<") || cleanCode.includes("Stream<") || cleanCode.includes("async")) {
      return `${cleanCode}

void main() async {
  // Example usage - modify as needed
  print('Async code is ready to run!');
}`
    }

    // For simple expressions or statements, wrap in main
    return `void main() {
  ${cleanCode}
}`
  }

  const openDartPadWithCode = (code: string) => {
    console.log("🚀 Opening DartPad with specific code:", code)

    // Prepare the code to be runnable
    const runnableCode = prepareCodeForDartPad(code)
    console.log("📝 Prepared code:", runnableCode)

    // Show warning toast first
    toast({
      title: "Opening DartPad...",
      description: "Code will be copied to your clipboard. Paste it in DartPad and click Run.",
      duration: 3000,
    })

    // Copy to clipboard
    navigator.clipboard
      .writeText(runnableCode)
      .then(() => {
        console.log("✅ Code copied to clipboard")

        // Open DartPad after a short delay
        setTimeout(() => {
          const dartPadWindow = window.open("https://dartpad.dev/", "_blank")

          if (dartPadWindow) {
            console.log("✅ DartPad opened successfully")
            toast({
              title: "✅ Ready to Code!",
              description:
                "1. Paste the code (Ctrl+V or Cmd+V)\n2. Click the blue 'Run' button\n3. See the output below!",
              duration: 8000,
            })
          } else {
            console.log("❌ Failed to open DartPad")
            toast({
              title: "❌ Popup Blocked",
              description: "Please allow popups for this site, then try again.",
              variant: "destructive",
            })
          }
        }, 1000)
      })
      .catch(() => {
        console.log("❌ Failed to copy to clipboard")
        toast({
          title: "❌ Copy Failed",
          description: "Please copy the code manually and open dartpad.dev",
          variant: "destructive",
        })
      })
  }

  const copyCode = (code: string) => {
    const runnableCode = prepareCodeForDartPad(code)

    navigator.clipboard
      .writeText(runnableCode)
      .then(() => {
        toast({
          title: "📋 Code Copied!",
          description: "Ready-to-run code copied to clipboard",
          duration: 3000,
        })
      })
      .catch(() => {
        toast({
          title: "❌ Copy Failed",
          description: "Please copy the code manually",
          variant: "destructive",
        })
      })
  }

  if (loading) {
    return <TopicSkeleton />
  }

  if (error || !topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/topics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Topic Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {error || "The topic you're looking for doesn't exist in Firebase or has been moved."}
          </p>
          <Button asChild>
            <Link href="/topics">Browse All Topics</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Parse content if it's a string
  let contentSections: TopicSection[] = []
  try {
    if (typeof topic.content === "string") {
      contentSections = JSON.parse(topic.content)
    } else if (Array.isArray(topic.content)) {
      contentSections = topic.content
    }
  } catch (e) {
    console.error("Error parsing content:", e)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/topics">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <CodeSyntaxLegend />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh from Firebase
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <span className="capitalize mr-4">{topic.level} Level</span>
            <span>{topic.estimated_time} min read</span>
            <span className="ml-4 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              🔥 Loaded from Firebase
            </span>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {contentSections && contentSections.length > 0 ? (
            contentSections.map((section, index) => (
              <div key={index} className="mb-12">
                {section.title && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}

                {section.content && <EnhancedMarkdown content={section.content} definitions={definitions} />}

                {section.code && (
                  <div className="my-6">
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {/* Code header */}
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Example</span>
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              copyCode(section.code!)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>

                      {/* Code content */}
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto m-0 border-l-4 border-green-500">
                          <code className="language-dart">{section.code}</code>
                        </pre>
                      </div>

                      {/* Try it yourself button */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("🔥 SECTION BUTTON CLICKED!")
                            console.log("Code to open:", section.code)
                            openDartPadWithCode(section.code)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm flex items-center gap-2"
                          type="button"
                        >
                          <Play className="h-4 w-4" />
                          Try it Yourself »
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          💡 This will copy ready-to-run code to your clipboard and open DartPad
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200">
                This topic doesn't have any content yet in Firebase. Check back later!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function TopicSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
        </Button>
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/4" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  )
}

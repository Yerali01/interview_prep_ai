"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Brain, Sparkles } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { getTopicBySlug, getTopics, type Topic } from "@/lib/supabase"
import { getTopicRecommendations } from "@/app/actions/get-recommendations"
import { Skeleton } from "@/components/ui/skeleton"

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [topic, setTopic] = useState<Topic | null>(null)
  const [relatedTopics, setRelatedTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const topicData = await getTopicBySlug(slug)
        setTopic(topicData)
        setLoading(false)

        if (topicData) {
          setLoadingRecommendations(true)
          try {
            // Get recommendations
            const contentSummary = topicData.content.map((section) => `${section.title}: ${section.content}`).join(" ")

            const recommendations = await getTopicRecommendations(
              slug,
              topicData.title,
              contentSummary,
              topicData.level,
            )

            setRelatedTopics(recommendations)
          } catch (error) {
            console.error("Error getting recommendations:", error)
            // Fallback to random topics of the same level
            const allTopics = await getTopics()
            const sameLevel = allTopics.filter((t) => t.slug !== slug && t.level === topicData.level)
            setRelatedTopics(sameLevel.slice(0, 3))
          } finally {
            setLoadingRecommendations(false)
          }
        }
      } catch (error) {
        console.error("Error fetching topic:", error)
        setLoading(false)
        setLoadingRecommendations(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Topic Not Found</h1>
        <p className="mb-8">The topic you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/topics">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-12"
    >
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/topics")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DifficultyBadge level={topic.level} />
            <span className="text-sm text-muted-foreground">{topic.estimated_time} min read</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-bold"
          >
            {topic.title}
          </motion.h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href={`/quiz?topic=${topic.slug}`}>
              <Brain className="mr-2 h-4 w-4" /> Take Quiz
            </Link>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="prose prose-invert max-w-none dark:prose-invert">
              <h2>Overview</h2>
              <p>{topic.description}</p>

              {topic.content.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                >
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                  {section.code && (
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{section.code}</code>
                    </pre>
                  )}
                </motion.div>
              ))}

              {topic.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <h2>Summary</h2>
                  <p>{topic.summary}</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Recommended Topics</h2>
          <Sparkles className="ml-2 h-5 w-5 text-yellow-400" />
        </div>
        <Button asChild variant="ghost">
          <Link href="/topics">View All Topics</Link>
        </Button>
      </div>

      {loadingRecommendations ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-2" />
                <Skeleton className="h-4 w-4/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {relatedTopics.map((relatedTopic, index) => (
            <motion.div
              key={relatedTopic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Link href={`/topics/${relatedTopic.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{relatedTopic.title}</h3>
                      <DifficultyBadge level={relatedTopic.level} />
                    </div>
                    <p className="text-muted-foreground">{relatedTopic.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
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

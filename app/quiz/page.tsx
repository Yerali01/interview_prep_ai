"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { getQuizzes, type Quiz } from "@/lib/supabase"

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const quizzesData = await getQuizzes()
        setQuizzes(quizzesData)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8"
      >
        Flutter & Dart Quizzes
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value="junior">Junior</TabsTrigger>
            <TabsTrigger value="middle">Middle</TabsTrigger>
            <TabsTrigger value="senior">Senior</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="all" className="mt-6">
                <QuizGrid quizzes={quizzes} />
              </TabsContent>

              <TabsContent value="junior" className="mt-6">
                <QuizGrid quizzes={quizzes.filter((quiz) => quiz.level === "junior")} />
              </TabsContent>

              <TabsContent value="middle" className="mt-6">
                <QuizGrid quizzes={quizzes.filter((quiz) => quiz.level === "middle")} />
              </TabsContent>

              <TabsContent value="senior" className="mt-6">
                <QuizGrid quizzes={quizzes.filter((quiz) => quiz.level === "senior")} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function QuizGrid({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{quiz.title}</h3>
                  <DifficultyBadge level={quiz.level} />
                </div>
                <p className="text-muted-foreground mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Take the challenge</span>
                  <Button asChild size="sm">
                    <Link href={`/quiz/${quiz.slug}`}>
                      Start Quiz <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
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

"use client"

// Add dynamic export to prevent static generation
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Trophy, Clock, Calendar } from "lucide-react"
import { firebaseGetUserQuizResults, type QuizResult } from "@/lib/firebase-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function fetchQuizResults() {
      if (user) {
        setLoadingResults(true)
        try {
          console.log("🔥 Fetching quiz results from Firebase for user:", user.id)
          const results = await firebaseGetUserQuizResults(user.id)
          console.log("🔥 Firebase quiz results received:", results.length)
          setQuizResults(results)
        } catch (error) {
          console.error("❌ Error fetching quiz results from Firebase:", error)
        } finally {
          setLoadingResults(false)
        }
      }
    }

    fetchQuizResults()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="quiz-history">Quiz History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription>
                  Manage your account settings
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    🔥 Firebase Account
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-sm text-muted-foreground">{user.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">{user.email_confirmed_at ? "Yes" : "No"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Firebase (Primary)</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button onClick={() => signOut()} variant="outline" className="w-full">
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz-history">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Quiz History</CardTitle>
                <CardDescription>
                  View your past quiz attempts and scores
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">🔥 From Firebase</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingResults ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : quizResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't completed any quizzes yet.</p>
                    <Button asChild>
                      <Link href="/quiz">Take a Quiz</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizResults.map((result) => (
                      <Card key={result.id} className="overflow-hidden">
                        <div className="p-4 border-b bg-muted/50">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{result.quiz_title || "Quiz"}</h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(result.completed_at)}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-sm mb-1">
                              <Trophy className="h-4 w-4 mr-1" />
                              Score
                            </div>
                            <div className={`text-lg font-bold ${getScoreColor(result.score, result.total_questions)}`}>
                              {result.score}/{result.total_questions}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round((result.score / result.total_questions) * 100)}%
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-sm mb-1">
                              <Clock className="h-4 w-4 mr-1" />
                              Time
                            </div>
                            <div className="text-lg font-bold">--:--</div>
                            <div className="text-xs text-muted-foreground">Firebase data</div>
                          </div>
                          <div className="flex items-center justify-center">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/quiz/${result.quiz_id}`}>Retake Quiz</Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

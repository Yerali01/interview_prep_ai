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
import { ArrowLeft, Loader2, Trophy, Clock, Calendar, Github, LinkIcon } from "lucide-react"
import { firebaseGetUserQuizResults } from "@/lib/firebase-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RepositorySelector } from "@/components/repository-selector"
import { RepositoryShowcase } from "@/components/repository-showcase"

export default function ProfilePage() {
  const { user, loading: isLoading, signOut, linkGitHubAccount } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [quizResults, setQuizResults] = useState<any[]>([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [linkingGitHub, setLinkingGitHub] = useState(false)

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

  const handleLinkGitHub = async () => {
    setLinkingGitHub(true)
    try {
      await linkGitHubAccount()
      toast({
        title: "GitHub Account Linked!",
        description: "Your GitHub account has been successfully linked to your profile.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to Link GitHub",
        description: error.message || "An error occurred while linking your GitHub account.",
        variant: "destructive",
      })
    } finally {
      setLinkingGitHub(false)
    }
  }

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
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
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
                <CardTitle className="text-2xl flex items-center gap-3">
                  {user.github_avatar && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.github_avatar || "/placeholder.svg"}
                        alt={user.display_name || user.email || "User"}
                      />
                      <AvatarFallback>
                        {(user.display_name || user.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  Your Profile
                </CardTitle>
                <CardDescription>Manage your account settings and connected accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Display Name</p>
                  <p className="text-sm text-muted-foreground">{user.display_name || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-sm text-muted-foreground font-mono text-xs">{user.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">{user.email_confirmed_at ? "Yes" : "No"}</p>
                </div>

                {/* GitHub Account Section */}
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Account
                    </p>
                    {user.github_username ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          {user.github_avatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.github_avatar || "/placeholder.svg"} alt={user.github_username} />
                              <AvatarFallback>
                                <Github className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">
                              Connected as @{user.github_username}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              GitHub account linked successfully
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://github.com/${user.github_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        <div>
                          <p className="text-sm font-medium">No GitHub account linked</p>
                          <p className="text-xs text-muted-foreground">
                            Link your GitHub account to showcase your projects
                          </p>
                        </div>
                        <Button onClick={handleLinkGitHub} disabled={linkingGitHub} className="flex items-center gap-2">
                          {linkingGitHub ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LinkIcon className="h-4 w-4" />
                          )}
                          Link GitHub
                        </Button>
                      </div>
                    )}
                  </div>
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

        <TabsContent value="repositories">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {user.github_username ? (
              <>
                <RepositorySelector userId={user.id} githubUsername={user.github_username} />
                <RepositoryShowcase userId={user.id} isOwnProfile={true} githubUsername={user.github_username} />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Repository Showcase</CardTitle>
                  <CardDescription>Connect your GitHub account to showcase your repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Link your GitHub account to display your repositories on your profile.
                    </p>
                    <Button onClick={handleLinkGitHub} disabled={linkingGitHub} className="flex items-center gap-2">
                      {linkingGitHub ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                      Link GitHub Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz-history">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Quiz History</CardTitle>
                <CardDescription>View your past quiz attempts and scores</CardDescription>
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
                            <div className="text-xs text-muted-foreground">Not tracked</div>
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

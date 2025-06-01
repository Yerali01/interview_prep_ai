"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookOpen, Code, Github, User } from "lucide-react"
import Link from "next/link"
import { UserProjectsShowcase } from "@/components/user-projects-showcase"
import { useAuth } from "@/components/auth/auth-provider"
import { firebaseGetPublicUserProfile } from "@/lib/firebase-service-fixed"

interface UserProfile {
  id: string
  displayName: string
  email: string
  photoURL: string | null
  githubUsername: string | null
  bio: string | null
  repositories: string[]
  quizCount: number
  joinedAt: string | null
}

export default function UserProfilePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isCurrentUser = user?.id === userId

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || typeof userId !== "string") {
        setError("Invalid user ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await firebaseGetPublicUserProfile(userId)

        if (result.error) {
          throw new Error(result.error)
        }

        setProfile(result.data)
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError(err instanceof Error ? err.message : "Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "Could not load user profile"}</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.displayName}</h1>
            {isCurrentUser && <p className="text-muted-foreground">{profile.email}</p>}
            {profile.githubUsername && (
              <p className="text-sm text-muted-foreground">
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @{profile.githubUsername}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="projects">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">
              <Code className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            {profile.repositories.length > 0 && (
              <TabsTrigger value="repositories">
                <Github className="h-4 w-4 mr-2" />
                Repositories
              </TabsTrigger>
            )}
            <TabsTrigger value="learning">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning Progress
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  {isCurrentUser
                    ? "Projects you've completed from the Flutter Interview Prep platform."
                    : `Projects ${profile.displayName} has completed from the Flutter Interview Prep platform.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProjectsShowcase userId={userId as string} isCurrentUser={isCurrentUser} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repositories Tab */}
          {profile.repositories.length > 0 && (
            <TabsContent value="repositories">
              <Card>
                <CardHeader>
                  <CardTitle>GitHub Repositories</CardTitle>
                  <CardDescription>
                    {isCurrentUser ? "Your GitHub repositories." : `${profile.displayName}'s GitHub repositories.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.repositories.map((repo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Github className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm truncate hover:underline"
                          >
                            {typeof repo === "string" ? repo.replace("https://github.com/", "") : "Unknown Repository"}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Learning Progress Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  {isCurrentUser
                    ? "Track your progress through Flutter topics and quizzes."
                    : `${profile.displayName}'s progress through Flutter topics and quizzes.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Quizzes Completed</h3>
                        <p className="text-sm text-muted-foreground">Total quizzes completed on the platform</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{profile.quizCount}</div>
                  </div>

                  {/* More learning stats will be added here */}
                  <p className="text-center py-4 text-muted-foreground">
                    More detailed learning progress tracking coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

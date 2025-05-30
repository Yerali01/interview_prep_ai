"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuizzes } from "@/contexts/quiz-context"
import Link from "next/link"

export default function QuizContentClient() {
  const { quizzes, loading, error } = useQuizzes()
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const levels = ["all", "junior", "middle", "senior"]

  const filteredQuizzes = selectedLevel === "all" ? quizzes : quizzes.filter((quiz) => quiz.level === selectedLevel)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Flutter Interview Quizzes</h1>
          <p className="text-xl text-muted-foreground">Test your Flutter knowledge with our interactive quizzes</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {levels.map((level) => (
            <Skeleton key={level} className="h-10 w-20" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Flutter Interview Quizzes</h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-destructive font-medium">Failed to load quizzes</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Flutter Interview Quizzes</h1>
        <p className="text-xl text-muted-foreground">Test your Flutter knowledge with our interactive quizzes</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {levels.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? "default" : "outline"}
            onClick={() => setSelectedLevel(level)}
            className="capitalize"
          >
            {level === "all" ? "All Levels" : level}
          </Button>
        ))}
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quizzes found for the selected level.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {quiz.level && (
                    <Badge
                      variant={
                        quiz.level === "senior" ? "destructive" : quiz.level === "middle" ? "default" : "secondary"
                      }
                    >
                      {quiz.level}
                    </Badge>
                  )}
                </div>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{quiz.questions?.length || 0} questions</span>
                  <Link href={`/quiz/${quiz.slug || quiz.id}`}>
                    <Button>Start Quiz</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

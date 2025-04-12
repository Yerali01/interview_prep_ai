"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getQuizBySlug, getQuestionsByQuizSlug, saveQuizResult } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!params.slug) {
          throw new Error("Quiz slug is missing")
        }

        const quizSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug
        console.log("Fetching quiz with slug:", quizSlug)

        const quizData = await getQuizBySlug(quizSlug)
        if (!quizData) {
          throw new Error(`Quiz with slug ${quizSlug} not found`)
        }

        setQuiz(quizData)
        console.log("Quiz data:", quizData)

        // Use the new function to get questions by quiz slug
        const questionsData = await getQuestionsByQuizSlug(quizSlug)
        if (!questionsData || questionsData.length === 0) {
          throw new Error(`No questions found for quiz with slug ${quizSlug}`)
        }

        setQuestions(questionsData)
        console.log("Questions data:", questionsData)
      } catch (error) {
        console.error("Error fetching quiz data:", error)
        toast({
          title: "Error",
          description: `Failed to load quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
    setStartTime(Date.now())
  }, [params.slug, toast])

  const handleAnswerSelect = (value: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(value)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    // Update score if answer is correct
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }

    // Save user's answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswer,
    }))

    setIsAnswerSubmitted(true)
  }

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    } else {
      // Quiz completed
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    setQuizCompleted(true)
    const endTime = Date.now()
    const completionTimeInSeconds = Math.floor((endTime - startTime) / 1000)

    // Save quiz result to history
    try {
      if (quiz) {
        const quizResult = {
          quiz_id: quiz.id,
          quiz_name: quiz.title,
          user_id: "anonymous", // Replace with actual user ID if you have authentication
          score: score,
          total_questions: questions.length,
          completion_time: completionTimeInSeconds,
        }

        await saveQuizResult(quizResult)
        console.log("Quiz result saved:", quizResult)
      }
    } catch (error) {
      console.error("Error saving quiz result:", error)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-8" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/quiz">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Not Found</CardTitle>
            <CardDescription>
              Sorry, we couldn't find the quiz you're looking for. Please try another quiz.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/quiz">Browse Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/quiz">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
        </Link>
      </Button>

      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{quiz.title}</CardTitle>
                  <div className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="pt-6">
                {currentQuestion && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                      <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                          <div
                            key={key}
                            className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer ${
                              isAnswerSubmitted
                                ? key === currentQuestion.correct_answer
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : selectedAnswer === key
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    : ""
                                : "hover:bg-muted"
                            }`}
                            onClick={() => handleAnswerSelect(key)}
                          >
                            <RadioGroupItem
                              value={key}
                              id={`option-${key}`}
                              disabled={isAnswerSubmitted}
                              className="border-primary"
                            />
                            <Label htmlFor={`option-${key}`} className="flex-grow cursor-pointer font-normal">
                              {value as string}
                            </Label>
                            {isAnswerSubmitted && key === currentQuestion.correct_answer && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {isAnswerSubmitted && selectedAnswer === key && key !== currentQuestion.correct_answer && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {isAnswerSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted p-4 rounded-lg"
                      >
                        <h4 className="font-medium mb-2">Explanation:</h4>
                        <p>{currentQuestion.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm">
                  Score: {score}/{currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                </div>
                {!isAnswerSubmitted ? (
                  <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>You've completed the {quiz.title}. Here's how you did:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-muted-foreground">
                    {score === questions.length
                      ? "Perfect score! Excellent work!"
                      : score >= questions.length * 0.8
                        ? "Great job! You've mastered this topic."
                        : score >= questions.length * 0.6
                          ? "Good work! You're on the right track."
                          : "Keep practicing to improve your knowledge."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Question Summary:</h3>
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        userAnswers[index] === question.correct_answer
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          {userAnswers[index] === question.correct_answer ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your answer: {question.options[userAnswers[index]]}
                          </p>
                          {userAnswers[index] !== question.correct_answer && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Correct answer: {question.options[question.correct_answer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => router.push("/quiz")} className="w-full sm:w-auto">
                  Back to Quizzes
                </Button>
                <Button
                  onClick={() => {
                    setCurrentQuestionIndex(0)
                    setSelectedAnswer(null)
                    setIsAnswerSubmitted(false)
                    setScore(0)
                    setUserAnswers({})
                    setQuizCompleted(false)
                    setStartTime(Date.now())
                  }}
                  className="w-full sm:w-auto"
                >
                  Retry Quiz
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

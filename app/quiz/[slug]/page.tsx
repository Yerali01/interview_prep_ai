"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { firebaseGetQuizBySlug, firebaseSaveQuizResult, type QuizQuestion } from "@/lib/firebase-service-fixed"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const slug = params?.slug as string

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [savingResult, setSavingResult] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!slug) {
          setError("Quiz not found")
          setLoading(false)
          return
        }

        console.log("🔥 Fetching quiz from Firebase with slug:", slug)
        const quizData = await firebaseGetQuizBySlug(slug)
        console.log("🔥 Firebase quiz data received:", quizData)

        if (!quizData) {
          setError("Quiz not found in Firebase")
        } else if (!quizData.questions || quizData.questions.length === 0) {
          setError("This quiz has no questions yet")
        } else {
          setQuiz(quizData)
        }
      } catch (error) {
        console.error("❌ Error fetching quiz from Firebase:", error)
        setError("Failed to load quiz from Firebase")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [slug])

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const wasCorrectBefore = selectedAnswers[currentQuestionIndex] === currentQuestion.correct_answer
    const isCorrectNow = answer === currentQuestion.correct_answer

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    })

    // Update correctAnswersCount based on the change
    setCorrectAnswersCount((prevCount) => {
      if (wasCorrectBefore && !isCorrectNow) {
        return prevCount - 1 // Was correct, now wrong
      } else if (!wasCorrectBefore && isCorrectNow) {
        return prevCount + 1 // Was wrong, now correct
      }
      return prevCount // No change in correctness
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    } else {
      // Calculate final score based on all selected answers
      const finalCorrectCount = quiz.questions.reduce((count: number, question: QuizQuestion, index: number) => {
        return selectedAnswers[index] === question.correct_answer ? count + 1 : count
      }, 0)

      const finalScore = Math.round((finalCorrectCount / quiz.questions.length) * 100)
      setCorrectAnswersCount(finalCorrectCount)
      setScore(finalScore)
      setQuizCompleted(true)

      // Try to save result if user is logged in
      saveResult(finalScore)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowExplanation(false)
    }
  }

  const saveResult = async (finalScore: number) => {
    try {
      setSavingResult(true)

      if (user) {
        console.log("🔥 Saving quiz result to Firebase...")
        await firebaseSaveQuizResult(user.id, quiz.id, finalScore, quiz.questions.length)

        toast({
          title: "Quiz result saved",
          description: "Your score has been saved to Firebase.",
        })
      }
    } catch (error) {
      console.error("❌ Error saving quiz result to Firebase:", error)
      toast({
        title: "Error saving result",
        description: "There was a problem saving your quiz result to Firebase.",
        variant: "destructive",
      })
    } finally {
      setSavingResult(false)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setShowExplanation(false)
    setCorrectAnswersCount(0)
  }

  const handleBackToQuizzes = () => {
    router.push("/quiz")
  }

  const handleShowExplanation = () => {
    setShowExplanation(true)
  }

  if (loading) {
    return <QuizSkeleton />
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/quiz">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Quiz Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {error || "The quiz you're looking for doesn't exist in Firebase or has been moved."}
          </p>
          <Button asChild>
            <Link href="/quiz">Browse All Quizzes</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined
  const isCorrect = isAnswered && selectedAnswers[currentQuestionIndex] === currentQuestion.correct_answer
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/quiz">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
          </Link>
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-xl text-muted-foreground">{quiz.description}</p>
        </div>

        {!quizCompleted ? (
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge className={getLevelColor(quiz.level)}>
                  {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

              <RadioGroup
                value={selectedAnswers[currentQuestionIndex]}
                onValueChange={handleAnswerSelect}
                className="space-y-4"
                disabled={showExplanation}
              >
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center space-x-2 p-4 rounded-md border ${
                      showExplanation && key === currentQuestion.correct_answer
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : showExplanation &&
                            key === selectedAnswers[currentQuestionIndex] &&
                            key !== currentQuestion.correct_answer
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <RadioGroupItem value={key} id={`option-${key}`} />
                    <label htmlFor={`option-${key}`} className="flex-grow text-base cursor-pointer">
                      {value as string}
                    </label>
                    {showExplanation && key === currentQuestion.correct_answer && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {showExplanation &&
                      key === selectedAnswers[currentQuestionIndex] &&
                      key !== currentQuestion.correct_answer && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </div>
                ))}
              </RadioGroup>

              {showExplanation && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                  <h3 className="font-semibold mb-2">Explanation:</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              <div className="flex gap-2">
                {!showExplanation && (
                  <Button variant="secondary" onClick={handleShowExplanation} disabled={!isAnswered}>
                    Answer
                  </Button>
                )}
                <Button onClick={handleNextQuestion} disabled={!isAnswered || !showExplanation}>
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Complete Quiz"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>
                You've completed the {quiz.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">{score}%</div>
                <p className="text-muted-foreground">
                  You answered {correctAnswersCount} out of {quiz.questions.length} questions correctly
                </p>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((question: QuizQuestion, index: number) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex items-start gap-2">
                      {selectedAnswers[index] === question.correct_answer ? (
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{question.question}</p>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm">
                            <span className="font-semibold">Your answer: </span>
                            <span
                              className={
                                selectedAnswers[index] === question.correct_answer ? "text-green-600" : "text-red-600"
                              }
                            >
                              {question.options[selectedAnswers[index]] || "Not answered"}
                            </span>
                          </div>
                          {selectedAnswers[index] !== question.correct_answer && (
                            <div className="text-sm">
                              <span className="font-semibold">Correct answer: </span>
                              <span className="text-green-600">{question.options[question.correct_answer]}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className="font-semibold text-sm">Explanation:</h3>
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBackToQuizzes}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
              </Button>
              <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function QuizSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
        </Button>
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-2 w-full" />
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-full mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}

function getLevelColor(level: string) {
  switch (level) {
    case "junior":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "middle":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "senior":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

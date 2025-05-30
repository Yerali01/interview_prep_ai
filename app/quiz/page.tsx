import { Suspense } from "react"
import QuizContentClient from "./quiz-content-client"
import { QuizProvider } from "@/contexts/quiz-context"

export default function QuizPage() {
  return (
    <QuizProvider>
      <Suspense fallback={<div>Loading quizzes...</div>}>
        <QuizContentClient />
      </Suspense>
    </QuizProvider>
  )
}

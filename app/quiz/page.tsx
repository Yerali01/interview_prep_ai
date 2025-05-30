import { QuizProvider } from "@/contexts/quiz-context"
import QuizContentClient from "./quiz-content-client"

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizContentClient />
    </QuizProvider>
  )
}

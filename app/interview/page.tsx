"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { type AIMessage, getAIResponse, useSpeechRecognition, INTERVIEW_SYSTEM_PROMPT } from "@/lib/ai-utils"
import { Mic, MicOff, Send, Bot, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

type InterviewLevel = "junior" | "middle" | "senior"

export default function InterviewPage() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [level, setLevel] = useState<InterviewLevel>("junior")
  const [assessment, setAssessment] = useState<string | null>(null)
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Start the interview
  const startInterview = async () => {
    setIsLoading(true)
    setIsStarted(true)
    setMessages([])
    setQuestionCount(0)
    setIsFinished(false)
    setAssessment(null)

    // Initialize with system message
    const systemMessage: AIMessage = {
      role: "system",
      content: `${INTERVIEW_SYSTEM_PROMPT}\n\nYou are conducting a ${level} level Flutter interview. Start by introducing yourself briefly and asking the first question about Flutter or Dart appropriate for a ${level} level developer.`,
    }

    try {
      const initialMessages: AIMessage[] = [systemMessage]
      const response = await getAIResponse(initialMessages)

      setMessages([...initialMessages, { role: "assistant", content: response }])

      setQuestionCount(1)
    } catch (error) {
      console.error("Error starting interview:", error)
      toast({
        title: "Error starting interview",
        description: "There was an error starting the interview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Send a message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    resetTranscript()
    setIsLoading(true)

    try {
      // Prepare context for the AI
      let promptContext = ""

      // If we're at question 10, prepare for final assessment
      if (questionCount >= 10) {
        promptContext = `This is the final question. After the user answers, provide a comprehensive assessment of their Flutter knowledge based on all their answers. Evaluate their strengths, weaknesses, and provide specific recommendations for improvement. Be honest but constructive.`
      } else {
        promptContext = `This is question #${questionCount} out of 10. After acknowledging the user's answer, ask the next question about Flutter or Dart appropriate for a ${level} level developer.`
      }

      // Add the context to the system message
      const contextMessage: AIMessage = {
        role: "system",
        content: promptContext,
      }

      // Get all messages including the system context
      const allMessages = [
        ...messages.filter((m) => m.role !== "system"), // Remove any previous system messages
        contextMessage,
        userMessage,
      ]

      const response = await getAIResponse(allMessages)

      // Add the assistant's response
      setMessages((prev) => [...prev, { role: "assistant", content: response }])

      // Increment question count
      if (questionCount < 10) {
        setQuestionCount(questionCount + 1)
      } else {
        setIsFinished(true)
        setAssessment(response)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto-scroll to the bottom of the messages container
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container")
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  return (
    <div className="container py-4 h-[calc(100vh-4rem)]">
      {!isStarted ? (
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Start a Flutter Technical Interview</CardTitle>
            <CardDescription>
              Practice your Flutter interview skills with our AI interviewer. Choose your experience level below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select your experience level:</h3>
              <RadioGroup
                value={level}
                onValueChange={(value) => setLevel(value as InterviewLevel)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="junior" id="junior" />
                  <Label htmlFor="junior" className="font-medium">
                    Junior (0-1 years)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="middle" id="middle" />
                  <Label htmlFor="middle" className="font-medium">
                    Middle (1-3 years)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="senior" id="senior" />
                  <Label htmlFor="senior" className="font-medium">
                    Senior (3+ years)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">What to expect:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>10 technical questions about Flutter and Dart</li>
                <li>Real-time feedback on your answers</li>
                <li>Comprehensive assessment of your skills at the end</li>
                <li>Questions tailored to your selected experience level</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={startInterview} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Start Interview
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Messages container - with auto-scroll */}
          <div id="messages-container" className="flex-grow overflow-y-auto bg-background">
            {messages
              .filter((m) => m.role !== "system")
              .map((message, index) => (
                <div key={index} className={`p-3 ${message.role === "assistant" ? "bg-muted" : "bg-primary/10"}`}>
                  <div className="flex items-start max-w-4xl mx-auto">
                    <div className="mr-2 mt-0.5">
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                          U
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Input area */}
          <div className="p-4 border-t bg-background">
            <div className="max-w-4xl mx-auto">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here..."
                className="min-h-[100px] resize-none mb-2"
                disabled={isLoading}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button type="button" onClick={sendMessage} disabled={!input.trim() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

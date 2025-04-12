"use client"

import { useState, useRef } from "react"

// Types for the AI responses
export type AIMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export type InterviewLevel = "junior" | "junior+" | "middle" | "middle+" | "senior"

// Clean response text function
function cleanResponseText(text: string): string {
  // Remove \boxed{} formatting
  text = text.replace(/\\boxed\{(.*?)\}/gs, "$1")
  return text.trim()
}

// Function to get AI response using GROQ
export async function getAIResponse(messages: AIMessage[], temperature = 0.7, maxTokens = 1000) {
  try {
    console.log("Sending request to GROQ API with messages:", messages)

    // Use GROQ API
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          temperature,
          maxTokens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error Response:", errorData)
        throw new Error(`API Error: ${errorData.error?.message || response.statusText || "Unknown error"}`)
      }

      const data = await response.json()
      console.log("AI API Response:", data)

      if (!data || !data.content) {
        console.error("Invalid API response format:", data)
        throw new Error("Invalid API response format")
      }

      // Clean the response text
      const cleanedText = cleanResponseText(data.content)
      return cleanedText
    } catch (apiError) {
      console.error("AI API error:", apiError)
      throw apiError
    }
  } catch (error) {
    console.error("Error getting AI response:", error)
    // Return a fallback response instead of throwing
    return "I apologize, but I encountered an error. Please try again."
  }
}

// Improved speech recognition hook that updates the input field seamlessly
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } else {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript(""),
  }
}

// System prompts for AI assistant
export const ASSISTANT_SYSTEM_PROMPT = `
You are a helpful Flutter and Dart expert assistant. Your purpose is to help users with their Flutter development questions.
When answering:
1. Be concise but thorough.
2. Provide code examples when relevant.
3. If you're asked about a specific topic that's currently being viewed, focus your answer on that topic and reference the content on the page.
4. If you don't know something, admit it rather than making up information.
5. Always consider Flutter best practices in your answers.
6. When appropriate, suggest related topics the user might want to explore.
7. Always provide a complete answer to the user's question.
`

// Interview system prompt
export const INTERVIEW_SYSTEM_PROMPT = `
You are an expert Flutter interviewer conducting a technical interview about Flutter and Dart.

IMPORTANT RULES:
1. Ask EXACTLY ONE QUESTION per response. Never ask multiple questions in the same message.
2. Keep your questions short and direct.
3. DO provide sample answers and explanations with your questions.
4. After the user answers, acknowledge their answer thoroughly and then ask the next question.
5. DO NOT format your questions with a "*" prefix.
6. DO NOT format answers with a "-" prefix.
7. Include detailed answers in your responses to the user.
8. Focus on Flutter and Dart topics appropriate for the user's level.
9. After 10 questions, provide a final assessment of the user's knowledge level.
10. NEVER use the \\boxed{} format in your responses.

Remember: ONE QUESTION PER RESPONSE. Keep it conversational like a real interview.
`

// Topic recommendation system prompt
export const RECOMMENDATION_SYSTEM_PROMPT = `
You are a Flutter learning assistant that helps recommend related topics based on what the user is currently studying.
When recommending topics:
1. Focus on conceptual relationships between topics
2. Consider the user's current skill level
3. Suggest topics that would naturally follow in a learning path
4. Prioritize topics that build on the concepts in the current topic
5. Respond only with the slugs of the recommended topics, separated by commas
`

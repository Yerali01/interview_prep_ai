"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, Bot, User } from "lucide-react"
import { type AIMessage, getAIResponse, useSpeechRecognition, ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai-utils"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AIChatProps {
  initialMessages?: AIMessage[]
  onClose?: () => void
  contextInfo?: string
  isFloating?: boolean
  isFullPage?: boolean
}

export default function AIChat({
  initialMessages = [],
  onClose,
  contextInfo = "",
  isFloating = false,
  isFullPage = false,
}: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: "system", content: ASSISTANT_SYSTEM_PROMPT + (contextInfo ? `\nCurrent context: ${contextInfo}` : "") },
    ...initialMessages,
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(messages.filter((m) => m.role !== "system").length === 0)

  // Suggested questions
  const suggestions = [
    "What are common Flutter interview questions?",
    "Explain state management in Flutter",
    "How to prepare for a Flutter technical test?",
    "What's new in Flutter 3.0?",
  ]

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async (messageText = input) => {
    if (messageText.trim() === "") return

    // Hide suggestions when user sends a message
    setShowSuggestions(false)

    // Add user message to chat
    const updatedMessages = [...messages, { role: "user", content: messageText }]
    setMessages(updatedMessages)
    setInput("")
    resetTranscript()
    setIsLoading(true)

    try {
      // Get AI response
      const aiResponse = await getAIResponse(updatedMessages)

      // Add AI response to chat
      setMessages([...updatedMessages, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error getting AI response:", error)
      // Add error message
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "I'm sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle speech recognition toggle
  const handleSpeechToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
      // Focus the input field when starting to listen
      inputRef.current?.focus()
    }
  }

  return (
    <Card className="border-0 shadow-none h-full flex flex-col">
      <CardContent className="p-4 flex-grow overflow-y-auto">
        <div className={`space-y-4 ${isFloating ? "max-h-[350px]" : isFullPage ? "max-h-[80vh]" : "max-h-[500px]"}`}>
          {showSuggestions ? (
            <div className="flex flex-col space-y-3 p-2">
              <div className="flex items-start space-x-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-assistant.png" alt="AI" />
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <p>Hi! I'm your Flutter interview assistant. How can I help you today?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-auto py-2 px-3 font-normal"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            messages
              .filter((m) => m.role !== "system")
              .map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/ai-assistant.png" alt="AI" />
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarFallback className="bg-primary">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src="/ai-assistant.png" alt="AI" />
                <AvatarFallback className="bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-lg p-3 bg-muted rounded-tl-none">
                <div className="flex space-x-2">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t">
        <div className="flex w-full space-x-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={handleSpeechToggle}
            className="flex-shrink-0 h-9 w-9 rounded-full"
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="pr-10 rounded-full pl-4 h-9"
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || input.trim() === ""}
            className="flex-shrink-0 h-9 w-9 rounded-full p-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

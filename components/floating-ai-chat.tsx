"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import AIChat from "./ai-chat"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { topics } from "@/lib/data"

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [contextInfo, setContextInfo] = useState("")
  const pathname = usePathname()

  // Update context info based on current page
  useEffect(() => {
    // Check if we're on a topic page
    if (pathname.startsWith("/topics/")) {
      const topicId = pathname.split("/").pop()
      const currentTopic = topics.find((t) => t.id === topicId)

      if (currentTopic) {
        setContextInfo(`The user is currently viewing the "${currentTopic.title}" topic. 
        This topic is about: ${currentTopic.description}. 
        The difficulty level is: ${currentTopic.level}.
        
        Key content from this topic includes:
        ${currentTopic.content.map((section) => `- ${section.title}: ${section.content.substring(0, 100)}...`).join("\n")}
        
        Summary: ${currentTopic.summary}`)
      } else {
        setContextInfo("The user is viewing the topics page.")
      }
    } else if (pathname.startsWith("/quiz/")) {
      setContextInfo("The user is taking a quiz.")
    } else if (pathname === "/topics") {
      setContextInfo("The user is browsing Flutter topics.")
    } else if (pathname === "/quiz") {
      setContextInfo("The user is browsing Flutter quizzes.")
    } else if (pathname === "/resources") {
      setContextInfo("The user is viewing Flutter resources.")
    } else if (pathname === "/interview") {
      setContextInfo("The user is on the AI interview page.")
    } else {
      setContextInfo("The user is on the Flutter Interview Prep homepage.")
    }
  }, [pathname])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-medium text-white">Flutter Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[500px] bg-card">
              <AIChat contextInfo={contextInfo} isFloating={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </>
  )
}

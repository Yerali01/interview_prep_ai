"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DartPadFABProps {
  topicSlug: string
  codeSnippets: string[]
}

export function DartPadFAB({ topicSlug, codeSnippets }: DartPadFABProps) {
  const [isHovered, setIsHovered] = useState(false)

  const openDartPad = () => {
    // Combine all code snippets into one
    const combinedCode =
      codeSnippets.length > 0
        ? codeSnippets.join("\n\n// --- Next Example ---\n\n")
        : `// ${topicSlug} - Try your Flutter code here!
void main() {
  print('Hello, Flutter!');
  
  // Add your code here
  
}`

    // Create DartPad URL with the code
    const dartPadUrl = `https://dartpad.dev/?${new URLSearchParams({
      id: "",
      theme: "dark",
      run: "true",
      split: "60",
    }).toString()}`

    // Open DartPad in a new tab
    const newWindow = window.open(dartPadUrl, "_blank")

    // Try to set the code content (this might not work due to CORS, but we'll provide instructions)
    if (newWindow) {
      // Store the code in localStorage so we can show instructions
      localStorage.setItem("dartpad-code", combinedCode)

      // Show a brief instruction
      setTimeout(() => {
        if (
          confirm("DartPad opened in a new tab. Would you like to copy the code to your clipboard to paste it there?")
        ) {
          navigator.clipboard
            .writeText(combinedCode)
            .then(() => {
              alert("Code copied to clipboard! Paste it in DartPad and click Run.")
            })
            .catch(() => {
              // Fallback for older browsers
              const textArea = document.createElement("textarea")
              textArea.value = combinedCode
              document.body.appendChild(textArea)
              textArea.select()
              document.execCommand("copy")
              document.body.removeChild(textArea)
              alert("Code copied to clipboard! Paste it in DartPad and click Run.")
            })
        }
      }, 1000)
    }
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={openDartPad}
          size="lg"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              Try it yourself
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

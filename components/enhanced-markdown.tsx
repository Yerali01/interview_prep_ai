"use client"

import React, { useMemo } from "react"
import Markdown from "react-markdown"
import type { Definition } from "@/lib/supabase"
import { DefinitionTooltip } from "./definition-tooltip"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Play } from "lucide-react"

interface EnhancedMarkdownProps {
  content: string
  definitions: Definition[]
}

export function EnhancedMarkdown({ content, definitions }: EnhancedMarkdownProps) {
  const { toast } = useToast()

  const definitionsMap = useMemo(() => {
    const map = new Map<string, Definition>()
    definitions.forEach((def: Definition) => {
      map.set(def.term.toLowerCase(), def)
    })
    return map
  }, [definitions])

  // Function to add tooltips to any text
  const addTooltips = (text: string, isCode = false): React.ReactNode => {
    if (!text || typeof text !== "string") return text

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return text

    const sortedTerms = terms.sort((a, b) => b.length - a.length)
    const pattern = new RegExp(
      `(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi",
    )

    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const definition = definitionsMap.get(part.toLowerCase())

      if (definition && pattern.test(part)) {
        return (
          <DefinitionTooltip key={`${index}-${part}`} term={part} definition={definition}>
            <span
              className={
                isCode ? "border-b border-dotted border-blue-400 cursor-help hover:border-blue-600" : "cursor-help"
              }
            >
              {part}
            </span>
          </DefinitionTooltip>
        )
      }
      return part
    })
  }

  // Function to prepare code for DartPad
  const prepareCodeForDartPad = (code: string): string => {
    const cleanCode = code.trim()

    // Check if it's already a complete program
    if (cleanCode.includes("void main(") || cleanCode.includes("main(")) {
      return cleanCode
    }

    // Check if it's a class definition
    if (cleanCode.includes("class ") && !cleanCode.includes("void main(")) {
      return `${cleanCode}

void main() {
  // Example usage - modify as needed
  print('Code is ready to run!');
}`
    }

    // Check if it's function definitions
    if (cleanCode.includes("Future<") || cleanCode.includes("Stream<") || cleanCode.includes("async")) {
      return `${cleanCode}

void main() async {
  // Example usage - modify as needed
  print('Async code is ready to run!');
}`
    }

    // For simple expressions or statements, wrap in main
    return `void main() {
  ${cleanCode}
}`
  }

  const openDartPad = (code: string) => {
    console.log("🚀 Opening DartPad with code:", code)

    // Prepare the code to be runnable
    const runnableCode = prepareCodeForDartPad(code)
    console.log("📝 Prepared code:", runnableCode)

    // Show warning toast first
    toast({
      title: "Opening DartPad...",
      description: "Code will be copied to your clipboard. Paste it in DartPad and click Run.",
      duration: 3000,
    })

    // Copy to clipboard
    navigator.clipboard
      .writeText(runnableCode)
      .then(() => {
        console.log("✅ Code copied to clipboard")

        // Open DartPad after a short delay
        setTimeout(() => {
          const dartPadWindow = window.open("https://dartpad.dev/", "_blank")

          if (dartPadWindow) {
            console.log("✅ DartPad opened successfully")
            toast({
              title: "✅ Ready to Code!",
              description:
                "1. Paste the code (Ctrl+V or Cmd+V)\n2. Click the blue 'Run' button\n3. See the output below!",
              duration: 8000,
            })
          } else {
            console.log("❌ Failed to open DartPad")
            toast({
              title: "❌ Popup Blocked",
              description: "Please allow popups for this site, then try again.",
              variant: "destructive",
            })
          }
        }, 1000)
      })
      .catch(() => {
        console.log("❌ Failed to copy to clipboard")
        toast({
          title: "❌ Copy Failed",
          description: "Please copy the code manually and open dartpad.dev",
          variant: "destructive",
        })
      })
  }

  const copyCode = (code: string) => {
    const runnableCode = prepareCodeForDartPad(code)

    navigator.clipboard
      .writeText(runnableCode)
      .then(() => {
        toast({
          title: "📋 Code Copied!",
          description: "Ready-to-run code copied to clipboard",
          duration: 3000,
        })
      })
      .catch(() => {
        toast({
          title: "❌ Copy Failed",
          description: "Please copy the code manually",
          variant: "destructive",
        })
      })
  }

  const components = {
    p: ({ children, ...props }: any) => (
      <p {...props}>{typeof children === "string" ? addTooltips(children) : children}</p>
    ),

    code: ({ children, className, ...props }: any) => {
      const isInlineCode = !className?.includes("language-")

      if (isInlineCode && typeof children === "string") {
        return (
          <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
            {addTooltips(children, true)}
          </code>
        )
      }

      return <code {...props}>{children}</code>
    },

    pre: ({ children, ...props }: any) => {
      // Extract code content
      let codeContent = ""

      React.Children.forEach(children, (child: any) => {
        if (child?.type === "code" && typeof child.props?.children === "string") {
          codeContent = child.props.children
        }
      })

      if (!codeContent) {
        return <pre {...props}>{children}</pre>
      }

      console.log("📝 Processing code block:", codeContent.substring(0, 50) + "...")

      // Process code with tooltips
      const processedCode = addTooltips(codeContent, true)

      return (
        <div className="my-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Example</span>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    copyCode(codeContent)
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Code */}
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto m-0 border-l-4 border-green-500">
                <code className="language-dart">{processedCode}</code>
              </pre>
            </div>

            {/* Button */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("🔥 BUTTON CLICKED!")
                  openDartPad(codeContent)
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm flex items-center gap-2"
                type="button"
              >
                <Play className="h-4 w-4" />
                Try it Yourself »
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 This will copy ready-to-run code to your clipboard and open DartPad
              </p>
            </div>
          </div>
        </div>
      )
    },
  }

  return (
    <div className="enhanced-markdown">
      <Markdown components={components}>{content}</Markdown>
    </div>
  )
}

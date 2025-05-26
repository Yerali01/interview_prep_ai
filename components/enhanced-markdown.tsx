"use client"

import React, { useMemo } from "react"
import Markdown from "react-markdown"
import type { Definition } from "@/lib/supabase"
import { DefinitionTooltip } from "./definition-tooltip"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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

  const openDartPad = (code: string) => {
    console.log("🚀 Opening DartPad with code:", code)

    // Copy to clipboard
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("✅ Code copied to clipboard")

        // Open DartPad
        const dartPadWindow = window.open("https://dartpad.dev/", "_blank")

        if (dartPadWindow) {
          console.log("✅ DartPad opened successfully")
          toast({
            title: "DartPad Opened!",
            description: "Code copied to clipboard. Paste it in DartPad (Ctrl+V) and click Run.",
            duration: 5000,
          })
        } else {
          console.log("❌ Failed to open DartPad")
          toast({
            title: "Popup Blocked",
            description: "Please allow popups and try again.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        console.log("❌ Failed to copy to clipboard")
        toast({
          title: "Manual Copy Required",
          description: "Please copy the code manually and open dartpad.dev",
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
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Example</span>
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
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm"
                type="button"
              >
                Try it Yourself »
              </Button>
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

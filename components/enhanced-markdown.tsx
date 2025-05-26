"use client"

import React from "react"
import { useMemo } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import type { Definition } from "@/lib/supabase"
import { DefinitionTooltip } from "./definition-tooltip"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface EnhancedMarkdownProps {
  content: string
  definitions: Definition[]
}

export function EnhancedMarkdown({ content, definitions }: EnhancedMarkdownProps) {
  const { toast } = useToast()

  // Create a map of terms to definitions for quick lookup
  const definitionsMap = useMemo(() => {
    const map = new Map<string, Definition>()
    definitions.forEach((def: Definition) => {
      map.set(def.term.toLowerCase(), def)
    })
    return map
  }, [definitions])

  // Function to wrap defined terms with tooltips
  const enhanceTextWithTooltips = (text: string): React.ReactNode => {
    if (!text || typeof text !== "string") return text

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return text

    const sortedTerms = terms.sort((a, b) => b.length - a.length)
    const pattern = new RegExp(
      `\\b(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
      "gi",
    )

    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase()
      const definition = definitionsMap.get(lowerPart)

      if (definition && index % 2 === 1) {
        return (
          <DefinitionTooltip key={`${definition.id}-${index}`} term={part} definition={definition}>
            {part}
          </DefinitionTooltip>
        )
      }

      return part
    })
  }

  // Function to enhance code content with tooltips
  const enhanceCodeContent = (codeString: string): React.ReactNode => {
    if (!codeString || typeof codeString !== "string") return codeString

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return codeString

    console.log("Available terms for tooltips:", terms)
    console.log("Code to enhance:", codeString.substring(0, 100) + "...")

    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    // Create a more flexible pattern that matches terms in code
    const escapedTerms = sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

    const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi")

    console.log("Pattern:", pattern)

    const parts = codeString.split(pattern)
    console.log("Split parts:", parts.slice(0, 10))

    return parts.map((part, index) => {
      if (!part) return part

      const lowerPart = part.toLowerCase()
      const definition = definitionsMap.get(lowerPart)

      if (definition && index % 2 === 1) {
        console.log("Found tooltip term in code:", part)
        return (
          <DefinitionTooltip key={`code-${definition.id}-${index}`} term={part} definition={definition}>
            <span className="relative inline-block border-b border-dotted border-blue-400 cursor-help">{part}</span>
          </DefinitionTooltip>
        )
      }

      return part
    })
  }

  const openDartPad = (code: string) => {
    console.log("Opening DartPad with code:", code)

    try {
      // Clean the code
      const cleanCode = code.trim()

      // Create a basic Dart main function if the code doesn't have one
      let dartCode = cleanCode
      if (!cleanCode.includes("void main()") && !cleanCode.includes("main()")) {
        dartCode = `void main() {
  ${cleanCode}
}`
      }

      console.log("Final Dart code:", dartCode)

      // Open DartPad with the code
      const dartPadUrl = `https://dartpad.dev/`
      const newWindow = window.open(dartPadUrl, "_blank", "noopener,noreferrer")

      if (newWindow) {
        // Copy code to clipboard
        navigator.clipboard
          .writeText(dartCode)
          .then(() => {
            toast({
              title: "DartPad opened!",
              description: "Code copied to clipboard. Paste it in DartPad (Ctrl+V) and click Run.",
              duration: 6000,
            })
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err)
            toast({
              title: "DartPad opened",
              description: "Please copy the code manually from the code block.",
              variant: "destructive",
            })
          })
      } else {
        toast({
          title: "Popup blocked",
          description: "Please allow popups for this site to open DartPad.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error opening DartPad:", error)
      toast({
        title: "Error",
        description: "Failed to open DartPad. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Custom renderer for components
  const components = {
    p: ({ children, ...props }: any) => (
      <p {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</p>
    ),
    li: ({ children, ...props }: any) => (
      <li {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</li>
    ),
    h1: ({ children, ...props }: any) => (
      <h1 {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</h4>
    ),
    code: ({ children, className, ...props }: any) => {
      const isInlineCode = !className || !className.includes("language-")

      if (isInlineCode && typeof children === "string") {
        return (
          <code {...props} className={`${className || ""} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`}>
            {enhanceTextWithTooltips(children)}
          </code>
        )
      }

      // For code blocks, enhance with tooltips
      if (typeof children === "string") {
        return (
          <code {...props} className={className}>
            {enhanceCodeContent(children)}
          </code>
        )
      }

      return (
        <code {...props} className={className}>
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }: any) => {
      const codeElement = React.Children.toArray(children).find((child: any) => child?.type === "code") as any

      if (codeElement && typeof codeElement.props?.children === "string") {
        const codeContent = codeElement.props.children
        console.log("Pre block code content:", codeContent)

        return (
          <div className="my-6">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Code header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Example</span>
              </div>

              {/* Code content */}
              <div className="relative">
                <pre
                  {...props}
                  className="bg-gray-900 text-gray-100 p-4 overflow-x-auto m-0 border-l-4 border-green-500"
                >
                  <code className={codeElement.props.className}>{enhanceCodeContent(codeContent)}</code>
                </pre>
              </div>

              {/* Try it yourself button */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("Button clicked, code:", codeContent)
                    openDartPad(codeContent)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors"
                  type="button"
                >
                  Try it Yourself »
                </Button>
              </div>
            </div>
          </div>
        )
      }

      return <pre {...props}>{children}</pre>
    },
  }

  return (
    <div className="enhanced-markdown">
      <Markdown rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </Markdown>
    </div>
  )
}

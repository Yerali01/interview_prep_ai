"use client"

import React from "react"
import { useMemo } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
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

  // Create a map of terms to definitions for quick lookup
  const definitionsMap = useMemo(() => {
    const map = new Map<string, Definition>()
    definitions.forEach((def: Definition) => {
      map.set(def.term.toLowerCase(), def)
    })
    console.log("Definitions map created:", map)
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

  // Function to process code and add tooltips
  const processCodeWithTooltips = (codeString: string): React.ReactNode => {
    if (!codeString || typeof codeString !== "string") return codeString

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return codeString

    console.log("Processing code with tooltips:", codeString.substring(0, 100))
    console.log("Available terms:", terms)

    // Split code into tokens while preserving structure
    const lines = codeString.split("\n")

    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < lines.length - 1 ? "\n" : ""}
          </React.Fragment>
        )
      }

      // Process each line for tooltip terms
      const processedLine: React.ReactNode[] = []
      const currentIndex = 0

      // Find all matches in this line
      const sortedTerms = terms.sort((a, b) => b.length - a.length)
      const pattern = new RegExp(
        `(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        "gi",
      )

      let match
      let lastIndex = 0

      while ((match = pattern.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          processedLine.push(line.substring(lastIndex, match.index))
        }

        // Check if this is a real definition
        const matchedTerm = match[0]
        const definition = definitionsMap.get(matchedTerm.toLowerCase())

        if (definition) {
          console.log("Found tooltip term in code:", matchedTerm)
          processedLine.push(
            <DefinitionTooltip key={`${lineIndex}-${match.index}`} term={matchedTerm} definition={definition}>
              <span className="relative inline-block border-b border-dotted border-blue-400 cursor-help hover:border-blue-600">
                {matchedTerm}
              </span>
            </DefinitionTooltip>,
          )
        } else {
          processedLine.push(matchedTerm)
        }

        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < line.length) {
        processedLine.push(line.substring(lastIndex))
      }

      // If no matches found, just return the line
      if (processedLine.length === 0) {
        processedLine.push(line)
      }

      return (
        <React.Fragment key={lineIndex}>
          {processedLine}
          {lineIndex < lines.length - 1 ? "\n" : ""}
        </React.Fragment>
      )
    })
  }

  const openDartPad = async (code: string) => {
    console.log("=== DartPad Button Clicked ===")
    console.log("Code to open:", code)

    try {
      // Clean the code
      const cleanCode = code.trim()
      console.log("Clean code:", cleanCode)

      // Prepare Dart code
      let dartCode = cleanCode
      if (!cleanCode.includes("void main()") && !cleanCode.includes("main()")) {
        dartCode = `void main() {\n  ${cleanCode}\n}`
      }

      console.log("Final Dart code:", dartCode)

      // Copy to clipboard first
      try {
        await navigator.clipboard.writeText(dartCode)
        console.log("Code copied to clipboard successfully")
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError)
      }

      // Open DartPad
      const dartPadUrl = "https://dartpad.dev/"
      console.log("Opening DartPad URL:", dartPadUrl)

      const newWindow = window.open(dartPadUrl, "_blank", "noopener,noreferrer")
      console.log("Window opened:", !!newWindow)

      if (newWindow) {
        toast({
          title: "DartPad Opened!",
          description: "Code copied to clipboard. Paste it in DartPad (Ctrl+V) and click Run.",
          duration: 8000,
        })
      } else {
        console.error("Failed to open window - popup blocked")
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site to open DartPad.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in openDartPad:", error)
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

      return (
        <code {...props} className={className}>
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }: any) => {
      // Extract code content
      let codeContent = ""
      let codeClassName = ""

      React.Children.forEach(children, (child: any) => {
        if (child?.type === "code") {
          codeContent = child.props?.children || ""
          codeClassName = child.props?.className || ""
        }
      })

      console.log("Pre block detected with code:", codeContent.substring(0, 100))

      if (codeContent) {
        return (
          <div className="my-6">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Code header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Example</span>
              </div>

              {/* Code content with tooltips */}
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto m-0 border-l-4 border-green-500">
                  <code className={codeClassName}>{processCodeWithTooltips(codeContent)}</code>
                </pre>
              </div>

              {/* Try it yourself button */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <Button
                  onClick={() => {
                    console.log("=== BUTTON CLICKED ===")
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

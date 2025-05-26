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
    definitions.forEach((def) => {
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

  // Function to enhance code content with tooltips - more aggressive matching
  const enhanceCodeContent = (codeString: string): React.ReactNode => {
    if (!codeString || typeof codeString !== "string") return codeString

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return codeString

    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    // More flexible pattern for code - matches terms even without word boundaries
    const pattern = new RegExp(
      `(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi",
    )

    const parts = codeString.split(pattern)
    const result: React.ReactNode[] = []

    parts.forEach((part, index) => {
      const lowerPart = part.toLowerCase()
      const definition = definitionsMap.get(lowerPart)

      if (definition && pattern.test(part)) {
        result.push(
          <DefinitionTooltip key={`code-${definition.id}-${index}`} term={part} definition={definition}>
            <span className="relative inline-block cursor-help border-b border-dotted border-blue-400/60 hover:border-blue-400">
              {part}
            </span>
          </DefinitionTooltip>,
        )
      } else {
        result.push(part)
      }
    })

    return result
  }

  const openDartPad = (code: string) => {
    // Clean the code - remove any extra whitespace and ensure proper formatting
    const cleanCode = code.trim()

    // Create DartPad URL with the code embedded
    const dartPadUrl = `https://dartpad.dev/?${new URLSearchParams({
      theme: "dark",
      run: "true",
      split: "60",
    }).toString()}`

    // Open DartPad in new tab
    const newWindow = window.open(dartPadUrl, "_blank")

    if (newWindow) {
      // Copy code to clipboard and show instructions
      setTimeout(() => {
        navigator.clipboard
          .writeText(cleanCode)
          .then(() => {
            toast({
              title: "Code copied to clipboard!",
              description: "DartPad opened in new tab. Paste the code (Ctrl+V) and click Run.",
              duration: 5000,
            })
          })
          .catch(() => {
            toast({
              title: "DartPad opened",
              description: "Please copy the code manually and paste it in DartPad.",
              variant: "destructive",
            })
          })
      }, 1000)
    } else {
      toast({
        title: "Popup blocked",
        description: "Please allow popups for this site to open DartPad.",
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
      const codeElement = React.Children.toArray(children).find((child: any) => child?.type === "code") as any

      if (codeElement && typeof codeElement.props?.children === "string") {
        const codeContent = codeElement.props.children
        const enhancedCode = enhanceCodeContent(codeContent)

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
                  <code className={codeElement.props.className}>{enhancedCode}</code>
                </pre>
              </div>

              {/* Try it yourself button */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <Button
                  onClick={() => openDartPad(codeContent)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm"
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
    <Markdown rehypePlugins={[rehypeHighlight]} components={components}>
      {content}
    </Markdown>
  )
}

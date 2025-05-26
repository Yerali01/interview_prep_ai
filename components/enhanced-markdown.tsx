"use client"

import React from "react"

import { useMemo } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import type { Definition } from "@/lib/supabase"
import { DefinitionTooltip } from "./definition-tooltip"

interface EnhancedMarkdownProps {
  content: string
  definitions: Definition[]
}

export function EnhancedMarkdown({ content, definitions }: EnhancedMarkdownProps) {
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

    // Create a regex pattern that matches any of our defined terms
    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return text

    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    // Create regex pattern with word boundaries
    const pattern = new RegExp(
      `\\b(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
      "gi",
    )

    const parts = text.split(pattern)

    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase()
      const definition = definitionsMap.get(lowerPart)

      if (definition && index % 2 === 1) {
        // This is a matched term
        return (
          <DefinitionTooltip key={`${definition.id}-${index}`} term={part} definition={definition}>
            {part}
          </DefinitionTooltip>
        )
      }

      return part
    })
  }

  // Enhanced code component that adds tooltips to code content
  const enhanceCodeWithTooltips = (codeString: string): React.ReactNode => {
    if (!codeString || typeof codeString !== "string") return codeString

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return codeString

    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    // Create regex pattern for code - more flexible matching
    const pattern = new RegExp(
      `(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi",
    )

    const parts = codeString.split(pattern)

    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase()
      const definition = definitionsMap.get(lowerPart)

      if (definition && index % 2 === 1) {
        // This is a matched term in code
        return (
          <DefinitionTooltip key={`code-${definition.id}-${index}`} term={part} definition={definition}>
            <span className="relative inline-block">
              {part}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 opacity-50"></span>
            </span>
          </DefinitionTooltip>
        )
      }

      return part
    })
  }

  // Custom renderer for text nodes and code
  const components = {
    // Handle text in paragraphs
    p: ({ children, ...props }: any) => (
      <p {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</p>
    ),
    // Handle text in list items
    li: ({ children, ...props }: any) => (
      <li {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</li>
    ),
    // Handle text in headings
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
    // Handle inline code
    code: ({ children, className, ...props }: any) => {
      const isInlineCode = !className || !className.includes("language-")

      if (isInlineCode && typeof children === "string") {
        return (
          <code {...props} className={`${className || ""} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`}>
            {enhanceCodeWithTooltips(children)}
          </code>
        )
      }

      return (
        <code {...props} className={className}>
          {children}
        </code>
      )
    },
    // Handle code blocks
    pre: ({ children, ...props }: any) => {
      // Extract the code content from the pre element
      const codeElement = React.Children.toArray(children).find((child: any) => child?.type === "code") as any

      if (codeElement && typeof codeElement.props?.children === "string") {
        const enhancedCode = enhanceCodeWithTooltips(codeElement.props.children)

        return (
          <pre {...props} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className={codeElement.props.className}>{enhancedCode}</code>
          </pre>
        )
      }

      return <pre {...props}>{children}</pre>
    },
    // Handle text in other elements
    text: ({ children }: any) => {
      if (typeof children === "string") {
        return enhanceTextWithTooltips(children)
      }
      return children
    },
  }

  return (
    <Markdown rehypePlugins={[rehypeHighlight]} components={components}>
      {content}
    </Markdown>
  )
}

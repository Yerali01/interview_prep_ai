"use client"

import type React from "react"

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

  // Custom renderer for text nodes
  const components = {
    // Handle text in paragraphs
    p: ({ children, ...props }: any) => (
      <p {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</p>
    ),
    // Handle text in list items
    li: ({ children, ...props }: any) => (
      <li {...props}>{typeof children === "string" ? enhanceTextWithTooltips(children) : children}</li>
    ),
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

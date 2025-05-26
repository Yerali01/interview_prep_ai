"use client"

import React from "react"
import { useMemo } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import type { Definition } from "@/lib/supabase"
import { DefinitionTooltip } from "./definition-tooltip"
import { Button } from "@/components/ui/button"
import { Play, Copy } from "lucide-react"
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

  // Function to enhance code content with tooltips
  const enhanceCodeContent = (codeString: string): React.ReactNode[] => {
    if (!codeString || typeof codeString !== "string") return [codeString]

    const terms = Array.from(definitionsMap.keys())
    if (terms.length === 0) return [codeString]

    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    // Split by lines first to preserve code structure
    const lines = codeString.split("\n")

    return lines.map((line, lineIndex) => {
      if (!line.trim())
        return (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < lines.length - 1 ? "\n" : ""}
          </React.Fragment>
        )

      // Create pattern for this line
      const pattern = new RegExp(
        `(${sortedTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        "gi",
      )

      const parts = line.split(pattern)
      const enhancedLine = parts.map((part, partIndex) => {
        const lowerPart = part.toLowerCase()
        const definition = definitionsMap.get(lowerPart)

        if (definition && pattern.test(part)) {
          return (
            <DefinitionTooltip key={`${lineIndex}-${partIndex}`} term={part} definition={definition}>
              <span className="relative">
                {part}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400/30"></span>
              </span>
            </DefinitionTooltip>
          )
        }

        return part
      })

      return (
        <React.Fragment key={lineIndex}>
          {enhancedLine}
          {lineIndex < lines.length - 1 ? "\n" : ""}
        </React.Fragment>
      )
    })
  }

  const openDartPad = (code: string) => {
    const dartPadUrl = `https://dartpad.dev/?${new URLSearchParams({
      theme: "dark",
      run: "true",
      split: "60",
    }).toString()}`

    const newWindow = window.open(dartPadUrl, "_blank")

    if (newWindow) {
      setTimeout(() => {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            toast({
              title: "Code copied!",
              description: "Code copied to clipboard. Paste it in DartPad and click Run.",
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
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Code copied to clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy code to clipboard.",
          variant: "destructive",
        })
      })
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
          <div className="relative group">
            <pre {...props} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto pr-24">
              <code className={codeElement.props.className}>{enhancedCode}</code>
            </pre>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyCode(codeContent)}
                className="h-8 w-8 p-0"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => openDartPad(codeContent)}
                className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                title="Try in DartPad"
              >
                <Play className="h-4 w-4" />
              </Button>
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

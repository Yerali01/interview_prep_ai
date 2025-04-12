"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

interface OptimizedCodeBlockProps {
  code: string
  language: string
  fileName?: string
  showLineNumbers?: boolean
  className?: string
}

export function OptimizedCodeBlock({
  code,
  language,
  fileName,
  showLineNumbers = true,
  className,
}: OptimizedCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  // Lazy load syntax highlighting
  useEffect(() => {
    if (!isHighlighted && codeRef.current) {
      import("highlight.js").then((hljs) => {
        if (codeRef.current) {
          hljs.default.highlightElement(codeRef.current)
          setIsHighlighted(true)
        }
      })
    }
  }, [isHighlighted])

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      {fileName && (
        <div className="bg-muted px-4 py-2 border-b text-sm font-mono text-muted-foreground">{fileName}</div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-2 rounded-md bg-background/80 hover:bg-background transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre
          ref={codeRef}
          className={cn("p-4 text-sm overflow-x-auto", showLineNumbers && "line-numbers", `language-${language}`)}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}

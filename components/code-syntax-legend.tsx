"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// VS Code-like syntax highlighting colors - same as in definition-tooltip.tsx
const categoryColors: Record<string, string> = {
  "Flutter Widgets": "#4EC9B0", // teal (like classes/types)
  "Flutter Concepts": "#9CDCFE", // light blue (like variables)
  "Dart Concepts": "#C586C0", // pinkish purple (like keywords)
  "State Management": "#DCDCAA", // light yellow (like functions)
  "Flutter Navigation": "#CE9178", // orange-brown (like strings)
  "Flutter Graphics": "#6A9955", // green (like comments)
  "Flutter Animations": "#BB9AF7", // light purple
  "Flutter Development": "#569CD6", // blue (like keywords)
}

export function CodeSyntaxLegend() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Info className="h-3.5 w-3.5" />
        <span>Syntax Highlighting</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium">Color Legend</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">
            Terms are highlighted based on their category, similar to VS Code syntax highlighting.
          </p>
          <div className="space-y-1.5">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-xs" style={{ color }}>
                  {category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

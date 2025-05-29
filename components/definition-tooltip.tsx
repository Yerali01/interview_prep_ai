"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Definition } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

// VS Code-like syntax highlighting colors
const categoryColors: Record<string, string> = {
  "Flutter Widgets": "#4EC9B0", // teal (like classes/types)
  "Flutter Concepts": "#9CDCFE", // light blue (like variables)
  "Dart Concepts": "#C586C0", // pinkish purple (like keywords)
  "State Management": "#DCDCAA", // light yellow (like functions)
  "Flutter Navigation": "#CE9178", // orange-brown (like strings)
  "Flutter Graphics": "#6A9955", // green (like comments)
  "Flutter Animations": "#BB9AF7", // light purple
  "Flutter Development": "#569CD6", // blue (like keywords)
  // Default color if category doesn't match
  default: "#9CDCFE", // light blue
}

interface DefinitionTooltipProps {
  term: string
  definition: Definition
  children: React.ReactNode
}

export function DefinitionTooltip({ term, definition, children }: DefinitionTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Find the nearest scrollable container (code block container)
      const container = triggerRef.current.closest(".code-container, pre, .enhanced-markdown")
      let containerRect = container?.getBoundingClientRect()

      // If no specific container found, use viewport
      if (!containerRect) {
        containerRect = {
          left: 20,
          right: viewportWidth - 20,
          top: 20,
          bottom: viewportHeight - 20,
          width: viewportWidth - 40,
          height: viewportHeight - 40,
        }
      }

      let x = triggerRect.left + triggerRect.width / 2
      let y = triggerRect.top - 10

      // Adjust horizontal position to stay within container
      const tooltipHalfWidth = tooltipRect.width / 2
      if (x + tooltipHalfWidth > containerRect.right - 10) {
        x = containerRect.right - tooltipHalfWidth - 10
      } else if (x - tooltipHalfWidth < containerRect.left + 10) {
        x = containerRect.left + tooltipHalfWidth + 10
      }

      // Adjust vertical position if tooltip would go off-screen or outside container
      if (y - tooltipRect.height < containerRect.top + 10) {
        y = triggerRect.bottom + 10
      }

      // Ensure tooltip doesn't go below container bottom
      if (y + tooltipRect.height > containerRect.bottom - 10) {
        y = triggerRect.top - tooltipRect.height - 10
      }

      setPosition({ x, y })
    }
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener("scroll", updatePosition)
      window.addEventListener("resize", updatePosition)

      return () => {
        window.removeEventListener("scroll", updatePosition)
        window.removeEventListener("resize", updatePosition)
      }
    }
  }, [isVisible])

  // Get the color based on the term's category
  const getColor = () => {
    if (!definition.category) return categoryColors.default
    return categoryColors[definition.category] || categoryColors.default
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="relative cursor-help font-medium transition-colors"
        style={{ color: getColor() }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${definition.id}`}
      >
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            id={`tooltip-${definition.id}`}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 max-w-sm p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-gray-100 tooltip-container"
            style={{
              left: position.x,
              top: position.y,
              transform: "translateX(-50%) translateY(-100%)",
              maxWidth: "min(300px, 90vw)", // Responsive max width
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-100">{definition.term}</h4>
                {definition.category && (
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getColor()}20`, // 20% opacity version of the color
                      color: getColor(),
                    }}
                  >
                    {definition.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{definition.definition}</p>
            </div>

            {/* Arrow pointing to the trigger */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 -mt-1"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

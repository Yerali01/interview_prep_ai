"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Definition } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

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

      let x = triggerRect.left + triggerRect.width / 2
      let y = triggerRect.top - 10

      // Adjust horizontal position if tooltip would go off-screen
      if (x + tooltipRect.width / 2 > viewportWidth - 20) {
        x = viewportWidth - tooltipRect.width / 2 - 20
      } else if (x - tooltipRect.width / 2 < 20) {
        x = tooltipRect.width / 2 + 20
      }

      // Adjust vertical position if tooltip would go off-screen
      if (y - tooltipRect.height < 20) {
        y = triggerRect.bottom + 10
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

  return (
    <>
      <span
        ref={triggerRef}
        className="relative cursor-help border-b border-dotted border-blue-500 text-blue-600 dark:text-blue-400 hover:border-blue-700 dark:hover:border-blue-300 transition-colors"
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
            className="fixed z-50 max-w-sm p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            style={{
              left: position.x,
              top: position.y,
              transform: "translateX(-50%) translateY(-100%)",
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{definition.term}</h4>
                {definition.category && (
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {definition.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{definition.definition}</p>
            </div>

            {/* Arrow pointing to the trigger */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200 dark:border-t-gray-700"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800 -mt-1"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

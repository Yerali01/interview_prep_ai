"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface LazyContentProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  placeholder?: React.ReactNode
}

export function LazyContent({
  children,
  className,
  threshold = 0.1,
  placeholder = <div className="h-40 w-full animate-pulse bg-muted/20 rounded-lg" />,
}: LazyContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <div ref={ref} className={cn(className)}>
      {isVisible ? children : placeholder}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

export function ThirdPartyScripts() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Use intersection observer to load scripts when user scrolls near the bottom
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Delay loading non-critical scripts
          const timer = setTimeout(() => {
            setIsVisible(true)
          }, 5000) // 5 seconds after user scrolls to bottom
          return () => clearTimeout(timer)
        }
      },
      { threshold: 0.1 },
    )

    // Observe the footer element
    const footer = document.querySelector("footer")
    if (footer) {
      observer.observe(footer)
    }

    return () => {
      if (footer) {
        observer.unobserve(footer)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Add your third-party scripts here */}
      <Script
        src="https://example.com/analytics.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Script loaded")}
      />
    </>
  )
}

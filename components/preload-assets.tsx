"use client"

import { useEffect } from "react"

// List of critical assets to preload
const CRITICAL_ASSETS = [
  // Add your critical CSS, fonts, and images here
  "/static/fonts/inter-var.woff2",
  "/flutter-logo.png",
]

export function PreloadAssets() {
  useEffect(() => {
    // Only run in production to avoid development overhead
    if (process.env.NODE_ENV !== "production") return

    // Preload critical assets
    CRITICAL_ASSETS.forEach((asset) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = asset

      // Set appropriate 'as' attribute based on file extension
      if (asset.endsWith(".css")) {
        link.as = "style"
      } else if (asset.endsWith(".woff2") || asset.endsWith(".woff") || asset.endsWith(".ttf")) {
        link.as = "font"
        link.crossOrigin = "anonymous"
      } else if (
        asset.endsWith(".jpg") ||
        asset.endsWith(".png") ||
        asset.endsWith(".webp") ||
        asset.endsWith(".svg")
      ) {
        link.as = "image"
      } else if (asset.endsWith(".js")) {
        link.as = "script"
      }

      document.head.appendChild(link)
    })

    // Preconnect to external domains
    const domains = ["https://www.donationalerts.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]

    domains.forEach((domain) => {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = domain
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })
  }, [])

  return null
}

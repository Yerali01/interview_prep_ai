"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useOptimizedFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(url, {
          ...options,
          signal,
          headers: {
            ...options?.headers,
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        // Properly handle the unknown error type
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err)
        } else if (typeof err === "string") {
          setError(new Error(err))
        } else if (err !== null && typeof err === "object" && "name" in err && err.name !== "AbortError") {
          setError(err instanceof Error ? err : new Error(String(err)))
        } else if (!(err instanceof Error) || err.name !== "AbortError") {
          setError(new Error(String(err)))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [url, router])

  return { data, error, loading }
}

import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

// Make all auth pages dynamic
export const dynamic = "force-dynamic"

"use client"

import Link from "next/link"

// This is a server component that doesn't use any client-side hooks
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you
              entered the wrong URL.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return Home
              </Link>
              <div className="text-sm text-muted-foreground">
                <Link href="/topics" className="hover:underline">
                  Topics
                </Link>
                {" • "}
                <Link href="/quiz" className="hover:underline">
                  Quizzes
                </Link>
                {" • "}
                <Link href="/projects" className="hover:underline">
                  Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          }
        `}</style>
      </body>
    </html>
  )
}

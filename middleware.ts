import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add strong caching for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.includes(".png") ||
    request.nextUrl.pathname.includes(".jpg") ||
    request.nextUrl.pathname.includes(".svg") ||
    request.nextUrl.pathname.includes(".ico")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  // Add caching for fonts
  if (request.nextUrl.pathname.includes("/_next/static/media")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  // Add reasonable caching for API routes that don't change frequently
  if (request.nextUrl.pathname.startsWith("/api/static-data")) {
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=60")
  }

  return response
}

export const config = {
  matcher: ["/((?!api/dynamic|_next/webpack|_next/data).*)"],
}

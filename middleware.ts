import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Add strong caching for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.includes(".png") ||
    request.nextUrl.pathname.includes(".jpg") ||
    request.nextUrl.pathname.includes(".svg") ||
    request.nextUrl.pathname.includes(".ico")
  ) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Add caching for fonts
  if (request.nextUrl.pathname.includes("/_next/static/media")) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Add reasonable caching for API routes that don't change frequently
  if (request.nextUrl.pathname.startsWith("/api/static-data")) {
    res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=60");
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

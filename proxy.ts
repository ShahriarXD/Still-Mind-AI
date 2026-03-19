import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only protect /dashboard routes. Client-side auth handles all other redirects.
// Doing more here (e.g. redirecting /login when cookie exists) risks redirect loops
// if the cookie becomes stale.
export function proxy(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

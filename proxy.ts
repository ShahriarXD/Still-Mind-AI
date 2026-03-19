import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep middleware pass-through. Client-side auth already protects dashboard routes,
// and cookie-gated redirects here can delay navigation after sign-in.
export function proxy(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

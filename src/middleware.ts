import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Both /clases and /admin handle their own auth state via Firebase client-side.
// No server-side redirect is needed — each page shows a login form when unauthenticated.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

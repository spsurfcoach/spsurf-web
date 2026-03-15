import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/clases", "/admin"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get("sp_auth")?.value;
  if (authCookie) return NextResponse.next();

  const redirectUrl = new URL("/", request.url);
  redirectUrl.searchParams.set("login", "required");
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/clases/:path*", "/admin/:path*"],
};

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Check for access key cookie
  const hasAccessKey = req.cookies.get("barbs-access-key")?.value === "granted";

  // Public paths that don't require anything
  const publicPaths = ["/gate", "/api/auth"];
  const isPublic = publicPaths.some((p) => nextUrl.pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // If no access key, redirect to gate
  if (!hasAccessKey) {
    return NextResponse.redirect(new URL("/gate", nextUrl));
  }

  // Login page - if already logged in, redirect to home
  if (nextUrl.pathname === "/login") {
    if (isLoggedIn) return NextResponse.redirect(new URL("/", nextUrl));
    return NextResponse.next();
  }

  // API routes pass through (they check auth individually if needed)
  if (nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // All other pages require login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.png$).*)"],
};

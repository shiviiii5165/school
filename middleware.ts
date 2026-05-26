import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  // Public routes that never need auth
  const isAuthRoute = pathname.startsWith("/login");
  const isPublicRoute = pathname === "/" || pathname === "/403" || pathname === "/forgot-password";

  if (isAuthRoute) {
    if (isLoggedIn && role) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, req.url));
    }
    return NextResponse.next();
  }

  // Allow /403 and /forgot-password to render without auth checks
  if (pathname === "/403" || pathname === "/forgot-password") {
    return NextResponse.next();
  }

  if (isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in but role is missing, redirect to login to re-authenticate
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Public routes — tidak perlu login
  const publicRoutes = ["/login", "/register", "/"];
  if (publicRoutes.includes(pathname)) {
    // Kalau sudah login, redirect ke dashboard sesuai role
    if (token && role) {
      if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
      if (role === "teacher") return NextResponse.redirect(new URL("/teacher", request.url));
      return NextResponse.redirect(new URL("/student", request.url));
    }
    return NextResponse.next();
  }

  // Proteksi route — harus login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proteksi route berdasarkan role
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

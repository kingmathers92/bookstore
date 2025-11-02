import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const hasAdminCookie = req.cookies.get("admin-access-token")?.value === "true";

  // Protect admin routes
  if (isAdminRoute && !isLoginPage && !hasAdminCookie) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }

  // Prevent admin from seeing login again
  if (isLoginPage && hasAdminCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

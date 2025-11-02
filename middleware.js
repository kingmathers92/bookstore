import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const adminToken = req.cookies.get("admin-access-token");

  if (isAdminRoute && !isLoginPage && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }

  if (isLoginPage && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

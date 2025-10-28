import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("admin-access-token")?.value;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!token) return NextResponse.redirect(new URL("/admin/login", origin));
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/admin/:path*"] };

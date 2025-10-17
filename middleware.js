import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/admin")) {
    if (!token || token.user_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  if (pathname === "/" && token?.user_metadata?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

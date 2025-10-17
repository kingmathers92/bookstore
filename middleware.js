import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

export async function middleware(request) {
  const session = await getServerSession(request, authOptions);

  console.log("Middleware session:", session);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (
      !session ||
      !session.user ||
      typeof session.user.user_metadata === "undefined" ||
      session.user.user_metadata?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // applies to /admin and all sub-routes
};

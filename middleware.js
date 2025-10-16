import { NextResponse } from "next/server";
import { getServerUser } from "./lib/supabase-server";

export async function middleware(request) {
  const user = await getServerUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || user?.user_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // applies to /admin and all sub-routes
};

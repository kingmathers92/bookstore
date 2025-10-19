import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const access_token = req.cookies.get("admin-access-token")?.value;
  let user = null;

  if (access_token) {
    const { data } = await supabase.auth.getUser(access_token);
    user = data.user;
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user || user.user_metadata.role !== "admin") {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // redirect admin from / to /admin
  if (pathname === "/" && user?.user_metadata.role === "admin") {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

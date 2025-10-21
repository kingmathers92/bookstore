import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const access_token = req.cookies.get("admin-access-token")?.value;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: access_token ? `Bearer ${access_token}` : "",
      },
    },
  });

  let user = null;

  if (access_token) {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) user = data.user;
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user || user.user_metadata.role !== "admin") {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  if (pathname === "/" && user?.user_metadata.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

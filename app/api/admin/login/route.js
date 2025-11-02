import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }

  if (email !== process.env.ADMIN_EMAIL) {
    await supabase.auth.signOut();
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const res = NextResponse.json({
    success: true,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  res.cookies.set("admin-access-token", "true", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

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

  // ✅ Only allow the admin email from environment variables
  if (email !== process.env.ADMIN_EMAIL) {
    await supabase.auth.signOut();
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  // ✅ Set secure HTTP-only cookie for admin
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin-access-token", "true", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

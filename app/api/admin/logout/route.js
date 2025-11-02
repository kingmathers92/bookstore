import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  await supabase.auth.signOut();

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin-access-token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  return res;
}

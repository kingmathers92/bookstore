import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("POST request body:", body);
    const { data, error } = await supabaseAdmin.from("books").insert(body).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("PUT request body:", body);
    const { book_id, ...updates } = body;
    const { data, error } = await supabaseAdmin
      .from("books")
      .update(updates)
      .eq("book_id", book_id)
      .select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");
    const { data, error } = await supabaseAdmin.from("books").delete().eq("book_id", bookId);
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const runtime = "nodejs";

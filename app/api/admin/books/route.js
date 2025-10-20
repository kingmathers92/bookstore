import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in environment");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select("*")
    .order("book_id", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from("books").insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const id = body.book_id || body.id;
    if (!id) return NextResponse.json({ error: "Missing book id" }, { status: 400 });
    const update = { ...body };
    delete update.book_id;
    const { data, error } = await supabaseAdmin
      .from("books")
      .update(update)
      .eq("book_id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { data, error } = await supabaseAdmin.from("books").delete().eq("book_id", id);
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

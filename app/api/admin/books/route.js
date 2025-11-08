import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from("books").insert(body).select();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { book_id, ...updates } = body;
    if (!book_id) return NextResponse.json({ error: "book_id required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("books")
      .update(updates)
      .eq("book_id", book_id)
      .select();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");
    if (!bookId) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("books")
      .delete()
      .eq("book_id", bookId)
      .select();
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

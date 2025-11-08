import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const { order } = await req.json();
    const { error: archiveError } = await supabase.from("order_archive").insert(order);

    if (archiveError) throw archiveError;

    const { error: deleteError } = await supabase.from("orders").delete().eq("id", order.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: archived, error } = await supabase
      .from("order_archive")
      .select("id, full_name, total_amount, archived_at, items")
      .order("archived_at", { ascending: false });

    if (error) throw error;

    const bookIds = [
      ...new Set(archived.flatMap((a) => (a.items || []).map((i) => i.book_id).filter(Boolean))),
    ];

    let booksMap = {};
    if (bookIds.length > 0) {
      const { data: books } = await supabase
        .from("books")
        .select("book_id, title_ar, title_en")
        .in("book_id", bookIds);
      booksMap = Object.fromEntries(books.map((b) => [b.book_id, b]));
    }

    const enriched = archived.map((order) => ({
      ...order,
      items: (order.items || []).map((item) => ({
        ...item,
        title_ar: booksMap[item.book_id]?.title_ar || `Book #${item.book_id}`,
        title_en: booksMap[item.book_id]?.title_en || `Book #${item.book_id}`,
      })),
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET() {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, full_name, phone, address, total_amount, status, created_at, items")
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    const bookIds = [
      ...new Set(
        orders.flatMap((order) => (order.items || []).map((item) => item.book_id).filter(Boolean)),
      ),
    ];

    let booksMap = {};
    if (bookIds.length > 0) {
      const { data: books, error: booksError } = await supabase
        .from("books")
        .select("book_id, title_ar, title_en")
        .in("book_id", bookIds);

      if (booksError) throw booksError;

      booksMap = Object.fromEntries(
        books.map((b) => [b.book_id, { title_ar: b.title_ar, title_en: b.title_en }]),
      );
    }

    const enrichedOrders = orders.map((order) => ({
      ...order,
      items: (order.items || []).map((item) => ({
        ...item,
        title_ar: booksMap[item.book_id]?.title_ar || `Book #${item.book_id}`,
        title_en: booksMap[item.book_id]?.title_en || `Book #${item.book_id}`,
      })),
    }));

    return NextResponse.json(enrichedOrders);
  } catch (err) {
    console.error("Orders API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

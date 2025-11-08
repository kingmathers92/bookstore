import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, full_name, phone, address, total_amount, status, created_at, items")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Orders API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

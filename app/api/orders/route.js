import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, phone, items, total_amount } = body;

    if (
      !name ||
      !address ||
      !phone ||
      !items ||
      items.length === 0 ||
      typeof total_amount !== "number" ||
      total_amount <= 0
    ) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    let userId = null;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!userError && user) {
        userId = user.id;
      }
    }

    const orderData = {
      user_id: userId,
      items: items.map((item) => ({
        book_id: item.book_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total_amount,
      full_name: name,
      address,
      phone,
      status: "pending",
    };

    const { data, error } = await supabaseAdmin.from("orders").insert(orderData).select();

    if (error) throw new Error(`Insert error: ${error.message}`);

    if (userId) {
      await supabaseAdmin.from("carts").delete().eq("user_id", userId);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Order insert error:", error.message);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";

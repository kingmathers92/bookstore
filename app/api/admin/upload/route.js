import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique file name and path
    const filename = `books/${Date.now()}_${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("book-images")
      .upload(filename, fileBuffer, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL from Supabase
    const { data: urlData } = supabaseAdmin.storage.from("book-images").getPublicUrl(filename);

    // ✅ Fallback logic: ensure a usable URL
    const imageUrl =
      urlData?.publicUrl ||
      uploadData?.publicUrl ||
      uploadData?.url ||
      (uploadData?.path ? `${SUPABASE_URL}/storage/v1/object/public/${uploadData.path}` : null);

    if (!imageUrl) {
      throw new Error("Failed to generate public image URL");
    }

    // Return usable URL to frontend
    return NextResponse.json({
      success: true,
      publicUrl: imageUrl,
      path: filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}

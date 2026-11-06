import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Tour database is not configured." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    // Only select stable columns: optional fields (such as overview) can break the entire query.
    let { data, error } = await db.from("custom_tours")
      .select("slug,title,description,category,duration_days,cover_url,archived,sort_order")
      .eq("published", true).eq("archived", false).order("sort_order", { ascending: true });
    // Older installations may not yet have the archive column.
    if (error && /archived|42703|PGRST204/i.test(error.message || "")) {
      ({ data, error } = await db.from("custom_tours")
        .select("slug,title,description,category,duration_days,cover_url,sort_order")
        .eq("published", true).order("sort_order", { ascending: true }));
    }
    if (error) throw error;
    return NextResponse.json({ tours: (data || []).filter(t => t.slug !== "airport-transfers") }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
  } catch (err) {
    console.error("Published tours lookup failed:", err.message);
    return NextResponse.json({ error: "Unable to load published tours." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

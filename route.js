// Resolve public Supabase photographs at request time, not during the Vercel build.
export const dynamic = "force-dynamic";
export async function GET(request, { params }) {
  const { path } = await params;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(base)) {
    return new Response("Supabase project URL not configured", { status: 503 });
  }
  if (!Array.isArray(path) || path.some(x => x === "." || x === ".." || !x)) return new Response("Invalid image path", { status: 400 });
  const url = `${base}/storage/v1/object/public/website-images/${path.map(encodeURIComponent).join("/")}`;
  try {
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) return new Response(`Supabase image not found (${upstream.status}): ${path.join("/")}`, { status: upstream.status });
    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=300, s-maxage=3600");
    return new Response(upstream.body, { status: 200, headers });
  } catch { return new Response("Unable to reach Supabase Storage", { status: 502 }); }
}

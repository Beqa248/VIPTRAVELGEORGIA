// Resolve public Supabase photographs at request time, not during the Vercel build.
export const dynamic = "force-dynamic";

const cacheControl = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(request, { params }) {
  const { path } = await params;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(base)) {
    return new Response("Supabase project URL not configured", { status: 503 });
  }
  if (!Array.isArray(path) || path.some(x => x === "." || x === ".." || !x)) return new Response("Invalid image path", { status: 400 });
  const url = `${base}/storage/v1/object/public/website-images/${path.map(encodeURIComponent).join("/")}`;
  try {
    const conditional = new Headers();
    for (const name of ["if-none-match", "if-modified-since"]) {
      const value = request.headers.get(name);
      if (value) conditional.set(name, value);
    }

    const upstream = await fetch(url, { cache: "no-store", headers: conditional });
    const headers = new Headers({ "Cache-Control": cacheControl });
    for (const name of ["etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (upstream.status === 304) return new Response(null, { status: 304, headers });
    if (!upstream.ok) return new Response(`Supabase image not found (${upstream.status}): ${path.join("/")}`, { status: upstream.status });
    headers.set("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    return new Response(upstream.body, { status: 200, headers });
  } catch { return new Response("Unable to reach Supabase Storage", { status: 502 }); }
}

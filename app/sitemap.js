import { SITE_URL, PAGE_SEO, LEGACY_TOUR_SLUGS, RESERVED_SLUGS, getPublicDb } from "../lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap() {
 const updated = new Date();
 const entries = Object.keys(PAGE_SEO).map(path=>({url:`${SITE_URL}${path === "/" ? "" : path}`,lastModified:updated,changeFrequency:path === "/" ? "weekly":"monthly",priority:path === "/" ? 1 : .7}));
 try {
  const db = await getPublicDb();
  if (!db) return entries;
  let {data,error} = await db.from("custom_tours").select("slug,published,archived").eq("published",true).eq("archived",false);
  if (error) return entries; // Never publish unverified or archived tours
  for (const tour of data || []) {
   if (!tour.slug || tour.slug === "airport-transfers") continue;
   const slug = String(tour.slug);
   if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) continue;
   const path = LEGACY_TOUR_SLUGS.includes(slug) ? `/${slug}` : `/tour/${slug}`;
   if (!entries.some(e=>e.url === SITE_URL+path)) entries.push({url:SITE_URL+path,lastModified:updated,changeFrequency:"monthly",priority:.8});
  }
 } catch (error) { console.error("SEO sitemap tour fetch:",error); }
 return entries;
}

import { SITE_URL, PAGE_SEO, LEGACY_TOUR_SLUGS, RESERVED_SLUGS, getPublicDb, SEO_LANGS, localizedPath } from "../lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap() {
 const updated = new Date();
 const entries=Object.keys(PAGE_SEO).flatMap(path=>SEO_LANGS.map(lang=>({url:SITE_URL+localizedPath(path,lang),lastModified:updated,changeFrequency:path==="/"?"weekly":"monthly",priority:path==="/"?1:.7,alternates:{languages:Object.fromEntries(SEO_LANGS.map(l=>[l,SITE_URL+localizedPath(path,l)]))}})));
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
   for(const lang of SEO_LANGS){const url=SITE_URL+localizedPath(path,lang);if(!entries.some(e=>e.url===url))entries.push({url,lastModified:updated,changeFrequency:"monthly",priority:.8,alternates:{languages:Object.fromEntries(SEO_LANGS.map(l=>[l,SITE_URL+localizedPath(path,l)]))}});}
  }
 } catch (error) { console.error("SEO sitemap tour fetch:",error); }
 return entries;
}

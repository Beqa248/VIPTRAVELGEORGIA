import TranslatedText from "../../../components/TranslatedText";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import styles from "./tour.module.css";
import { tourPriceLabel } from "../../../lib/tourPricing";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function CustomTourPage({params}){
 const {slug}=await params;
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)notFound();
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:tour,error}=await db.from("custom_tours").select("title,description,duration_days,category,itinerary,cover_url,gallery_images,price_mode,price_amount,price_currency,price_unit").eq("slug",slug).eq("published",true).eq("archived",false).maybeSingle();
 if(error||!tour)notFound();
 const {data:pricing}=await db.from("tour_prices").select("price_mode,price_amount,price_currency,price_unit").eq("slug",slug).maybeSingle();
 const label=tourPriceLabel(pricing||tour);
 const itinerarySections=(tour.itinerary||"").split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const clean=(value)=>value.replace(/\*\*/g,"").replace(/^#{1,6}\s*/,"").trim();
 const parts=itinerarySections.flatMap(section=>{
   const lines=section.split("\n").map(x=>x.trim()).filter(Boolean);
   if(!lines.length)return [];
   const first=lines[0];
   const titleLike=/^(?:\*\*)?(?:Departure|Return|Stop\s*\d+|Day\s*\d+|Tour Duration|Please Note|Important|Duration|Note)/i.test(first)||/^#{1,6}\s/.test(first);
   return [{title:titleLike?clean(first):"",body:(titleLike?lines.slice(1):lines).map(clean).join(" ")}];
 });
 return <main className={styles.page}><div className={styles.wrap}><a href="/tours" className={styles.back}>← All tours</a><div className={styles.hero}>{tour.cover_url&&<img src={tour.cover_url} alt={tour.title}/>}<div className={styles.intro}><span>{tour.duration_days} day(s) · {tour.category}</span><h1><TranslatedText text={tour.title}/></h1><p><TranslatedText text={tour.description}/></p>{label&&<p className="vtg-tour-price">{label}</p>}</div></div>{parts.length>0&&<section><h2>Your itinerary</h2><div className={styles.itinerary}>{parts.map((part,i)=><div className={styles.itineraryStop} key={i}>{part.title&&<h3><TranslatedText text={part.title}/></h3>}{part.body&&<p><TranslatedText text={part.body}/></p>}</div>)}</div></section>}{!!tour.gallery_images?.length&&<section><h2>Photo gallery</h2><div className={styles.gallery}>{tour.gallery_images.map((url,i)=><img key={url} src={url} alt={`${tour.title} photo ${i+1}`} loading="lazy"/>)}</div></section>}<section className={styles.cta}><h2>Interested in this tour?</h2><p>Contact us for dates, pricing and a personalized itinerary.</p><a href={`/contact?tour=${encodeURIComponent(tour.title)}`}>Request this tour →</a></section></div></main>
}

import { getPublicDb, tourMetadata } from "../../../lib/seo";
export async function generateMetadata({ params }) {
 const {slug} = await params;
 try {
  const db = await getPublicDb();
  if (!db) return {robots:{index:false,follow:false}};
  const {data} = await db.from("custom_tours").select("title,description,cover_url,published,archived").eq("slug",slug).maybeSingle();
  if (!data?.published || data.archived) return {robots:{index:false,follow:false}};
  return tourMetadata(data, `/tour/${encodeURIComponent(slug)}`);
 } catch { return {robots:{index:false,follow:false}}; }
}

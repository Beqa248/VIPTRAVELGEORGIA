import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import styles from "./tour.module.css";
import { tourPriceLabel } from "../../../lib/tourPricing";
export const dynamic = "force-dynamic";
export default async function CustomTourPage({params}){
 const {slug}=await params;
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)notFound();
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:tour,error}=await db.from("custom_tours").select("title,description,duration_days,category,itinerary,cover_url,gallery_images,price_mode,price_amount,price_currency,price_unit").eq("slug",slug).eq("published",true).maybeSingle();
 if(error||!tour)notFound();
 const {data:pricing}=await db.from("tour_prices").select("price_mode,price_amount,price_currency,price_unit").eq("slug",slug).maybeSingle();
 const label=tourPriceLabel(pricing||tour);
 const days=(tour.itinerary||"").split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 return <main className={styles.page}><div className={styles.wrap}><a href="/tours" className={styles.back}>← All tours</a><div className={styles.hero}>{tour.cover_url&&<img src={tour.cover_url} alt={tour.title}/>}<div className={styles.intro}><span>{tour.duration_days} day(s) · {tour.category}</span><h1>{tour.title}</h1><p>{tour.description}</p>{label&&<p className="vtg-tour-price">{label}</p>}</div></div>{days.length>0&&<section><h2>Your itinerary</h2>{days.map((d,i)=><article className={styles.day} key={i}>{d}</article>)}</section>}{!!tour.gallery_images?.length&&<section><h2>Photo gallery</h2><div className={styles.gallery}>{tour.gallery_images.map((url,i)=><img key={url} src={url} alt={`${tour.title} photo ${i+1}`} loading="lazy"/>)}</div></section>}<section className={styles.cta}><h2>Interested in this tour?</h2><p>Contact us for dates, pricing and a personalized itinerary.</p><a href={`/contact?tour=${encodeURIComponent(tour.title)}`}>Request this tour →</a></section></div></main>
}

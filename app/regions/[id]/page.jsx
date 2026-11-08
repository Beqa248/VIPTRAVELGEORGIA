"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {supabase} from "../../../lib/supabase";
import TranslatedText from "../../../components/TranslatedText";
import styles from "./region.module.css";
export default function RegionDetail(){
 const {id}=useParams();const [region,setRegion]=useState(null);const [loading,setLoading]=useState(true);const [selected,setSelected]=useState(null);
 useEffect(()=>{let active=true;if(!supabase||!id){setLoading(false);return;}supabase.from("travel_regions").select("*").eq("id",id).eq("published",true).eq("archived",false).maybeSingle().then(({data})=>{if(active){setRegion(data);setLoading(false)}});return()=>{active=false}},[id]);
 if(loading)return <main className={styles.page}>Loading region…</main>;
 if(!region)return <main className={styles.page}><h1>Region unavailable</h1><a href="/#regions">← Back to regions</a></main>;
 const photos=[region.image_url,...(region.gallery_images||[])].filter(Boolean);
 return <main className={styles.page}><a className={styles.back} href="/">← Back to Georgia’s regions</a><div className={styles.body}><h2><TranslatedText text={region.title}/></h2><p><TranslatedText text={region.description||""}/></p><h2>Photo Gallery</h2><div className={styles.gallery}>{photos.map((src,i)=><button type="button" key={src+i} onClick={()=>setSelected(src)} aria-label={`Open photo ${i+1}`}><img src={src} alt={`${region.title} photo ${i+1}`} loading="lazy"/></button>)}</div></div>{selected&&<div className={styles.overlay} role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><button aria-label="Close photo" onClick={()=>setSelected(null)}>✕</button><img src={selected} alt={region.title} onClick={e=>e.stopPropagation()}/></div>}</main>
}

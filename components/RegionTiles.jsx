"use client";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabase";
import {useLanguage} from "./site-context";
import {defaultRegions} from "../lib/defaultRegions";
export default function RegionTiles(){
 const {t}=useLanguage();const [regions,setRegions]=useState(null);const [error,setError]=useState(false);
 useEffect(()=>{let live=true;if(!supabase){setError(true);return;}supabase.from("travel_regions").select("*").order("sort_order",{ascending:true}).then(({data,error})=>{if(!live)return;if(error){console.error("Travel regions:",error.message);setError(true)}else setRegions(data||[])});return()=>{live=false}},[]);
 const list=regions??(error?defaultRegions:[]);
 return <div className="rgrid">{list.filter(r=>r.published!==false).map(r=>{
 const title=r.title|| (r.titleKey?t(r.titleKey):r.slug);
 const description=r.description|| (r.descriptionKey?t(r.descriptionKey):"");
 const url=r.image_url||r.image||"/images/photo-027.jpg";
 const href=r.link_url||r.href||"/tours";
 return <a key={r.id||r.slug} className="rtile" style={{backgroundImage:`url("${url.replaceAll('"','%22')}")`}} href={href}><b>{title}</b><span>{description}</span></a>
 })}</div>
}

"use client";
import TranslatedText from "./TranslatedText";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabase";
import {useLanguage} from "./site-context";
import {defaultRegions} from "../lib/defaultRegions";
export default function RegionTiles(){
 const {t}=useLanguage();const [regions,setRegions]=useState(null);
 useEffect(()=>{let live=true;if(!supabase)return;supabase.from("travel_regions").select("*").eq("published",true).eq("archived",false).order("sort_order",{ascending:true}).then(({data,error})=>{if(live&&!error)setRegions(data||[])});return()=>{live=false}},[]);
 const list=regions??defaultRegions;
 return <div className="rgrid">{list.filter(r=>r.published!==false&&!r.archived).map(r=>{
 const title=r.title||(r.titleKey?t(r.titleKey):r.slug);
 const url=r.image_url||r.image||"/images/photo-027.jpg";
 const href=r.id?`/regions/${r.id}`:(r.link_url||r.href||"/tours");
 return <div key={r.id||r.slug} className="vtg-highlight-item"><a className="rtile" style={{backgroundImage:`url("${url.replaceAll('"','%22')}")`}} href={href}><b><TranslatedText text={title}/></b></a></div>
 })}</div>
}

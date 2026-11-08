"use client";
import TranslatedText from "./TranslatedText";
import {useEffect,useState} from "react";
import {supabase} from "../lib/supabase";
import {useLanguage} from "./site-context";
import {defaultRegions} from "../lib/defaultRegions";
export default function RegionTiles(){
 const {t}=useLanguage();const [regions,setRegions]=useState([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;if(!supabase){setRegions(defaultRegions);setLoading(false);return;}supabase.from("travel_regions").select("*").eq("published",true).eq("archived",false).order("sort_order",{ascending:true}).then(({data,error})=>{if(live){setRegions(error?defaultRegions:(data||[]));setLoading(false)}});return()=>{live=false}},[]);
 const list=regions;
 if(loading)return <div className="rgrid" aria-busy="true" aria-label="Loading regions" />;
 return <div className="rgrid">{list.filter(r=>r.published!==false&&!r.archived).map(r=>{
 const title=r.title||(r.titleKey?t(r.titleKey):r.slug);
 const url=r.image_url||r.image||"/images/photo-027.jpg";
 const href=r.id?`/regions/${r.id}`:(r.link_url||r.href||"/tours");
 return <div key={r.id||r.slug} className="vtg-highlight-item"><a className="rtile" style={{backgroundImage:`url("${url.replaceAll('"','%22')}")`,display:"flex",alignItems:"center",justifyContent:"flex-end",textAlign:"center",padding:"14px 10px 20px"}} href={href}><b className="vtg-region-title" style={{display:"block",width:"100%",fontFamily:"system-ui, sans-serif",fontSize:"clamp(22px, 2.2vw, 28px)",fontWeight:800,lineHeight:1.12,color:"#fff",textShadow:"0 2px 10px rgba(0,0,0,.9)",position:"relative",zIndex:2}}><TranslatedText text={title}/></b></a></div>
 })}</div>
}

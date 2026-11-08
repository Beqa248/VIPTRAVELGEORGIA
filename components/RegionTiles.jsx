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
 return <div key={r.id||r.slug} className="vtg-highlight-item"><a className="rtile" style={{alignItems:"stretch",justifyContent:"flex-end",textAlign:"center",padding:"12px 10px 20px",backgroundImage:`url("${url.replaceAll('"','%22')}")`}} href={href}><TranslatedText as="div" text={title} className="vtg-region-heading" style={{position:"relative",zIndex:2,display:"block",width:"100%",boxSizing:"border-box",padding:"0 4px",margin:0,color:"#fff",fontFamily:"Arial,Helvetica,sans-serif",fontSize:"clamp(32px, 3.2vw, 42px)",fontWeight:900,lineHeight:1.03,letterSpacing:"-0.045em",textAlign:"center",whiteSpace:"normal",overflowWrap:"break-word",textShadow:"0 3px 12px rgba(0,0,0,.9)"}}/></a></div>
 })}</div>
}

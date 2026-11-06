"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TourEditableContent({slug}) {
  const [content,setContent]=useState(null);
  useEffect(()=>{
    if(!supabase || !slug || slug==="tours") return;
    let active=true;
    supabase.from("tour_content").select("overview,itinerary").eq("slug",slug).maybeSingle()
      .then(({data,error})=>{if(active && !error) setContent(data);});
    return ()=>{active=false};
  },[slug]);
  if(!content?.overview?.trim() && !content?.itinerary?.trim()) return null;
  return <section className="vtg-editable-tour-text" aria-label="Tour information"><div className="wrap">
    {content.overview?.trim() && <div><h2>Tour overview</h2><p style={{whiteSpace:"pre-line"}}>{content.overview}</p></div>}
    {content.itinerary?.trim() && <div><h2>Detailed itinerary</h2>{content.itinerary.split(/\n\s*\n/).filter(Boolean).map((part,i)=><p key={i} style={{whiteSpace:"pre-line"}}>{part}</p>)}</div>}
  </div></section>;
}

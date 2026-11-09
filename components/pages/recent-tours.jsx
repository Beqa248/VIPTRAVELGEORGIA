"use client";
import TranslatedText from "../TranslatedText";
import { useLanguage } from "../site-context";
import usePublished from "../usePublished";
export default function Page(){
 const {t}=useLanguage();
 const {rows,loaded}=usePublished("recent_tours");
 return <div data-p="recent-tours"><section><div className="wrap">
 <h2>{t("recentTours")}</h2><p>{t("recentToursIntro")}</p>
 <div className="grid">{[...rows].sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999)).map(r=><article className="card" key={r.id}>
 {(r.cover_url || r.images?.[0]) && <img src={r.cover_url || r.images[0]} alt={`${r.title} cover`} loading="lazy" style={{width:"100%",maxHeight:290,objectFit:"cover",borderRadius:12}}/>}
 <div className="t"><h3><TranslatedText text={r.title}/></h3>{r.tour_date&&<small>{r.tour_date}</small>}{r.description&&<p><TranslatedText text={r.description}/></p>}</div>
 <div className="gal soft">
 {(r.images||[]).map((url,i)=><a href={url} key={`image-${i}`} target="_blank" rel="noopener noreferrer"><img src={url} alt={`${r.title} photo ${i+1}`} loading="lazy"/></a>)}
 {(r.video_urls||[]).map((url,i)=><video key={`video-${i}`} controls playsInline preload="metadata" poster={r.cover_url||undefined} style={{width:"100%",maxWidth:"100%",borderRadius:10}}><source src={url}/>Your browser does not support video playback.</video>)}
 </div></article>)}</div>
 {loaded&&!rows.length&&<p>{t("recentToursEmpty")}</p>}
 </div></section></div>
}

"use client";
import TranslatedText from "../TranslatedText";
import { useLanguage } from "../site-context";
import usePublished from '../usePublished';
export default function Page(){const {t}=useLanguage();const {rows,loaded}=usePublished('recent_tours');return <div data-p="recent-tours"><section><div className="wrap"><h2>{t("recentTours")}</h2><p>{t("recentToursIntro")}</p><div className="grid">{([...rows].sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999))).map(r=><article className="card" key={r.id}><div className="t"><h3><TranslatedText text={r.title}/></h3>{r.tour_date&&<small>{r.tour_date}</small>}{r.description&&<p><TranslatedText text={r.description}/></p>}</div><div className="gal soft">{(r.images||[]).map((url,i)=><a href={url} key={i} target="_blank" rel="noopener noreferrer"><img src={url} alt={`${r.title} photo ${i+1}`} loading="lazy"/></a>)}</div></article>)}</div>{loaded&&!rows.length&&<p>{t("recentToursEmpty")}</p>}</div></section></div>}

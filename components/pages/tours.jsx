"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import chooser from "./tourChooser.module.css";
import { tourPriceLabel } from "../../lib/tourPricing";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    const [selectedTour, setSelectedTour] = useState("all");
    const [allTours, setAllTours] = useState(null);
    const [prices,setPrices] = useState({});
    const originalTours = [
  {slug:"adjara", title:t("t1"), description:t("d1"), cover_url:"/images/photo-003.jpg", published:true, sort_order:0, original:true},
  {slug:"martvili", title:t("t2"), description:t("d2"), cover_url:"/images/photo-009.jpg", published:true, sort_order:10, original:true},
  {slug:"gomis", title:t("t3"), description:t("d3"), cover_url:"/images/photo-018.jpg", published:true, sort_order:20, original:true},
  {slug:"svaneti", title:t("t4"), description:t("d4"), cover_url:"/images/photo-026.jpg", published:true, sort_order:30, original:true},
  {slug:"kobuleti", title:t("t6"), description:t("d6"), cover_url:"/images/photo-044.jpg", published:true, sort_order:40, original:true},
  {slug:"dashbashi", title:t("t7"), description:t("d7"), cover_url:"/images/photo-051.jpg", published:true, sort_order:50, original:true},
  {slug:"vardzia", title:t("t8"), description:t("d8"), cover_url:"/images/photo-057.jpg", published:true, sort_order:60, original:true},
  {slug:"tusheti", title:t("t9"), description:t("d9"), cover_url:"/images/photo-064.jpg", published:true, sort_order:70, original:true},
  {slug:"beshumi", title:t("t10"), description:t("d10"), cover_url:"/images/photo-073.jpg", published:true, sort_order:80, original:true},
  {slug:"kazbegi", title:t("t11"), description:t("d11"), cover_url:"/images/photo-080.jpg", published:true, sort_order:90, original:true},
  {slug:"highlights", title:t("t12"), description:t("d12"), cover_url:"/images/photo-086.jpg", published:true, sort_order:100, original:true},
  {slug:"airport-transfers", title:t("t13"), description:t("d13"), cover_url:null, published:true, sort_order:110, original:true}
];
    useEffect(()=>{if(!supabase)return;let active=true;supabase.from("tour_prices").select("slug,price_mode,price_amount,price_currency,price_unit").then(({data,error})=>{if(active&&!error)setPrices(Object.fromEntries((data||[]).map(row=>[row.slug,row])))});return()=>{active=false}},[]);
    const visibleTours = (allTours ?? originalTours).filter(t=>t.published).sort((a,b)=>(a.sort_order??100)-(b.sort_order??100));
    useEffect(() => { if (!supabase) return; let active=true; supabase.from("custom_tours").select("slug,title,description,cover_url,duration_days,category,published,sort_order,itinerary,gallery_images,is_original,price_mode,price_amount,price_currency,price_unit").order("sort_order",{ascending:true}).then(({data,error})=>{if(!active||error)return; const known=new Set((data||[]).map(t=>t.slug)); setAllTours([...(data||[]),...originalTours.filter(t=>!known.has(t.slug))]);});return ()=>{active=false}; }, []);
    return (<>
    <div className="" data-p="tours">
    <section id="tours"><div className="wrap"><h2 data-k="toursH">{t("toursH")}</h2>
    <div className={chooser.chooser}><label htmlFor="vtg-tour-choice">Choose your tour</label><div className={chooser.controls}><select id="vtg-tour-choice" value={selectedTour} onChange={e => setSelectedTour(e.target.value)}><option value="all">All tours</option>{visibleTours.map(tour=><option key={tour.slug} value={tour.slug}>{tour.title}</option>)}</select>{selectedTour!=="all"&&<button type="button" onClick={()=>setSelectedTour("all")}>Show all tours</button>}</div></div>
    <div className="grid">
    {visibleTours.filter(tour=>selectedTour==="all"||selectedTour===tour.slug).map(tour=><div key={tour.slug} className="card"><div className="pic" style={{backgroundImage:tour.cover_url?`url(${JSON.stringify(tour.cover_url)})`:"none",backgroundColor:"#dce8df"}}></div><div className="t"><h3>{tour.title}</h3><p>{tour.description}</p>{tourPriceLabel(prices[tour.slug]||tour)&&<p className="vtg-tour-price">{tourPriceLabel(prices[tour.slug]||tour)}</p>}<p className="lnk"><a href={(tour.original||tour.is_original) && !tour.itinerary && !(tour.gallery_images||[]).length ? (tour.slug==="airport-transfers"?"/contact":`/${tour.slug}`) : `/tour/${tour.slug}`}>{tour.slug==="airport-transfers"?"Ask about this tour":"See tour details"}</a></p></div></div>)}
    </div></div></section>
    </div>
    </>);
}

"use client";
import TranslatedText from "../TranslatedText";
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
    const [tourTexts,setTourTexts] = useState({});
    useEffect(()=>{if(!supabase)return;let active=true;supabase.from("tour_content").select("slug,overview").then(({data,error})=>{if(active&&!error)setTourTexts(Object.fromEntries((data||[]).map(x=>[x.slug,x.overview])))});return()=>{active=false}},[]);
    useEffect(()=>{if(!supabase)return;let active=true;supabase.from("tour_prices").select("slug,price_mode,price_amount,price_currency,price_unit").then(({data,error})=>{if(active&&!error)setPrices(Object.fromEntries((data||[]).map(row=>[row.slug,row])))});return()=>{active=false}},[]);
    const visibleTours = (allTours ?? []).filter(t=>t.published&&!t.archived).sort((a,b)=>(a.sort_order??100)-(b.sort_order??100));
    useEffect(() => { if (!supabase) {setAllTours([]);return;} let active=true; supabase.from("custom_tours").select("slug,title,description,cover_url,duration_days,category,published,archived,sort_order,itinerary,gallery_images,is_original,price_mode,price_amount,price_currency,price_unit").order("sort_order",{ascending:true}).then(({data,error})=>{if(!active)return; if(error){setAllTours([]);return;} setAllTours(data||[]);});return ()=>{active=false}; }, []);
    return (<>
    <div className="" data-p="tours">
    <section id="tours"><div className="wrap"><h2 data-k="toursH">{t("toursH")}</h2>
    <div className={chooser.chooser}><label htmlFor="vtg-tour-choice">Choose your tour</label><div className={chooser.controls}><select id="vtg-tour-choice" value={selectedTour} onChange={e => setSelectedTour(e.target.value)}><option value="all">All tours</option>{visibleTours.map(tour=><option key={tour.slug} value={tour.slug}><TranslatedText text={tour.title}/></option>)}</select>{selectedTour!=="all"&&<button type="button" onClick={()=>setSelectedTour("all")}>Show all tours</button>}</div></div>
    {allTours===null?<p role="status" aria-live="polite">Loading tours…</p>:<div className="grid vtg-tour-list-grid">
    {visibleTours.filter(tour=>selectedTour==="all"||selectedTour===tour.slug).map(tour=><div key={tour.slug} className="card vtg-tour-list-card"><div className="pic" style={{backgroundImage:tour.cover_url?`url(${JSON.stringify(tour.cover_url)})`:"none",backgroundColor:"#dce8df"}}></div><div className="t"><h3><TranslatedText text={tour.title}/></h3><p><TranslatedText text={tourTexts[tour.slug] || tour.description}/></p>{tourPriceLabel(prices[tour.slug]||tour)&&<p className="vtg-tour-price">{tourPriceLabel(prices[tour.slug]||tour)}</p>}<p className="lnk"><a href={(tour.original||tour.is_original) && !tour.itinerary && !(tour.gallery_images||[]).length ? (tour.slug==="airport-transfers"?"/contact":`/${tour.slug}`) : `/tour/${tour.slug}`}>{tour.slug==="airport-transfers"?"Ask about this tour":"See tour details"}</a></p></div></div>)}
    </div>}</div></section>
    </div>
    </>);
}

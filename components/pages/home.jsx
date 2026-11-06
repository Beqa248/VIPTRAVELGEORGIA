"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { tourPriceLabel } from "../../lib/tourPricing";
import VehicleCards from "../VehicleCards";
import VehicleSelect from "../VehicleSelect";
import TripPlanner from "../TripPlanner";

import ReviewsList from "../ReviewsList";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    const [homePrices,setHomePrices] = useState({});
    const [homeTours,setHomeTours]=useState(null);
    useEffect(()=>{
      if(!supabase)return;
      let active=true;
      supabase.from("custom_tours").select("slug,title,cover_url,published,archived,sort_order,itinerary,gallery_images,is_original").order("sort_order",{ascending:true})
        .then(({data,error})=>{if(active&&!error)setHomeTours(data||[]);});
      return ()=>{active=false};
    },[]);
    useEffect(() => {
      if (!supabase) return;
      let active=true;
      supabase.from("tour_prices").select("slug,price_mode,price_amount,price_currency,price_unit")
        .then(({data,error}) => {
          if (!active || error) return;
          setHomePrices(Object.fromEntries((data||[]).map(x=>[x.slug,tourPriceLabel(x)])));
        });
      return () => { active=false; };
    }, []);
    return (<>
    <div className="" data-p="home">
    <div className="hero" id="top"><div className="wrap">
    <h1 data-k="h1">{t("h1")}</h1><p data-k="sub">{t("sub")}</p>
    <a className="btn" href="/plan" data-k="cta">{t("cta")}</a><a className="btn alt" href="/tours" data-k="see">{t("see")}</a>
    </div></div>
    <section id="hTours"><div className="wrap"><h2 data-k="popH">{t("popH")}</h2><div className="tiles">{(()=>{
      const defaults=[
        {slug:"adjara",title:t("t1"),cover_url:"/images/photo-002.jpg",sort_order:0},
        {slug:"martvili",title:t("t2"),cover_url:"/images/photo-009.jpg",sort_order:10},
        {slug:"gomis",title:t("t3"),cover_url:"/images/photo-018.jpg",sort_order:20},
        {slug:"svaneti",title:t("t4"),cover_url:"/images/photo-027.jpg",sort_order:30},
        {slug:"kobuleti",title:t("t6"),cover_url:"/images/photo-044.jpg",sort_order:40},
        {slug:"dashbashi",title:t("t7"),cover_url:"/images/photo-051.jpg",sort_order:50},
        {slug:"vardzia",title:t("t8"),cover_url:"/images/photo-057.jpg",sort_order:60},
        {slug:"tusheti",title:t("t9"),cover_url:"/images/photo-064.jpg",sort_order:70},
        {slug:"beshumi",title:t("t10"),cover_url:"/images/photo-073.jpg",sort_order:80},
        {slug:"kazbegi",title:t("t11"),cover_url:"/images/photo-078.jpg",sort_order:90},
        {slug:"highlights",title:t("t12"),cover_url:"/images/photo-086.jpg",sort_order:100},
        {slug:"airport-transfers",title:t("t13"),cover_url:null,sort_order:110}
      ];
      const rows=homeTours||[];
      const saved=new Map(rows.map(x=>[x.slug,x]));
      const merged=[...defaults.map(x=>({...x,...(saved.get(x.slug)||{}),cover_url:saved.get(x.slug)?.cover_url||x.cover_url})),...rows.filter(x=>!defaults.some(d=>d.slug===x.slug))];
      return merged.filter(x=>x.published!==false&&!x.archived).sort((a,b)=>(a.sort_order??100)-(b.sort_order??100)).slice(0,6).map(tour=><a key={tour.slug} className="tile" style={{backgroundImage:tour.cover_url?`url(${JSON.stringify(tour.cover_url)})`:"none"}} href={tour.slug==="airport-transfers"?"/contact":(tour.is_original||defaults.some(x=>x.slug===tour.slug))&&!tour.itinerary&&!tour.gallery_images?.length?`/${tour.slug}`:`/tour/${tour.slug}`}><span>{tour.title}{homePrices[tour.slug]&&<small className="vtg-home-tour-price">{homePrices[tour.slug]}</small>}</span></a>);
    })()}</div><p style={{ "marginTop": "16px" }}><a className="btn" href="/tours" data-k="allTours">{t("allTours")}</a></p></div></section>
    <div className="vtg-plan-band"><div className="vtg-plan-inner"><div className="vtg-plan-header"><span className="vtg-eyebrow">YOUR JOURNEY STARTS HERE</span><h2>{t("planH")}</h2><p>Tell us what you love. Discover private tours that fit your journey in Georgia.</p><div className="vtg-extras vtg-plan-actions"><a href="/planner">✨ AI Travel Planner</a><a href="/custom-tour">Build a custom tour</a><a href="/assistant">Travel Assistant</a></div></div><div className="vtg-plan-row"><TripPlanner hideIntro hideFootnote /><section className="howsec"><div className="wrap"><h2 data-k="howH">{t("howH")}</h2><div className="steps"><div className="step"><b>1</b><h3 data-k="how1t">{t("how1t")}</h3><p data-k="how1d">{t("how1d")}</p></div><div className="step"><b>2</b><h3 data-k="how2t">{t("how2t")}</h3><p data-k="how2d">{t("how2d")}</p></div><div className="step"><b>3</b><h3 data-k="how3t">{t("how3t")}</h3><p data-k="how3d">{t("how3d")}</p></div></div></div></section></div><div className="vtg-plan-benefits"><span>✓ Private tours</span><span className="vtg-benefit-dot">·</span><span>✓ Flexible itineraries</span><span className="vtg-benefit-dot">·</span><span>✓ Local driver-guide</span></div></div></div>
    <div className="vtg-about-row"><section id="hGuide"><div className="wrap guide"><div><div className="vtg-guide-title"><div className="gbadge" id="gbadge">🚙</div><h2 data-k="guideH">{t("guideH")}</h2></div><p data-k="guideT" style={{ "maxWidth": "640px" }}>{t("guideT")}</p>
    <ul className="gl"><li data-k="factLang">{t("factLang")}</li><li data-k="guideCar">{t("guideCar")}</li><li data-k="factPrivate">{t("factPrivate")}</li><li data-k="factStart">{t("factStart")}</li></ul>
    <div className="vtg-guide-actions"><a className="btn" href="/reviews" data-k="guideRev">{t("guideRev")}</a><a className="btn vtg-recent-tours-btn" href="/recent-tours">See Recent Tours</a></div></div></div></section>
    <section className="why"><div className="wrap"><h2 data-k="whyH">{t("whyH")}</h2>
    <ul><li data-k="w1">{t("w1")}</li><li data-k="w2">{t("w2")}</li><li data-k="w3">{t("w3")}</li><li data-k="w4">{t("w4")}</li></ul></div></section></div>
    <div className="vtg-cars-pricing-row">
<section id="hCars">
  <div className="wrap">
    <h2 data-k="carsH">{t("carsH")}</h2>

    <VehicleCards /><p style={{ marginTop: "14px" }}>
      <a className="btn" href="/cars" data-k="nCars">
        {t("nCars")}
      </a>
    </p>
  </div>
</section>
    <section id="hPrice"><div className="wrap"><h2>Prices &amp; Booking</h2><p>Tour prices depend on your selected vehicle, route, trip duration, and group size. Contact us for a personalized quote.</p><p>A 20% deposit is desired to confirm your booking and reserve your preferred travel dates.</p><div className="vtg-price-actions"><a className="btn" href="https://wa.me/995558176108?text=Hello%21%20I%27d%20like%20a%20price%20quote%20for%20a%20private%20tour." target="_blank" rel="noopener noreferrer">Ask for a price on WhatsApp</a><a className="btn vtg-outline" href="/booking">Calculate your price</a></div></div></section></div>
    <section id="hRev"><div className="wrap"><h2 data-k="revH">{t("revH")}</h2><ReviewsList limit={3} /><p style={{ "marginTop": "14px" }}><a className="btn" href="/reviews" data-k="allRev">{t("allRev")}</a></p><p id="hGyg" style={{ "marginTop": "12px" }}></p></div></section>
    <section id="hSeason" className="why"><div className="wrap"><h2 data-k="seasonH">{t("seasonH")}</h2><div className="seas"><p data-k="s1">{t("s1")}</p><p data-k="s2">{t("s2")}</p><p data-k="s3">{t("s3")}</p><p data-k="s4">{t("s4")}</p><p data-k="s5">{t("s5")}</p></div><p data-k="seasonNote" style={{ "color": "var(--mut)", "fontSize": "14px", "marginTop": "12px" }}>{t("seasonNote")}</p></div></section>
    <div className="vtg-contact-alignment"><div className="vtg-contact-row"><section id="hFaq"><div className="wrap"><h2 data-k="faqH">{t("faqH")}</h2><details><summary data-k="f1q">{t("f1q")}</summary><p data-k="f1a">{t("f1a")}</p></details><details><summary data-k="f2q">{t("f2q")}</summary><p data-k="f2a">{t("f2a")}</p></details><details><summary data-k="f3q">{t("f3q")}</summary><p data-k="f3a">{t("f3a")}</p></details><details><summary data-k="f4q">{t("f4q")}</summary><p data-k="f4a">{t("f4a")}</p></details><details><summary data-k="f5q">{t("f5q")}</summary><p data-k="f5a">{t("f5a")}</p></details><details><summary data-k="f6q">{t("f6q")}</summary><p data-k="f6a">{t("f6a")}</p></details><details><summary data-k="f7q">{t("f7q")}</summary><p data-k="f7a">{t("f7a")}</p></details><details><summary data-k="f8q">{t("f8q")}</summary><p data-k="f8a">{t("f8a")}</p></details></div></section>
    <section id="contact"><div className="wrap"><h2 data-k="contH">{t("contH")}</h2>
    <form id="f" onSubmit={(e) => { e.preventDefault(); const f=e.currentTarget; const msg=["VIP Travel Georgia inquiry", "Name: "+f.querySelector("#n").value,"Tour: "+f.querySelector("#t").value,"Car: "+f.querySelector("#v").value,"Dates: "+f.querySelector("#d").value,"Message: "+f.querySelector("#m").value].join("\n"); window.open("https://wa.me/995558176108?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer"); }}>
    <label><span data-k="fName">{t("fName")}</span><input id="n" required={true}/></label>
    <label><span data-k="fTour">{t("fTour")}</span><select id="t"><option>Adjarian mountains</option><option>Martvili &amp; Prometheus</option><option>Gomis Mta</option><option>Svaneti</option><option>Kobuleti coast</option><option>Dashbashi Canyon &amp; Diamond Bridge</option><option>Vardzia &amp; Rabati</option><option>Tusheti</option><option>Beshumi &amp; Green Lake</option><option>Kazbegi &amp; Juta</option><option>Georgia Highlights</option><option>Airport transfer</option><option>Other / custom</option></select></label>
    <label><span data-k="fCar">{t("fCar")}</span><VehicleSelect id="v"/></label>
    <label><span data-k="fDates">{t("fDates")}</span><input id="d" placeholder="e.g. 12–16 June, 3 people"/></label>
    <label><span data-k="fMsg">{t("fMsg")}</span><textarea id="m" rows="7"></textarea></label>
    <button className="btn" type="submit" data-k="send">{t("send")}</button>
    </form>

<div className="links">
  <a
    id="wa"
    href="https://wa.me/995558176108"
    target="_blank"
    rel="noopener noreferrer"
  >
    WhatsApp
  </a>

  <a
    id="tg"
    href="https://t.me/SubTravelGeorgia"
    target="_blank"
    rel="noopener noreferrer"
  >
    Telegram
  </a>

  <a
    id="fb"
    href="https://www.facebook.com/share/19PjaiQedA/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Facebook
  </a>

  <a
    id="ig"
    href="https://www.instagram.com/viptravelgeorgia/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Instagram
  </a>
</div>

    <p className="cinfo"><b data-k="cPhone">{t("cPhone")}</b>: <a href="tel:+995558176108">+995 558 17 61 08</a><br /><b data-k="cMail">{t("cMail")}</b>: <a href="mailto:SubTravelGeorgia@gmail.com">SubTravelGeorgia@gmail.com</a></p></div></section>
    </div></div></div>
    </>);
}

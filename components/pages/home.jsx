"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { tourPriceLabel } from "../../lib/tourPricing";
import VehicleCards from "../VehicleCards";
import CardPhoto from "../CardPhoto";
import ContactForm from "../ContactForm";
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
        .then(({data,error})=>{if(active)setHomeTours(error?[]:(data||[]));});
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
    <div className="vtg-hero-benefit-strip"><div className="vtg-hero-benefit-inner"><div className="vtg-plan-benefits"><span>{t("benefitPrivate")}</span><span className="vtg-benefit-dot">·</span><span>{t("benefitFlexible")}</span><span className="vtg-benefit-dot">·</span><span>{t("benefitGuide")}</span></div></div></div>
    <section id="hTours"><div className="wrap"><h2 data-k="popH">{t("popH")}</h2><div className="tiles">{(()=>{
      const merged=homeTours||[];
      return (homeTours===null?[]:merged).filter(x=>x.published===true && !x.archived&&!x.archived).sort((a,b)=>(a.sort_order??100)-(b.sort_order??100)).slice(0,6).map(tour=><a key={tour.slug} className="tile" href={tour.slug==="airport-transfers"?"/contact":tour.is_original&&!tour.itinerary&&!tour.gallery_images?.length?`/${tour.slug}`:`/tour/${tour.slug}`}>{tour.cover_url && <CardPhoto src={tour.cover_url} alt={tour.title} sizes="(max-width: 560px) calc(50vw - 24px), (max-width: 850px) 45vw, (max-width: 1200px) 30vw, 360px" />}<span>{tour.title}{homePrices[tour.slug]&&<small className="vtg-home-tour-price">{homePrices[tour.slug]}</small>}</span></a>);
    })()}</div><p style={{ "marginTop": "16px" }}><a className="btn" href="/tours" data-k="allTours">{t("allTours")}</a></p></div></section>
    <div className="vtg-plan-band"><div className="vtg-plan-inner"><div className="vtg-plan-header"><span className="vtg-eyebrow">{t("journeyStart")}</span><h2>{t("planH")}</h2><p>{t("journeyIntro")}</p><div className="vtg-extras vtg-plan-actions"><a href="/planner">{t("aiPlanner")}</a><a href="/custom-tour">{t("buildTour")}</a><a href="/assistant">{t("travelAssistant")}</a></div></div><div className="vtg-plan-row"><TripPlanner hideIntro hideFootnote /><section className="howsec"><div className="wrap"><h2 data-k="howH">{t("howH")}</h2><div className="steps"><div className="step"><b>1</b><h3 data-k="how1t">{t("how1t")}</h3><p data-k="how1d">{t("how1d")}</p></div><div className="step"><b>2</b><h3 data-k="how2t">{t("how2t")}</h3><p data-k="how2d">{t("how2d")}</p></div><div className="step"><b>3</b><h3 data-k="how3t">{t("how3t")}</h3><p data-k="how3d">{t("how3d")}</p></div></div></div></section></div></div></div>
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
    <section id="hPrice"><div className="wrap"><h2>{t("pricesBooking")}</h2><p>{t("pricesIntro")}</p><div className="vtg-deposit-info" style={{marginTop:"12px",marginBottom:"12px"}}>
  <h3 style={{fontSize:"1.02rem",fontWeight:700,margin:"0 0 8px"}}>{t("depositInfoHeading")}</h3>
  <p style={{margin:"0 0 8px"}}>{t("depositInfoLeadBefore")}<strong>{t("depositInfoLeadBold")}</strong>{t("depositInfoLeadAfter")}</p>
  <p style={{margin:"0 0 8px"}}>{t("depositInfoDetails")}</p>
  <p style={{margin:0}}><strong>{t("depositInfoNoPayment")}</strong></p>
</div><div className="vtg-price-actions"><a className="btn" href="https://wa.me/995558176108?text=Hello%21%20I%27d%20like%20a%20price%20quote%20for%20a%20private%20tour." target="_blank" rel="noopener noreferrer">{t("askPriceWhatsapp")}</a><a className="btn vtg-outline" href="/booking">{t("calculatePrice")}</a></div></div></section></div>

<style jsx global>{`
.vtg-shell [data-p="home"] #hTours .tile > img {position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;}
/* Compact only the Prices & Booking panel; preserve exact deposit copy. */
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice>.wrap {padding-top:24px!important;padding-bottom:24px!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice h2 {margin-bottom:12px!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice p {font-size:clamp(14px,1.08vw,16px)!important;line-height:1.48!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice .vtg-deposit-info {margin-top:12px!important;margin-bottom:12px!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice .vtg-deposit-info h3 {margin-bottom:8px!important;font-size:1.02rem!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice .vtg-deposit-info p {margin-bottom:8px!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice .vtg-deposit-info p:last-child {margin-bottom:0!important;}
.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice .vtg-price-actions {padding-top:12px!important;margin-top:auto!important;}
@media(max-width:850px){.vtg-shell [data-p="home"] .vtg-cars-pricing-row #hPrice>.wrap {padding-top:20px!important;padding-bottom:20px!important;}}
`}</style>
    <section id="hRev"><div className="wrap"><h2 data-k="revH">{t("revH")}</h2><ReviewsList limit={3} /><p style={{ "marginTop": "14px" }}><a className="btn" href="/reviews" data-k="allRev">{t("allRev")}</a></p><p id="hGyg" style={{ "marginTop": "12px" }}></p></div></section>
    <section id="hSeason" className="why"><div className="wrap"><h2 data-k="seasonH">{t("seasonH")}</h2><div className="seas"><p data-k="s1">{t("s1")}</p><p data-k="s2">{t("s2")}</p><p data-k="s3">{t("s3")}</p><p data-k="s4">{t("s4")}</p><p data-k="s5">{t("s5")}</p></div><p data-k="seasonNote" style={{ "color": "var(--mut)", "fontSize": "14px", "marginTop": "12px" }}>{t("seasonNote")}</p></div></section>
    <div className="vtg-contact-alignment"><div className="vtg-contact-row"><section id="hFaq"><div className="wrap"><h2 data-k="faqH">{t("faqH")}</h2><details><summary data-k="f1q">{t("f1q")}</summary><p data-k="f1a">{t("f1a")}</p></details><details><summary data-k="f2q">{t("f2q")}</summary><p data-k="f2a">{t("f2a")}</p></details><details><summary data-k="f3q">{t("f3q")}</summary><p data-k="f3a">{t("f3a")}</p></details><details><summary data-k="f4q">{t("f4q")}</summary><p data-k="f4a">{t("f4a")}</p></details><details><summary data-k="f5q">{t("f5q")}</summary><p data-k="f5a">{t("f5a")}</p></details><details><summary data-k="f6q">{t("f6q")}</summary><p data-k="f6a">{t("f6a")}</p></details><details><summary data-k="f7q">{t("f7q")}</summary><p data-k="f7a">{t("f7a")}</p></details><details><summary data-k="f8q">{t("f8q")}</summary><p data-k="f8a">{t("f8a")}</p></details></div></section>
    <ContactForm />
    </div></div></div>
    </>);
}

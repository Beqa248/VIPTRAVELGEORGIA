"use client";

import VehicleCards from "../VehicleCards";

import ReviewsList from "../ReviewsList";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="home">
    <div className="hero" id="top"><div className="wrap">
    <h1 data-k="h1">{t("h1")}</h1><p data-k="sub">{t("sub")}</p>
    <a className="btn" href="/plan" data-k="cta">{t("cta")}</a><a className="btn alt" href="/tours" data-k="see">{t("see")}</a>
    </div></div>
    <section id="hTours"><div className="wrap"><h2 data-k="popH">{t("popH")}</h2><div className="tiles"><a className="tile" style={{ backgroundImage: "url(/images/photo-002.jpg)" }} href="/adjara" data-g="#gal img" data-i="0"><span data-k="t1">{t("t1")}</span></a><a className="tile" style={{ backgroundImage: "url(/images/photo-027.jpg)" }} href="/svaneti" data-g="#gal4 img" data-i="1"><span data-k="t4">{t("t4")}</span></a><a className="tile" style={{ backgroundImage: "url(/images/photo-009.jpg)" }} href="/martvili" data-g="#gal2 img" data-i="0"><span data-k="t2">{t("t2")}</span></a><a className="tile" style={{ backgroundImage: "url(/images/photo-018.jpg)" }} href="/gomis" data-g="#gal3 img" data-i="0"><span data-k="t3">{t("t3")}</span></a><a className="tile" style={{ backgroundImage: "url(/images/photo-078.jpg)" }} href="/kazbegi" data-g="#gal10 img" data-i="0"><span data-k="t11">{t("t11")}</span></a><a className="tile" style={{ backgroundImage: "url(/images/photo-073.jpg)" }} href="/beshumi" data-g="#gal9 img" data-i="5"><span data-k="t10">{t("t10")}</span></a></div><p style={{ "marginTop": "16px" }}><a className="btn" href="/tours" data-k="allTours">{t("allTours")}</a></p></div></section>
    <div className="wrap vtg-extras"><a href="/planner">✨ AI Travel Planner</a><a href="/custom-tour">Build a custom tour</a><a href="/assistant">Travel Assistant</a><a href="/booking">20% deposit</a></div><section id="hPlan"><div className="wrap plan"><h2 data-k="planH">{t("planH")}</h2>
    <div className="planrow"><label><span data-k="planDays">{t("planDays")}</span><select id="pDays"><option value="1" data-k="pd1">{t("pd1")}</option><option value="2" data-k="pd2">{t("pd2")}</option><option value="3" data-k="pd3">{t("pd3")}</option></select></label>
    <label><span data-k="planPeople">{t("planPeople")}</span><input id="pPeople" type="number" min="1" value="2"/></label></div>
    <p style={{ "margin": "12px 0 0", "font": "600 14px system-ui,sans-serif" }} data-k="planInt">{t("planInt")}</p>
    <div className="chips" id="pChips"><label><input type="checkbox" value="m"/><span data-k="pi1">{t("pi1")}</span></label><label><input type="checkbox" value="w"/><span data-k="pi2">{t("pi2")}</span></label><label><input type="checkbox" value="h"/><span data-k="pi3">{t("pi3")}</span></label><label><input type="checkbox" value="s"/><span data-k="pi4">{t("pi4")}</span></label><label><input type="checkbox" value="l"/><span data-k="pi5">{t("pi5")}</span></label></div>
    <button className="btn" id="pGo" type="button" data-k="planBtn">{t("planBtn")}</button>
    <div id="pRes" style={{ "display": "none", "marginTop": "16px" }}><p style={{ "font": "600 14px system-ui,sans-serif", "margin": "0 0 8px" }} data-k="planSug">{t("planSug")}</p><div className="tiles" id="pTiles"></div><p id="pNote" data-k="planNote" style={{ "display": "none", "margin": "12px 0 0", "color": "#0b5c53", "font": "600 14px system-ui,sans-serif" }}>{t("planNote")}</p><p style={{ "marginTop": "14px" }}><a className="btn" id="pWa" href="#" target="_blank" rel="noopener" data-k="planWa">{t("planWa")}</a></p></div>
    </div></section>
    <section className="howsec"><div className="wrap"><h2 data-k="howH">{t("howH")}</h2><div className="steps"><div className="step"><b>1</b><h3 data-k="how1t">{t("how1t")}</h3><p data-k="how1d">{t("how1d")}</p></div><div className="step"><b>2</b><h3 data-k="how2t">{t("how2t")}</h3><p data-k="how2d">{t("how2d")}</p></div><div className="step"><b>3</b><h3 data-k="how3t">{t("how3t")}</h3><p data-k="how3d">{t("how3d")}</p></div></div></div></section>
    <section id="hGuide"><div className="wrap guide"><div className="gbadge" id="gbadge">🚙</div><div><h2 data-k="guideH">{t("guideH")}</h2><p data-k="guideT" style={{ "maxWidth": "640px" }}>{t("guideT")}</p>
    <ul className="gl"><li data-k="factLang">{t("factLang")}</li><li data-k="guideCar">{t("guideCar")}</li><li data-k="factPrivate">{t("factPrivate")}</li><li data-k="factStart">{t("factStart")}</li></ul>
    <a className="btn" href="/reviews" data-k="guideRev">{t("guideRev")}</a></div></div></section>
    <section className="why"><div className="wrap"><h2 data-k="whyH">{t("whyH")}</h2>
    <ul><li data-k="w1">{t("w1")}</li><li data-k="w2">{t("w2")}</li><li data-k="w3">{t("w3")}</li><li data-k="w4">{t("w4")}</li></ul></div></section>
    
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
    <section id="hPrice" style={{ "background": "#fff1d0" }}><div className="wrap"><h2 data-k="priceH">{t("priceH")}</h2><p data-k="priceT" style={{ "maxWidth": "640px" }}>{t("priceT")}</p><a className="btn" id="priceBtn" href="#" target="_blank" rel="noopener" data-k="priceBtn">{t("priceBtn")}</a></div></section>
    <section id="hRev"><div className="wrap"><h2 data-k="revH">{t("revH")}</h2><ReviewsList limit={3} /><p style={{ "marginTop": "14px" }}><a className="btn" href="/reviews" data-k="allRev">{t("allRev")}</a></p><p id="hGyg" style={{ "marginTop": "12px" }}></p></div></section>
    <section id="hSeason" className="why"><div className="wrap"><h2 data-k="seasonH">{t("seasonH")}</h2><div className="seas"><p data-k="s1">{t("s1")}</p><p data-k="s2">{t("s2")}</p><p data-k="s3">{t("s3")}</p><p data-k="s4">{t("s4")}</p><p data-k="s5">{t("s5")}</p></div><p data-k="seasonNote" style={{ "color": "var(--mut)", "fontSize": "14px", "marginTop": "12px" }}>{t("seasonNote")}</p></div></section>
    <section id="hFaq"><div className="wrap"><h2 data-k="faqH">{t("faqH")}</h2><details><summary data-k="f1q">{t("f1q")}</summary><p data-k="f1a">{t("f1a")}</p></details><details><summary data-k="f2q">{t("f2q")}</summary><p data-k="f2a">{t("f2a")}</p></details><details><summary data-k="f3q">{t("f3q")}</summary><p data-k="f3a">{t("f3a")}</p></details><details><summary data-k="f4q">{t("f4q")}</summary><p data-k="f4a">{t("f4a")}</p></details><details><summary data-k="f5q">{t("f5q")}</summary><p data-k="f5a">{t("f5a")}</p></details><details><summary data-k="f6q">{t("f6q")}</summary><p data-k="f6a">{t("f6a")}</p></details><details><summary data-k="f7q">{t("f7q")}</summary><p data-k="f7a">{t("f7a")}</p></details><details><summary data-k="f8q">{t("f8q")}</summary><p data-k="f8a">{t("f8a")}</p></details></div></section>
    <section id="contact"><div className="wrap"><h2 data-k="contH">{t("contH")}</h2>
    <form id="f" onSubmit={(e) => { e.preventDefault(); const f=e.currentTarget; const msg=["VIP Travel Georgia inquiry", "Name: "+f.querySelector("#n").value,"Tour: "+f.querySelector("#t").value,"Car: "+f.querySelector("#v").value,"Dates: "+f.querySelector("#d").value,"Message: "+f.querySelector("#m").value].join("\n"); window.open("https://wa.me/995558176108?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer"); }}>
    <label><span data-k="fName">{t("fName")}</span><input id="n" required={true}/></label>
    <label><span data-k="fTour">{t("fTour")}</span><select id="t"><option>Adjarian mountains</option><option>Martvili &amp; Prometheus</option><option>Gomis Mta</option><option>Svaneti</option><option>Kobuleti coast</option><option>Dashbashi Canyon &amp; Diamond Bridge</option><option>Vardzia &amp; Rabati</option><option>Tusheti</option><option>Beshumi &amp; Green Lake</option><option>Kazbegi &amp; Juta</option><option>Georgia Highlights</option><option>Airport transfer</option><option>Other / custom</option></select></label>
    <label><span data-k="fCar">{t("fCar")}</span><select id="v"><option>Subaru Crosstrek 4x4</option><option>Jeep Wrangler</option><option>Minivan</option><option>Mercedes Luxury</option><option>Classic Mercedes Charlotte</option><option>Not sure yet</option></select></label>
    <label><span data-k="fDates">{t("fDates")}</span><input id="d" placeholder="e.g. 12–16 June, 3 people"/></label>
    <label><span data-k="fMsg">{t("fMsg")}</span><textarea id="m" rows="3"></textarea></label>
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
=======
    <div className="links">
    <a id="wa" href="https://wa.me/995558176108" target="_blank" rel="noopener">WhatsApp</a><a id="tg" href="https://t.me/" target="_blank" rel="noopener">Telegram</a><a id="fb" href="https://facebook.com/" target="_blank" rel="noopener">Facebook</a>
    </div>

    <p className="cinfo"><b data-k="cPhone">{t("cPhone")}</b>: +995 558 17 61 08<br /><b data-k="cMail">{t("cMail")}</b>: SubTravelGeorgia@gmail.com</p></div></section>
    </div>
    </>);
}

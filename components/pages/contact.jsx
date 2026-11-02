"use client";
import { useLanguage } from "../site-context";
export default function Contact(){ const {t}=useLanguage(); return <div data-p="contact">    <section id="contact"><div className="wrap"><h2 data-k="contH">{t("contH")}</h2>
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

    <p className="cinfo"><b data-k="cPhone">{t("cPhone")}</b>: +995 558 17 61 08<br /><b data-k="cMail">{t("cMail")}</b>: SubTravelGeorgia@gmail.com</p></div></section></div>; }

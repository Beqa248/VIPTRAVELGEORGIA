"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./site-context";
import styles from "./SiteHeader.module.css";

const contactLabels = { en: "Contact us 24/7", ka: "დაგვიკავშირდით 24/7", ru: "Свяжитесь с нами 24/7", he: "צרו קשר 24/7" };
const nav = [["/", "nHome"], ["/tours", "nTours"], ["/travel", "nTravel"], ["/cars", "nCars"], ["/videos", "nVid"], ["/recent-tours", "recentTours"], ["/reviews", "revH"], ["/contact", "nCont"]];
export default function SiteHeader() {
  const { lang, setLang, t, currency, setCurrency } = useLanguage();
  const path = usePathname();
  return <header className={styles.header}>
    <div className={`${styles.main} wrap`}>
      <Link href="/" className={styles.brand} aria-label="VIPTravelGeorgia home">
        <img src="/viptravelgeorgia-round-logo.png" alt="VIPTravelGeorgia round logo with a white Subaru Crosstrek and Georgian mountains" className={styles.brandLogo}/>
        <span className={styles.brandText}><strong>VIPTravelGeorgia</strong><small>PRIVATE TOURS & TRANSFERS</small></span>
      </Link>
      <div className={styles.right}>
        <a className={styles.phone} href="tel:+995558176108" aria-label="Call +995 558 17 61 08">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.7 1.7a16 16 0 0 0 4.5 4.5l1.7-1.7a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z"/></svg>
          <span><small>{contactLabels[lang] || contactLabels.en}</small><strong>+995 558 17 61 08</strong></span>
        </a>
        <label className={styles.language}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 6 6 12 0 18M12 3c-6 6-6 12 0 18"/></svg>
          <select aria-label="Website language" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="en">EN</option><option value="ka">KA</option><option value="ru">RU</option><option value="he">HE</option>
          </select>
        </label>
        <label className={styles.language} aria-label="Display currency">
          <span aria-hidden="true" style={{fontWeight:700,color:"#D9B76B"}}>$</span>
          <select aria-label="Display currency" value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="USD">USD $</option><option value="EUR">EUR €</option><option value="GEL">GEL ₾</option>
          </select>
        </label>
      </div>
    </div>
    <nav className={styles.nav}><div className={`${styles.navInner} wrap`}>{nav.map(([url,key])=><Link key={url} href={url} className={path===url ? styles.active : ""}>{key==="recentTours" && t(key)==="recentTours" ? {en:"Recent Tours",ka:"ბოლო ტურები",ru:"Недавние туры",he:"סיורים אחרונים"}[lang] : t(key)}</Link>)}</div></nav>
  </header>;
}

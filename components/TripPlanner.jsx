"use client";
import { useState } from "react";
import { useLanguage } from "./site-context";
import styles from "./TripPlanner.module.css";

const options = [
  { key: "m", icon: "⛰", label: "Mountains & views" },
  { key: "w", icon: "💧", label: "Waterfalls & canyons" },
  { key: "h", icon: "🏛", label: "History & culture" },
  { key: "s", icon: "☀", label: "Sea & relaxation" },
  { key: "l", icon: "🌲", label: "Lakes & villages" },
];
const tours = [
  { slug: "adjara", key: "t1", image: "/images/photo-002.jpg", tags: ["m", "w", "l"], min: 1, max: 3 },
  { slug: "martvili", key: "t2", image: "/images/photo-009.jpg", tags: ["w", "l"], min: 1, max: 3 },
  { slug: "gomis", key: "t3", image: "/images/photo-018.jpg", tags: ["m", "l"], min: 1, max: 2 },
  { slug: "svaneti", key: "t4", image: "/images/photo-027.jpg", tags: ["m", "l", "h"], min: 2, max: 7 },
  { slug: "kobuleti", key: "t6", image: "/images/photo-044.jpg", tags: ["s", "l"], min: 1, max: 3 },
  { slug: "dashbashi", key: "t7", image: "/images/photo-051.jpg", tags: ["w", "m"], min: 1, max: 2 },
  { slug: "vardzia", key: "t8", image: "/images/photo-057.jpg", tags: ["h", "m"], min: 1, max: 3 },
  { slug: "tusheti", key: "t9", image: "/images/photo-064.jpg", tags: ["m", "l", "h"], min: 2, max: 7 },
  { slug: "beshumi", key: "t10", image: "/images/photo-073.jpg", tags: ["m", "l"], min: 1, max: 3 },
  { slug: "kazbegi", key: "t11", image: "/images/photo-080.jpg", tags: ["m", "l", "h"], min: 1, max: 3 },
  { slug: "highlights", key: "t12", image: "/images/photo-086.jpg", tags: ["m", "w", "h", "s", "l"], min: 3, max: 14 },
];

export default function TripPlanner({ hideIntro = false, hideFootnote = false }) {
  const { t } = useLanguage();
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [interests, setInterests] = useState(["m", "w"]);
  const [searched, setSearched] = useState(false);
  const toggle = key => { setInterests(old => old.includes(key) ? old.filter(x => x !== key) : [...old, key]); setSearched(false); };
  const matches = tours.map(tour => ({ ...tour, score: tour.tags.filter(tag => interests.includes(tag)).length }))
    .filter(tour => tour.score > 0 && days >= tour.min && days <= tour.max)
    .sort((a, b) => b.score - a.score || a.min - b.min).slice(0, 6);
  const customText = `Hello! I would like a custom Georgia itinerary for ${days} day${days === 1 ? "" : "s"}, ${people} traveler${people === 1 ? "" : "s"}. Interests: ${options.filter(o => interests.includes(o.key)).map(o => o.label).join(", ") || "open to suggestions"}. Please recommend a route and price.`;
  const whatsapp = `https://wa.me/995558176108?text=${encodeURIComponent(customText)}`;
  return <section id="hPlan" className={styles.section}><div className="wrap">
    {!hideIntro && <div className="vtg-plan-head"><div className={styles.intro}><span className={styles.eyebrow}>YOUR JOURNEY STARTS HERE</span><h2>{t("planH")}</h2><p>Tell us what you love. Discover private tours that fit your journey in Georgia.</p></div><div className="vtg-extras vtg-plan-actions"><a href="/planner">✨ AI Travel Planner</a><a href="/custom-tour">Build a custom tour</a><a href="/assistant">Travel Assistant</a></div></div>}
    <div className={styles.panel}>
      <div className={styles.fields}>
        <label className={styles.field}><span>▦ &nbsp;{t("planDays")}</span><select value={days} onChange={e => { setDays(Number(e.target.value)); setSearched(false); }}>{Array.from({length:14},(_,i)=><option key={i+1} value={i+1}>{i+1} {i===0?"day":"days"}</option>)}</select></label>
        <div className={styles.field}><span>♧ &nbsp;{t("planPeople")}</span><div className={styles.counter}><button type="button" aria-label="Remove traveler" disabled={people<=1} onClick={()=>{setPeople(n=>Math.max(1,n-1));setSearched(false)}}>−</button><strong>{people}</strong><button type="button" aria-label="Add traveler" disabled={people>=20} onClick={()=>{setPeople(n=>Math.min(20,n+1));setSearched(false)}}>+</button></div></div>
      </div>
      <div className={styles.rule}/><h3>{t("planInt")}</h3><p className={styles.hint}>Select as many as you like</p>
      <div className={styles.interests}>{options.map((o,i)=><button key={o.key} type="button" className={`${styles.interest} ${interests.includes(o.key)?styles.selected:""}`} aria-pressed={interests.includes(o.key)} onClick={()=>toggle(o.key)}><span className={styles.interestTop}><span className={styles.emoji}>{o.icon}</span><span className={styles.check}>{interests.includes(o.key)?"✓":"○"}</span></span><span>{t(`pi${i+1}`) || o.label}</span></button>)}</div>
      <button className={styles.discover} type="button" onClick={()=>setSearched(true)}>{t("planBtn")} <span>→</span></button>
      {searched && <div className={styles.results} aria-live="polite"><h3>{matches.length?"Recommended trips for you":"Let's create your perfect route"}</h3><p className={styles.hint}>{matches.length?"Explore these matching tours, or request a personalized itinerary.":"No exact match for these preferences. We can design a custom trip for you."}</p>{matches.length>0&&<div className={styles.resultGrid}>{matches.map(tour=><a key={tour.slug} href={`/${tour.slug}`} className={styles.result}><img src={tour.image} alt="" loading="lazy"/><span><strong>{t(tour.key)}</strong><small>View tour details →</small></span></a>)}</div>}<div className={styles.custom}><div><strong>Want something more personal?</strong><p>Get a route tailored to your dates, group, and interests.</p></div><div className={styles.customActions}><a href={`/custom-tour?days=${days}&travelers=${people}&interests=${encodeURIComponent(options.filter(o=>interests.includes(o.key)).map(o=>o.label).join(", "))}`} className={styles.customLink}>Build custom itinerary →</a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>Ask on WhatsApp</a></div></div></div>}
    </div>{!hideFootnote && <p className={styles.footnote}>✓ Private tours &nbsp; · &nbsp; ✓ Flexible itineraries &nbsp; · &nbsp; ✓ Local driver-guide</p>}
  </div></section>;
}

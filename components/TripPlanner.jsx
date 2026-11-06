"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./site-context";
import styles from "./TripPlanner.module.css";

const options = [
  { key: "m", icon: "⛰", label: "Mountains & views" },
  { key: "w", icon: "💧", label: "Waterfalls & canyons" },
  { key: "h", icon: "🏛", label: "History & culture" },
  { key: "s", icon: "☀", label: "Sea & relaxation" },
  { key: "l", icon: "🌲", label: "Lakes & villages" },
];
const signals = {
  m: /mountain|alpine|caucasus|kazbegi|svaneti|beshumi|goderdzi|gomis|hiking|trek|peak|viewpoint|juta|koruldi/i,
  w: /waterfall|canyon|gorge|cave|river|martvili|prometheus|machakhela|mirveti|makhuntseti/i,
  h: /history|historic|culture|cultural|fortress|castle|monastery|church|folklore|heritage|ancient|museum|bridge|ushguli|mtskheta/i,
  s: /sea|coast|beach|botanical|relax|spa|sulfur|kobuleti|shekvetili|batumi|dendrological/i,
  l: /lake|village|forest|nature|green|rural|cottage|heshkili|koruldi|ushguli/i,
};
function classify(tour) {
  const haystack = [tour.title, tour.description, tour.category, tour.overview, tour.itinerary].filter(Boolean).join(" ");
  return options.filter(option => signals[option.key].test(haystack)).map(option => option.key);
}
function tourHref(tour) { return tour.slug === "airport-transfers" ? "/contact" : `/tour/${encodeURIComponent(tour.slug)}`; }
export default function TripPlanner({ hideIntro = false, hideFootnote = false }) {
  const { t } = useLanguage();
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [interests, setInterests] = useState(["m", "w"]);
  const [searched, setSearched] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/published-tours", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load tours");
        if (active) { setTours(payload.tours || []); setLoadError(false); }
      } catch (error) {
        console.error("Plan My Trip:", error);
        if (active) { setTours([]); setLoadError(true); }
      } finally { if (active) setLoading(false); }
    };
    load();
    const refresh = () => { if (document.visibilityState === "visible") load(); };
    const focus = () => load();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", focus);
    return () => { active = false; document.removeEventListener("visibilitychange", refresh); window.removeEventListener("focus", focus); };
  }, []);
  const toggle = key => { setInterests(old => old.includes(key) ? old.filter(x => x !== key) : [...old, key]); setSearched(false); };
  const matches = useMemo(() => tours.map(tour => {
    const tags = classify(tour);
    const duration = Math.max(1, Number(tour.duration_days) || 1);
    const matched = tags.filter(tag => interests.includes(tag)).length;
    // Exact duration is a hard requirement. Interests rank tours only within that duration.
    return { ...tour, score: matched, matched, duration };
  }).filter(tour => tour.duration === days)
    .sort((a,b) => b.score - a.score || String(a.title).localeCompare(String(b.title))), [tours, days, interests]);
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
      <button className={styles.discover} type="button" onClick={()=>setSearched(true)} disabled={loading}>{loading ? "Loading tours…" : t("planBtn")} <span>→</span></button>
      {searched && <div className={styles.results} aria-live="polite"><h3>{matches.length?"Recommended trips for you":"Let's create your perfect route"}</h3><p className={styles.hint}>{loadError?"Tour recommendations are temporarily unavailable. You can still request a custom itinerary.":matches.length?"Explore current published tours that match your interests, or request a personalized itinerary.":"No published tour currently matches the selected number of days. You can request a custom itinerary."}</p>{matches.length>0&&<div className={styles.resultGrid}>{matches.map(tour=><a key={tour.slug} href={tourHref(tour)} className={styles.result}>{tour.cover_url?<img src={tour.cover_url} alt={tour.title} loading="lazy"/>:<div className={styles.resultPlaceholder}>Explore Georgia</div>}<span><strong>{tour.title}</strong><small>{tour.duration} {tour.duration===1?"day":"days"} · View tour details →</small></span></a>)}</div>}<div className={styles.custom}><div><strong>Want something more personal?</strong><p>Get a route tailored to your dates, group, and interests.</p></div><div className={styles.customActions}><a href={`/custom-tour?days=${days}&travelers=${people}&interests=${encodeURIComponent(options.filter(o=>interests.includes(o.key)).map(o=>o.label).join(", "))}`} className={styles.customLink}>Build custom itinerary →</a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>Ask on WhatsApp</a></div></div></div>}
    </div>{!hideFootnote && <p className={styles.footnote}>✓ Private tours &nbsp; · &nbsp; ✓ Flexible itineraries &nbsp; · &nbsp; ✓ Local driver-guide</p>}
  </div></section>;
}

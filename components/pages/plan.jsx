"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../site-context";
import styles from "./plan.module.css";

const PHONE = "995558176108";
export default function Page() {
  const { t } = useLanguage();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState(false);
  const [name, setName] = useState("");
  const [start, setStart] = useState("Batumi");
  const [length, setLength] = useState("Flexible");
  const [people, setPeople] = useState("2 people");
  const [car, setCar] = useState("Not sure yet");
  const [season, setSeason] = useState("Flexible");
  const [dates, setDates] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("/api/published-tours", { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error("Could not load tours");
        const json = await res.json();
        if (!Array.isArray(json.tours)) throw new Error("Invalid tour response");
        setTours(json.tours.filter(x => x && x.title && !x.archived && x.slug !== "airport-transfers"));
        setLoadError(false);
      } catch (error) {
        if (error.name !== "AbortError") setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const message = useMemo(() => [
    "VIP Travel Georgia — Custom trip request",
    `Name: ${name.trim() || "Not provided"}`,
    `Selected tours: ${selected.length ? selected.join(", ") : "None selected"}`,
    `Custom trip / not sure: ${custom ? "Yes" : "No"}`,
    `Starting location: ${start}`,
    `Duration: ${length}`,
    `Travelers: ${people}`,
    `Preferred vehicle: ${car}`,
    `Season: ${season}`,
    `Travel dates: ${dates.trim() || "Flexible"}`,
    `Additional requests: ${notes.trim() || "None"}`
  ].join("\n"), [name, selected, custom, start, length, people, car, season, dates, notes]);
  const canSend = !!name.trim() && (selected.length > 0 || custom);
  const send = () => { if (canSend) window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); };
  const copy = async () => { try { await navigator.clipboard.writeText(message); setCopied(true); } catch { setCopied(false); } };
  const toggle = title => setSelected(old => old.includes(title) ? old.filter(x => x !== title) : [...old, title]);

  return <div className={styles.page} data-p="plan"><section className="wrap">
    <div className={styles.heading}><span className={styles.eyebrow}>VIP TRAVEL GEORGIA</span><h2 data-k="planFormH">{t("planFormH")}</h2><p data-k="planFormT">{t("planFormT")}</p></div>
    <div className={styles.panel}>
      <div className={styles.sectionTitle}><span className={styles.number}>01</span><div><h3 data-k="pfWhere">{t("pfWhere")}</h3><p>Select one or more of our currently available tours, or request something custom.</p></div></div>
      {loading ? <p className={styles.status}>Loading available tours…</p> : loadError ? <p className={styles.error} role="alert">Tours could not be loaded. You can still request a custom trip below.</p> : tours.length === 0 ? <p className={styles.status}>No published tours at the moment. You can still request a custom trip.</p> : null}
      <div className={styles.tourGrid} id="pfWhere">
        {tours.map(tour => <button type="button" key={tour.slug || tour.title} className={`${styles.tourOption} ${selected.includes(tour.title) ? styles.active : ""}`} aria-pressed={selected.includes(tour.title)} onClick={() => toggle(tour.title)}><span className={styles.check}>{selected.includes(tour.title) ? "✓" : "+"}</span><span>{tour.title}</span></button>)}
        <button type="button" className={`${styles.tourOption} ${custom ? styles.active : ""}`} aria-pressed={custom} onClick={() => setCustom(x => !x)}><span className={styles.check}>{custom ? "✓" : "+"}</span><span>{t("notSure")} / Custom trip</span></button>
      </div>
      <div className={styles.separator}/>
      <div className={styles.sectionTitle}><span className={styles.number}>02</span><div><h3>Your trip details</h3><p>Share a few details so we can prepare a personalized offer.</p></div></div>
      <div className={styles.fields}>
        <label className={styles.full}><span data-k="pfName">{t("pfName")} *</span><input id="pfName" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Your name"/></label>
        <label><span data-k="pfStart">{t("pfStart")}</span><select id="pfStart" value={start} onChange={e => setStart(e.target.value)}><option>Batumi</option><option>Kutaisi</option><option>Tbilisi</option><option value="Other place (see notes)">Other place (see notes)</option></select></label>
        <label><span data-k="pfLen">{t("pfLen")}</span><select id="pfLen" value={length} onChange={e => setLength(e.target.value)}>{["1 day","2-3 days","4-7 days","8-14 days","Flexible"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label><span data-k="pfPeople">{t("pfPeople")}</span><select id="pfPeople" value={people} onChange={e => setPeople(e.target.value)}>{["1 person","2 people","3-4 people","5 or more people"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label><span data-k="pfCar">{t("pfCar")}</span><select id="pfCar" value={car} onChange={e => setCar(e.target.value)}>{["Not sure yet","Subaru Crosstrek 4x4","Jeep Wrangler","Minivan","Mercedes Luxury","Classic Mercedes Charlotte"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label><span data-k="pfWhen">{t("pfWhen")}</span><select id="pfSeason" value={season} onChange={e => setSeason(e.target.value)}>{["Flexible","Spring","Summer","Autumn","Winter"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label><span data-k="pfDates">{t("pfDates")}</span><input id="pfDates" value={dates} onChange={e => setDates(e.target.value)} placeholder="e.g. 15–20 July"/></label>
        <label className={styles.full}><span data-k="pfNotes">{t("pfNotes")}</span><textarea id="pfNotes" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preferences, destinations, pickup details, or questions"/></label>
      </div>
      <div className={styles.actions}><button type="button" id="pfSend" className={styles.send} onClick={send} disabled={!canSend} data-k="pfSend">{t("pfSend")} ↗</button><button type="button" id="pfCopy" className={styles.copy} onClick={copy} data-k="pfCopy">{copied ? "Copied!" : t("pfCopy")}</button></div>
      {!canSend && <p className={styles.helper}>Enter your name and choose a tour or the custom trip option to send a request.</p>}
    </div>
  </section></div>;
}

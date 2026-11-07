"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "./site-context";
import VehicleSelect from "./VehicleSelect";

const EMAIL = "SubTravelGeorgia@gmail.com";
const PHONE = "995558176108";
const SOCIALS = [
  ["WhatsApp", "https://wa.me/995558176108", "wa"],
  ["Telegram", "https://t.me/SubTravelGeorgia", "tg"],
  ["Facebook", "https://www.facebook.com/share/19PjaiQedA/", "fb"],
  ["Instagram", "https://www.instagram.com/viptravelgeorgia/", "ig"],
];
export default function ContactForm() {
  const { t } = useLanguage();
  const [tours, setTours] = useState([]);
  const [tourError, setTourError] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const response = await fetch("/api/published-tours", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load tours");
        if (mounted) { setTours(payload.tours || []); setTourError(false); }
      } catch (error) { if (mounted) setTourError(true); }
    }
    load();
    window.addEventListener("focus", load);
    return () => { mounted = false; window.removeEventListener("focus", load); };
  }, []);
  function details(form) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      tour: String(data.get("region") || "").trim(),
      vehicle: String(data.get("vehicle") || "").trim(),
      dates: String(data.get("dates") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "")
    };
  }
  function whatsapp(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = details(form);
    const body = [`VIP Travel Georgia inquiry`, `Name: ${d.name}`, `Email: ${d.email}`, `Tour or service: ${d.tour}`, `Vehicle: ${d.vehicle}`, `Dates and group size: ${d.dates}`, `Message: ${d.message}`].join("\n");
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
  }
  async function email(e) {
    const form = e.currentTarget.form;
    if (!form.reportValidity() || sending) return;
    setSending(true); setNotice("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details(form)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      setNotice("Your message was sent successfully. Thank you!");
      form.reset();
    } catch (error) { setNotice(error.message || "Unable to send. Please try WhatsApp."); }
    finally { setSending(false); }
  }
  return <section id="contact" className="vtg-unified-contact"><div className="wrap"><div className="vtg-contact-inner">
    <h2 data-k="contH">{t("contH")}</h2>
    <form className="vtg-contact-form" onSubmit={whatsapp}>
      <label><span data-k="fName">{t("fName")}</span><input name="name" maxLength={100} required /></label>
      <label><span>Email (for reply)</span><input name="email" type="email" maxLength={180} required placeholder="you@example.com" /></label>
      <label><span>Tour or Service</span><select name="region" defaultValue="" required><option value="" disabled>Select a tour or service</option>{tours.map(x => <option key={x.slug} value={x.title}>{x.title}</option>)}<option value="Airport transfer">Airport transfer</option><option value="Other / custom">Other / custom</option></select>{tourError && <small>Tour list unavailable; choose Other / custom or try again later.</small>}</label>
      <label><span data-k="fCar">{t("fCar")}</span><VehicleSelect name="vehicle" /></label>
      <label><span data-k="fDates">{t("fDates")}</span><input name="dates" maxLength={180} placeholder="e.g. 12–16 June, 3 people" /></label>
      <label className="vtg-contact-message"><span data-k="fMsg">{t("fMsg")}</span><textarea name="message" maxLength={4000} rows={6} required /></label>
      <div className="vtg-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="vtg-contact-actions"><button className="btn" type="submit">Send via WhatsApp</button><button className="btn vtg-email-button" type="button" onClick={email} disabled={sending}>{sending ? "Sending…" : "Send via Email"}</button></div>
      {notice && <p className="vtg-contact-notice" role="status">{notice}</p>}
    </form>
    <div className="links vtg-contact-socials">{SOCIALS.map(([label, href, id]) => <a key={id} id={id} href={href} target="_blank" rel="noopener noreferrer">{label}</a>)}</div>
  </div></div></section>;
}

"use client";
import { useState } from "react";
import { useLanguage } from "./site-context";
import usePublishedTours from "./usePublishedTours";
import VehicleSelect from "./VehicleSelect";

const EMAIL = "SubTravelGeorgia@gmail.com";
const PHONE = "995558176108";
const EXTRA_SERVICES = [
  { slug: "airport-transfers", title: "Airport transfer" },
  { slug: "custom-tour", title: "Other / custom" },
];
const SOCIALS = [
  ["WhatsApp", "https://wa.me/995558176108", "wa"],
  ["Telegram", "https://t.me/SubTravelGeorgia", "tg"],
  ["Facebook", "https://www.facebook.com/share/19PjaiQedA/", "fb"],
  ["Instagram", "https://www.instagram.com/viptravelgeorgia/", "ig"],
];
export default function ContactForm({ initialTour = "" }) {
  const { t } = useLanguage();
  const { tours, error: tourError } = usePublishedTours();
  const tourOptions = [...tours, ...EXTRA_SERVICES];
  const suggestedTour = tourOptions.find(option => option.slug === initialTour || option.title === initialTour)?.title ?? "";
  const [chosenTour, setChosenTour] = useState(null);
  const selectedTour = chosenTour === null ? suggestedTour : tourOptions.find(option => option.title === chosenTour)?.title ?? "";
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
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
      setChosenTour(null);
    } catch (error) { setNotice(error.message || "Unable to send. Please try WhatsApp."); }
    finally { setSending(false); }
  }
  return <section id="contact" className="vtg-unified-contact"><div className="wrap"><div className="vtg-contact-inner">
    <h2 data-k="contH">{t("contH")}</h2>
    <form className="vtg-contact-form" onSubmit={whatsapp}>
      <label><span data-k="fName">{t("fName")}</span><input name="name" maxLength={100} required /></label>
      <label><span>Email (for reply)</span><input name="email" type="email" maxLength={180} required placeholder="you@example.com" /></label>
      <label>
        <span>Tour or Service</span>
        <select name="region" value={selectedTour} onChange={event => setChosenTour(event.target.value)} required>
          <option value="" disabled>Select a tour or service</option>
          {tours.map(tour => <option key={tour.slug} value={tour.title}>{tour.title}</option>)}
          {EXTRA_SERVICES.map(service => <option key={`service:${service.slug}`} value={service.title}>{service.title}</option>)}
        </select>
        {tourError && <small>Tour list unavailable; choose Other / custom or try again later.</small>}
      </label>
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

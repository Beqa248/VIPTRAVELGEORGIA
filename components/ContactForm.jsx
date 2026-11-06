"use client";
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
  function send(e, channel) {
    e.preventDefault();
    const f = e.currentTarget.form || e.currentTarget;
    if (!f.reportValidity()) return;
    const data = new FormData(f);
    const subject = "VIP Travel Georgia inquiry";
    const body = [subject, `Name: ${data.get("name") || ""}`, `Region: ${data.get("region") || ""}`, `Vehicle: ${data.get("vehicle") || ""}`, `Dates and group size: ${data.get("dates") || ""}`, `Message: ${data.get("message") || ""}`].join("\n");
    if (channel === "email") {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
    }
  }
  return <section id="contact" className="vtg-unified-contact"><div className="wrap"><div className="vtg-contact-inner">
    <h2 data-k="contH">{t("contH")}</h2>
    <form className="vtg-contact-form" onSubmit={e => send(e, "whatsapp")}>
      <label><span data-k="fName">{t("fName")}</span><input name="name" required /></label>
      <label><span data-k="fTour">{t("fTour")}</span><select name="region"><option>Adjarian mountains</option><option>Martvili &amp; Prometheus</option><option>Gomis Mta</option><option>Svaneti</option><option>Kobuleti coast</option><option>Dashbashi Canyon &amp; Diamond Bridge</option><option>Vardzia &amp; Rabati</option><option>Tusheti</option><option>Beshumi &amp; Green Lake</option><option>Kazbegi &amp; Juta</option><option>Georgia Highlights</option><option>Airport transfer</option><option>Other / custom</option></select></label>
      <label><span data-k="fCar">{t("fCar")}</span><VehicleSelect name="vehicle" /></label>
      <label><span data-k="fDates">{t("fDates")}</span><input name="dates" placeholder="e.g. 12–16 June, 3 people" /></label>
      <label className="vtg-contact-message"><span data-k="fMsg">{t("fMsg")}</span><textarea name="message" rows={6} /></label>
      <div className="vtg-contact-actions"><button className="btn" type="submit">Send via WhatsApp</button><button className="btn vtg-email-button" type="button" onClick={e => send(e, "email")}>Send via Email</button></div>
    </form>
    <div className="links vtg-contact-socials">{SOCIALS.map(([label, href, id]) => <a key={id} id={id} href={href} target="_blank" rel="noopener noreferrer">{label}</a>)}</div>
    <p className="cinfo"><b data-k="cPhone">{t("cPhone")}</b>: <a href="tel:+995558176108">+995 558 17 61 08</a><br/><b data-k="cMail">{t("cMail")}</b>: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
  </div></div></section>;
}

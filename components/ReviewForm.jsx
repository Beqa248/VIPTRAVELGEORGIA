"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "./site-context";

export default function ReviewForm() {
  const { t } = useLanguage();
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!supabase) { setMessage({ key: "reviewFormNotConfigured" }); return; }
    setBusy(true);
    setMessage(null);
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      name: String(f.get("name") || "").trim(),
      country: String(f.get("country") || "").trim(),
      tour: String(f.get("tour") || "").trim(),
      rating: Number(f.get("rating")),
      text: String(f.get("text") || "").trim(),
      approved: false,
    };
    try {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) setMessage({ key: "reviewFormError", detail: error.message });
      else { form.reset(); setMessage({ key: "reviewFormSuccess" }); }
    } catch (error) {
      setMessage({ key: "reviewFormError", detail: error?.message || "" });
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="guest-review-form">
      <h3>{t("reviewFormTitle")}</h3>
      <p>{t("reviewFormIntro")}</p>
      <label>{t("reviewFormName")}<input name="name" required maxLength={80}/></label>
      <label>{t("reviewFormCountry")}<input name="country" maxLength={80}/></label>
      <label>{t("reviewFormTour")}<input name="tour" maxLength={120}/></label>
      <label>{t("reviewFormRating")}
        <select name="rating" defaultValue="5">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} {t("reviewFormStars")}</option>)}
        </select>
      </label>
      <label>{t("reviewFormText")}<textarea name="text" required minLength={10} maxLength={1500} rows={4}/></label>
      <button className="btn" disabled={busy}>{busy ? t("reviewFormSubmitting") : t("reviewFormSubmit")}</button>
      {message && <p role="status">{t(message.key)}{message.detail ? ` ${message.detail}` : ""}</p>}
    </form>
  );
}

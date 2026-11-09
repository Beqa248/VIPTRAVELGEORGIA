"use client";

import Link from "next/link";
import { useState } from "react";
import { chromeLabels } from "../../lib/chromeLabels";
import { localizedPath } from "../../lib/localizedPath";
import { useLanguage } from "../../components/site-context";
import styles from "./booking.module.css";

export default function Booking() {
  const { lang, t } = useLanguage();
  const [price, setPrice] = useState("");
  const value = Number(price);
  const amount = Number.isFinite(value) && value > 0 ? value : 0;
  const currency = new Intl.NumberFormat(lang, { style: "currency", currency: "GEL" });
  const deposit = amount * 0.2;
  const message = amount
    ? `Hello! I would like to confirm a private tour priced at ${amount} GEL with a 20% deposit of ${deposit.toFixed(2)} GEL.`
    : "Hello! I would like to discuss a private tour and request a booking.";

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <p>{t("homeLocation")}</p>
        <h1>{t("pricesBooking")}</h1>
        <p>{t("pricesIntro")}</p>
      </div>
      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="calculator-heading">
          <h2 id="calculator-heading">{t("calculatePrice")}</h2>
          <label htmlFor="agreed-price">{t("agreedTourPrice")}</label>
          <input id="agreed-price" type="number" min="0" step="0.01" inputMode="decimal"
            value={price} placeholder="1000" onChange={(event) => setPrice(event.target.value)} />
          <dl className={styles.totals}>
            <div>
              <dt>{t("bookingDeposit")}</dt>
              <dd><output htmlFor="agreed-price">{amount ? currency.format(deposit) : "—"}</output></dd>
            </div>
            <div>
              <dt>{t("bookingBalance")}</dt>
              <dd><output htmlFor="agreed-price">{amount ? currency.format(amount - deposit) : "—"}</output></dd>
            </div>
          </dl>
          <p className={styles.note}>{t("depositInfoNoPayment")}</p>
        </section>
        <section className={`${styles.panel} ${styles.request}`} aria-labelledby="request-heading">
          <h2 id="request-heading">{chromeLabels[lang].booking}</h2>
          <p>{t("depositInfoLeadBefore")}<strong>{t("depositInfoLeadBold")}</strong>{t("depositInfoLeadAfter")}</p>
          <p>{t("depositInfoDetails")}</p>
          <div className={styles.actions}>
            <Link href={localizedPath(lang, "/contact")} className={styles.primary}>{t("nCont")}</Link>
            <a className={styles.secondary} href={`https://wa.me/995558176108?text=${encodeURIComponent(message)}`}
              target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </section>
      </div>
    </div>
  );
}
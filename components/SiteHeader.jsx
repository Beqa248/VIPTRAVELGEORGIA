"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { chromeLabels } from "../lib/chromeLabels";
import { localizedPath } from "../lib/localizedPath";
import { useLanguage } from "./site-context";
import styles from "./SiteHeader.module.css";

const nav = [
  ["/", "nHome"],
  ["/tours", "nTours"],
  ["/travel", "nTravel"],
  ["/cars", "nCars"],
  ["/videos", "nVid"],
  ["/recent-tours", "recentTours"],
  ["/reviews", "revH"],
  ["/contact", "nCont"]
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.7 1.7a16 16 0 0 0 4.5 4.5l1.7-1.7a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export default function SiteHeader() {
  const { lang, setLang, t, currency, setCurrency } = useLanguage();
  const pathname = usePathname() || "/";
  const path = pathname.replace(/^\/(en|ka|ru|he)(?=\/|$)/, "") || "/";
  const labels = chromeLabels[lang] || chromeLabels.en;
  const [openPath, setOpenPath] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggle = useRef(null);
  const open = openPath === pathname;
  const close = () => { setOpenPath(null); setActiveDropdown(null); };
  const href = (url) => localizedPath(lang, url);

  function handleEscape(event) {
    if (open && event.key === "Escape") {
      close();
      toggle.current?.focus();
    }
  }

  return (
    <header className={styles.header} onKeyDown={handleEscape}>
      <a className={styles.skip} href="#main-content">{labels.skip}</a>
      <div className={styles.main}>
        <Link href={href("/")} className={styles.brand} onClick={close}>
          <Image src="/viptravelgeorgia-round-logo.webp" unoptimized alt="" width={77} height={77} sizes="77px" priority className={styles.brandLogo} />
          <span className={styles.brandText}>
            <strong>VIPTravel<span>Georgia</span></strong>
            <small>{labels.tagline}</small>
          </span>
        </Link>
        <div className={styles.right}>
          <a className={styles.phone} href="tel:+995558176108" aria-label={`${labels.call} +995 558 17 61 08`}>
            <PhoneIcon />
            <span className={styles.phoneText}>
              <small>{labels.contact}</small>
              <strong dir="ltr">+995 558 17 61 08</strong>
            </span>
          </a>
          <div className={`${styles.control} ${styles.dropdown}`} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c6 6 6 12 0 18M12 3c-6 6-6 12 0 18" />
            </svg>
            <button type="button" className={styles.dropdownTrigger} aria-label={labels.language}
              aria-haspopup="true" aria-expanded={activeDropdown === "language"}
              onClick={() => setActiveDropdown(activeDropdown === "language" ? null : "language")}
              onKeyDown={(event) => { if (event.key === "Escape") setActiveDropdown(null); }}>
              {lang.toUpperCase()} <span aria-hidden="true">⌄</span>
            </button>
            {activeDropdown === "language" && <div className={styles.dropdownMenu} role="group" aria-label={labels.language}>
              {[["en", "EN"], ["ka", "KA"], ["ru", "RU"], ["he", "HE"]].map(([value, label]) => (
                <button type="button" key={value} lang={value} aria-pressed={lang === value}
                  className={styles.dropdownOption} onClick={() => { setLang(value); close(); }}>{label}</button>
              ))}
            </div>}
          </div>
          <button ref={toggle} type="button" className={styles.toggle} aria-expanded={open} aria-controls="site-navigation"
            aria-label={open ? labels.close : labels.open} onClick={() => setOpenPath(open ? null : pathname)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d={open ? "m6 6 12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      <nav id="site-navigation" className={styles.nav} data-open={open} aria-label={labels.nav}>
        <div className={styles.navInner}>
          <ul className={styles.links}>
            {nav.map(([url, key]) => {
              const current = path === url;
              return (
                <li key={url}>
                  <Link href={href(url)} aria-current={current ? "page" : undefined} onClick={close}>
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.navActions}>
            <a className={styles.navPhone} href="tel:+995558176108">
              <PhoneIcon />
              <span dir="ltr">+995 558 17 61 08</span>
            </a>
            <div className={`${styles.control} ${styles.currency} ${styles.dropdown}`} onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
            }}>
              <button type="button" className={styles.dropdownTrigger} aria-label={labels.currency}
                aria-haspopup="true" aria-expanded={activeDropdown === "currency"}
                onClick={() => setActiveDropdown(activeDropdown === "currency" ? null : "currency")}
                onKeyDown={(event) => { if (event.key === "Escape") setActiveDropdown(null); }}>
                {currency === "USD" ? "USD $" : currency === "EUR" ? "EUR €" : "GEL ₾"} <span aria-hidden="true">⌄</span>
              </button>
              {activeDropdown === "currency" && <div className={styles.dropdownMenu} role="group" aria-label={labels.currency}>
                {[["USD", "USD $"], ["EUR", "EUR €"], ["GEL", "GEL ₾"]].map(([value, label]) => (
                  <button type="button" key={value} aria-pressed={currency === value}
                    className={styles.dropdownOption} onClick={() => { setCurrency(value); setActiveDropdown(null); }}>{label}</button>
                ))}
              </div>}
            </div>
            <Link href={href("/booking")} className={styles.booking}
              aria-current={path === "/booking" ? "page" : undefined} onClick={close}>
              {labels.booking}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

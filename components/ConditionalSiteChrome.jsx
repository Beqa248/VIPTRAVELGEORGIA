"use client";

import { usePathname } from "next/navigation";
import GalleryLightbox from "./GalleryLightbox";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./ConditionalSiteChrome.module.css";

export default function ConditionalSiteChrome({ children }) {
  const pathname = usePathname() || "";
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!admin && <SiteHeader />}
      <main id={admin ? undefined : "main-content"} tabIndex={admin ? undefined : -1} className={admin ? "admin-app-shell" : "vtg-shell"}>
        {children}
      </main>
      {!admin && (
        <>
          <SiteFooter />
          <GalleryLightbox />
          <a className={styles.whatsapp} href="https://wa.me/995558176108" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 11.6a8.1 8.1 0 0 1-11.8 7.2L3 20l1.3-5.1a8.1 8.1 0 1 1 15.7-3.3Z" />
              <path d="M8.4 8.3c.5-.4.9-.1 1.2.5l.7 1.2c.2.4-.2.8-.5 1.1.8 1.5 1.9 2.4 3.4 3.1.4-.4.7-.9 1.2-.7l1.5.8c.5.3.4.8 0 1.2-.6.7-1.6.8-2.6.4-2.5-1-4.4-2.9-5.4-5.2-.3-.8-.2-1.7.5-2.4Z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </>
      )}
    </>
  );
}
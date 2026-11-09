import SeoBusinessJsonLd from "../components/SeoBusinessJsonLd";
import ConditionalSiteChrome from "../components/ConditionalSiteChrome";
import "./globals.css";
import "./site-wide-refresh.css";
import "./approved-layout.css";
import "./final-home-layout.css";
import "./inner-pages-layout.css";
import "./aligned-home-blocks.css";
import "./equal-review-cards.css";
import "./final-approved-polish.css";
import "./contact-layout-fix.css";
import "./contact-unified-and-footer.css";
import "./gallery-highlights-fixes.css";
import { headers } from "next/headers";
import { getLocale, pageMetadata } from "../lib/seo";
import { LanguageProvider } from "../components/site-context";

export async function generateMetadata() {
  const requestHeaders = await headers();
  return {
    ...pageMetadata(requestHeaders.get("x-vtg-path"), requestHeaders.get("x-vtg-locale")),
    icons: { icon: "/favicon.svg" },
  };
}
export default async function RootLayout({ children }) { const h=await headers(); const lang=getLocale(h.get("x-vtg-locale")); return <html lang={lang} dir={lang==="he"?"rtl":"ltr"}><body><SeoBusinessJsonLd/><LanguageProvider initialLang={lang}><ConditionalSiteChrome>{children}</ConditionalSiteChrome></LanguageProvider></body></html>; }

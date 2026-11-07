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
import { PAGE_SEO, localizedMetadata } from "../lib/seo";
import { LanguageProvider } from "../components/site-context";
import { seoMetadata, DEFAULT_DESCRIPTION } from "../lib/seo";
export async function generateMetadata() {
 const h=await headers(); const lang=h.get("x-vtg-locale") || "en";
 const path=h.get("x-vtg-path") || "/";
 const [title,description]=PAGE_SEO[path] || PAGE_SEO["/"];
 return localizedMetadata(path,title,description,undefined,lang);
}
export default async function RootLayout({ children }) { const h=await headers(); const lang=h.get("x-vtg-locale") || "en"; return <html lang={lang} dir={lang==="he"?"rtl":"ltr"}><body><SeoBusinessJsonLd/><LanguageProvider initialLang={lang}><ConditionalSiteChrome>{children}</ConditionalSiteChrome></LanguageProvider></body></html>; }

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
import { LanguageProvider } from "../components/site-context";
import { seoMetadata, DEFAULT_DESCRIPTION } from "../lib/seo";
export const metadata = seoMetadata("/", "Private Tours in Georgia | VIPTravelGeorgia", DEFAULT_DESCRIPTION);
export default function RootLayout({ children }) { return <html lang="en"><body><SeoBusinessJsonLd/><LanguageProvider><ConditionalSiteChrome>{children}</ConditionalSiteChrome></LanguageProvider></body></html>; }

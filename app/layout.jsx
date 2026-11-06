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
import { LanguageProvider } from "../components/site-context";
export const metadata = { title: "VIPTravelGeorgia — Private Tours", description: "Private tours across Georgia from Batumi" };
export default function RootLayout({ children }) { return <html lang="en"><body><LanguageProvider><ConditionalSiteChrome>{children}</ConditionalSiteChrome></LanguageProvider></body></html>; }

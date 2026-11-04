import GalleryLightbox from "../components/GalleryLightbox";
import "./globals.css";
import "./site-wide-refresh.css";
import "./approved-layout.css";
import "./final-home-layout.css";
import "./inner-pages-layout.css";
import "./aligned-home-blocks.css";
import "./equal-review-cards.css";
import { LanguageProvider } from "../components/site-context";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
export const metadata = { title: "VIPTravelGeorgia — Private Tours", description: "Private tours across Georgia from Batumi" };
export default function RootLayout({ children }) { return <html lang="en"><body><LanguageProvider><SiteHeader /><main className="vtg-shell">{children}</main><SiteFooter /><GalleryLightbox /><a className="wafloat" href="https://wa.me/995558176108" target="_blank" rel="noreferrer">WhatsApp</a></LanguageProvider></body></html>; }

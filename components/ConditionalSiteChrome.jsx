"use client";
import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import GalleryLightbox from "./GalleryLightbox";
export default function ConditionalSiteChrome({ children }) {
  const pathname = usePathname() || "";
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  return <>{!admin && <SiteHeader />}<main className={admin ? "admin-app-shell" : "vtg-shell"}>{children}</main>{!admin && <><SiteFooter /><GalleryLightbox /><a className="wafloat" href="https://wa.me/995558176108" target="_blank" rel="noreferrer">WhatsApp</a></>}</>;
}

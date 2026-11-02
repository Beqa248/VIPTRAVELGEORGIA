"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./site-context";
export default function SiteHeader() { const { lang, setLang, t } = useLanguage(); const path = usePathname(); return (<header><div className="wrap"><Link className="logo" href="/"><span style={{ fontSize: 25 }}>🏔️</span><span>VIPTravelGeorgia</span></Link><div className="lang">{["en", "ru", "ka", "he"].map(l => <button key={l} onClick={() => setLang(l)} className={lang === l ? "on" : ""}>{l.toUpperCase()}</button>)}</div></div><nav><div className="wrap">{[["/", "nHome"], ["/tours", "nTours"], ["/travel", "nTravel"], ["/cars", "nCars"], ["/videos", "nVid"], ["/recent-tours", "recentTours"], ["/reviews", "revH"], ["/contact", "nCont"]].map(([url, key]) => <Link key={url} className={path === url ? "on" : ""} href={url}>{key === "recentTours" ? "Recent Tours" : t(key)}</Link>)}</div></nav></header>); }

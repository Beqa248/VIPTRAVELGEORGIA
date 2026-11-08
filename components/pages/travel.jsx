"use client";
import { useLanguage } from "../site-context";
import RegionTiles from "../RegionTiles";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="travel">
    <div className="banner" id="bn-travel" style={{ backgroundImage: "url(/images/photo-027.jpg)", backgroundPosition: "center 55%" }}><div className="wrap"><span></span><div><h1 data-k="trH">{t("trH")}</h1><p className="sub" data-k="trSub">{t("trSub")}</p><p style={{ "marginTop": "14px" }}><a className="btn" href="#trRegions" data-k="trExplore">{t("trExplore")}</a> <a className="btn alt" href="/plan" data-k="trPlan">{t("trPlan")}</a></p></div></div></div>
    <section id="trRegions"><div className="wrap"><h2 style={{maxWidth:"980px",fontSize:"clamp(19px,2.1vw,27px)",lineHeight:1.35}}>Discover Georgia&apos;s breathtaking landscapes, historic landmarks, rich culture, and authentic regional cuisine.</h2><RegionTiles /></div></section>
    <section className="why"><div className="wrap"><h2 data-k="trGemH">{t("trGemH")}</h2><p data-k="trGemT" style={{ "maxWidth": "660px" }}>{t("trGemT")}</p><a className="btn" id="gemWa" href="#" target="_blank" rel="noopener" style={{ "background": "#25d366", "boxShadow": "none" }} data-k="trGemBtn">{t("trGemBtn")}</a></div></section>
    <section className="why" style={{ "background": "#fff1d0" }}><div className="wrap"><h2 data-k="seasonH">{t("seasonH")}</h2><div className="seas"><p data-k="s1">{t("s1")}</p><p data-k="s2">{t("s2")}</p><p data-k="s3">{t("s3")}</p><p data-k="s4">{t("s4")}</p><p data-k="s5">{t("s5")}</p></div><p data-k="seasonNote" style={{ "color": "var(--mut)", "fontSize": "14px", "marginTop": "12px" }}>{t("seasonNote")}</p></div></section>
    <section><div className="wrap"><h2 data-k="trWayH">{t("trWayH")}</h2><p data-k="trWayT" style={{ "maxWidth": "640px" }}>{t("trWayT")}</p><a className="btn" href="/plan" data-k="trWayBtn">{t("trWayBtn")}</a></div></section></div>
    </>);
}

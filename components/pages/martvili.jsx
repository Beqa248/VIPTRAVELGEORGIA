"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="martvili">
    <div className="banner" id="bn-martvili" style={{ backgroundImage: "url(/images/photo-009.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t2">{t("t2")}</h1><p className="sub" data-k="d2">{t("d2")}</p></div></div></div>
    <section id="martvili" style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal2">
    <img src="/images/photo-009.jpg" alt="Turquoise water in Martvili canyon" loading="lazy"/>
    <img src="/images/photo-010.jpg" alt="Martvili canyon with a walkway bridge" loading="lazy"/>
    <img src="/images/photo-011.jpg" alt="Waterfalls in a rocky canyon" loading="lazy"/>
    <img src="/images/photo-012.jpg" alt="Green gorge with a clear river" loading="lazy"/>
    <img src="/images/photo-013.jpg" alt="Stalactite hall in Prometheus Cave" loading="lazy"/>
    <img src="/images/photo-014.jpg" alt="Prometheus Cave walkway among lit rock formations" loading="lazy"/>
    <img src="/images/photo-015.jpg" alt="Prometheus Cave with colored lighting" loading="lazy"/>
    <img src="/images/photo-016.jpg" alt="Prometheus Cave halls and underground water" loading="lazy"/>
    <img src="/images/photo-017.jpg" alt="Prometheus Cave stalactites" loading="lazy"/>
    </div></div></section></div>
    </>);
}

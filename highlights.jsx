"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="highlights">
    <div className="banner" id="bn-highlights" style={{ backgroundImage: "url(/images/photo-086.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t12">{t("t12")}</h1><p className="sub" data-k="d12">{t("d12")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal11">
    <img src="/images/photo-086.jpg" alt="Jvari Monastery above the river in Mtskheta at sunset" loading="lazy"/>
    <img src="/images/photo-087.jpg" alt="Svaneti village of stone towers below snowy peaks" loading="lazy"/>
    <img src="/images/photo-088.jpg" alt="Gergeti Trinity Church above a snowy mountain wall" loading="lazy"/>
    <img src="/images/photo-089.jpg" alt="Cobbled street and old town rooftops of Sighnaghi above the Alazani valley" loading="lazy"/>
    <img src="/images/photo-090.jpg" alt="Svetitskhoveli Cathedral among the red roofs of Mtskheta" loading="lazy"/>
    <img src="/images/photo-091.jpg" alt="Rafting boats in the turquoise Martvili canyon" loading="lazy"/>
    <img src="/images/photo-092.jpg" alt="Lit walkway through a Prometheus Cave hall" loading="lazy"/>
    <img src="/images/photo-093.jpg" alt="Painted Friendship Monument above the mountains near Gudauri" loading="lazy"/>
    <img src="/images/photo-094.jpg" alt="Historic mansion and gardens in autumn colors" loading="lazy"/>
    <img src="/images/photo-095.jpg" alt="Green mountains and a snow-streaked peak in the Greater Caucasus" loading="lazy"/>
    <img src="/images/photo-096.jpg" alt="Hilltop monastery above a wide autumn valley" loading="lazy"/>
    <img src="/images/photo-097.jpg" alt="Sighnaghi rooftops with the Alazani valley and mountains behind" loading="lazy"/>
    <img src="/images/photo-098.jpg" alt="Alaverdi Monastery under dramatic clouds" loading="lazy"/>
    </div></div></section></div>
    </>);
}

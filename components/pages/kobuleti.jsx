"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="kobuleti">
    <div className="banner" id="bn-kobuleti"><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t6">{t("t6")}</h1><p className="sub" data-k="d6">{t("d6")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal5">
    <img src="/images/photo-043.jpg" alt="Hilltop ruins with green terraces above the Black Sea" loading="lazy"/>
    <img src="/images/photo-044.jpg" alt="Pink flamingos wading in a green pond" loading="lazy"/>
    <img src="/images/photo-045.jpg" alt="Two blue-and-yellow macaws on a window ledge" loading="lazy"/>
    <img src="/images/photo-046.jpg" alt="Spotted deer resting in a eucalyptus grove" loading="lazy"/>
    <img src="/images/photo-047.jpg" alt="Miniature model of an old town on a hill" loading="lazy"/>
    <img src="/images/photo-048.jpg" alt="Bronze band statue among tall trees in a park" loading="lazy"/>
    <img src="/images/photo-049.jpg" alt="Lake with flamingos at a wildlife park" loading="lazy"/>
    </div></div></section></div>
    </>);
}

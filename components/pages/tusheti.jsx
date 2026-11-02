"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="tusheti">
    <div className="banner" id="bn-tusheti"><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t9">{t("t9")}</h1><p className="sub" data-k="d9">{t("d9")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal8">
    <img src="/images/photo-063.jpg" alt="Dartlo village with stone towers below a mountain peak" loading="lazy"/>
    <img src="/images/photo-064.jpg" alt="Stone tower village with wooden balconies in the misty Tusheti mountains" loading="lazy"/>
    <img src="/images/photo-065.jpg" alt="Hilltop towers above a Tusheti village in the evening sun" loading="lazy"/>
    <img src="/images/photo-066.jpg" alt="Aerial view of a green Tusheti village among forested mountains" loading="lazy"/>
    <img src="/images/photo-067.jpg" alt="Slate and wood houses of a Tusheti village climbing the hillside" loading="lazy"/>
    </div></div></section></div>
    </>);
}

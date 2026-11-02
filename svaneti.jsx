"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="svaneti">
    <div className="banner" style={{ "backgroundImage": "url(images/photo-025.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t4">{t("t4")}</h1><p className="sub" data-k="d4">{t("d4")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal4">
    <img src="/images/photo-026.jpg" alt="Alpine lake reflecting the Svaneti peaks" loading="lazy"/>
    <img src="/images/photo-027.jpg" alt="Green valley and river below snowy peaks" loading="lazy"/>
    <img src="/images/photo-028.jpg" alt="Tall waterfall in a Svaneti gorge" loading="lazy"/>
    <img src="/images/photo-029.jpg" alt="Cable car above the forest with mountain views" loading="lazy"/>
    <img src="/images/photo-030.jpg" alt="Alpine meadow and jagged ridges" loading="lazy"/>
    <img src="/images/photo-031.jpg" alt="Glacier tongue under a cloudy peak" loading="lazy"/>
    <img src="/images/photo-032.jpg" alt="Green ridges and distant snowy range" loading="lazy"/>
    <img src="/images/photo-033.jpg" alt="Wide green valley leading to snow-capped mountains" loading="lazy"/>
    <img src="/images/photo-034.jpg" alt="Snow-capped Svaneti peaks above green slopes" loading="lazy"/>
    <img src="/images/photo-035.jpg" alt="Svan stone towers glowing in golden light under snowy peaks" loading="lazy"/>
    <img src="/images/photo-036.jpg" alt="Svaneti village at night with lit stone towers in the snow" loading="lazy"/>
    <img src="/images/photo-037.jpg" alt="Old stone tower and church below a huge snowy mountain wall" loading="lazy"/>
    <img src="/images/photo-038.jpg" alt="Stone tower village in a green Svaneti valley" loading="lazy"/>
    <img src="/images/photo-039.jpg" alt="Sunbeams over a village of stone towers" loading="lazy"/>
    <img src="/images/photo-040.jpg" alt="Colorful village with stone towers and snowy peaks" loading="lazy"/>
    <img src="/images/photo-041.jpg" alt="Stone towers and houses under a snow-covered mountain face" loading="lazy"/>
    <img src="/images/photo-042.jpg" alt="Svan towers with snowy mountains behind" loading="lazy"/>
    </div></div></section></div>
    </>);
}

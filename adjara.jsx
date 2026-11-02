"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="adjara">
    <div className="banner" id="bn-adjara" style={{ backgroundImage: "url(/images/photo-002.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t1">{t("t1")}</h1><p className="sub" data-k="d1">{t("d1")}</p></div></div></div>
    <section id="adjara" style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal">
    <img src="/images/photo-002.jpg" alt="Tall waterfall in the Adjarian mountains" loading="lazy"/>
    <img src="/images/photo-003.jpg" alt="Waterfall in a green Adjarian forest" loading="lazy"/>
    <img src="/images/photo-004.jpg" alt="Cascading waterfall in Adjara" loading="lazy"/>
    <img src="/images/photo-005.jpg" alt="River valley view in the Adjarian mountains" loading="lazy"/>
    <img src="/images/photo-006.jpg" alt="Zipline over the autumn forest" loading="lazy"/>
    <img src="/images/photo-007.jpg" alt="Rafting on a mountain river" loading="lazy"/>
    <img src="/images/photo-008.jpg" alt="Vineyards in the mountains at sunset" loading="lazy"/>
    </div></div></section>
    </div>
    </>);
}

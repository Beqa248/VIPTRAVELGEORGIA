"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="vardzia">
    <div className="banner" id="bn-vardzia" style={{ backgroundImage: "url(/images/photo-056.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t8">{t("t8")}</h1><p className="sub" data-k="d8">{t("d8")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal7">
    <img src="/images/photo-056.jpg" alt="Rabati Castle towers, gardens and courtyards in Akhaltsikhe" loading="lazy"/>
    <img src="/images/photo-057.jpg" alt="Vardzia cave city carved into a rock face" loading="lazy"/>
    <img src="/images/photo-058.jpg" alt="Vardzia cave city at sunset above the river valley" loading="lazy"/>
    <img src="/images/photo-059.jpg" alt="Rabati Castle towers, walls and the square inside" loading="lazy"/>
    <img src="/images/photo-060.jpg" alt="Walkways and cave openings on the Vardzia cliff" loading="lazy"/>
    <img src="/images/photo-061.jpg" alt="Rabati Castle from above with the road and mountains" loading="lazy"/>
    <img src="/images/photo-062.jpg" alt="Rabati Castle with its gardens and golden dome" loading="lazy"/>
    </div></div></section></div>
    </>);
}

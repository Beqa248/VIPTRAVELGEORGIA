"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="gomis">
    <div className="banner" id="bn-gomis"><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t3">{t("t3")}</h1><p className="sub" data-k="d3">{t("d3")}</p></div></div></div>
    <section id="gomis" style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal3">
    <img src="/images/photo-018.jpg" alt="Sunset above a sea of clouds at Gomis Mta" loading="lazy"/>
    <img src="/images/photo-019.jpg" alt="Golden sky and clouds below the Gomis Mta ridge" loading="lazy"/>
    <img src="/images/photo-020.jpg" alt="Glowing sun over the cloud sea" loading="lazy"/>
    <img src="/images/photo-021.jpg" alt="Soft sunset behind layers of clouds" loading="lazy"/>
    <img src="/images/photo-022.jpg" alt="Guests relaxing on the mountain at sunset" loading="lazy"/>
    <img src="/images/photo-023.jpg" alt="Fresh shashlik grilling on the mountain" loading="lazy"/>
    <img src="/images/photo-024.jpg" alt="Wooden huts on the Gomis Mta ridge at dusk above the clouds" loading="lazy"/>
    </div></div></section></div>
    </>);
}

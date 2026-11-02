"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="kazbegi">
    <div className="banner" id="bn-kazbegi" style={{ backgroundImage: "url(/images/photo-078.jpg)" }}><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t11">{t("t11")}</h1><p className="sub" data-k="d11">{t("d11")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal10">
    <img src="/images/photo-078.jpg" alt="Green Juta valley with hammocks and the Chaukhi peaks ahead" loading="lazy"/>
    <img src="/images/photo-079.jpg" alt="Trail signpost in Juta pointing to Chaukhi Lake and the pass" loading="lazy"/>
    <img src="/images/photo-080.jpg" alt="Gergeti Trinity Church on a green hill above misty mountains" loading="lazy"/>
    <img src="/images/photo-081.jpg" alt="Gergeti Trinity Church under stormy clouds and dark peaks" loading="lazy"/>
    <img src="/images/photo-082.jpg" alt="Juta village on the slope below the Chaukhi massif" loading="lazy"/>
    <img src="/images/photo-083.jpg" alt="Horses grazing in the Juta valley with the Chaukhi peaks behind" loading="lazy"/>
    <img src="/images/photo-084.jpg" alt="Hammocks, deck chairs and a wooden lodge on the Juta meadow" loading="lazy"/>
    <img src="/images/photo-085.jpg" alt="Village below the snowy slopes of Mount Kazbek" loading="lazy"/>
    </div></div></section></div>
    </>);
}

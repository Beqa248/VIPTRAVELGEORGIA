"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="beshumi">
    <div className="banner" id="bn-beshumi"><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t10">{t("t10")}</h1><p className="sub" data-k="d10">{t("d10")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal9">
    <img src="/images/photo-068.jpg" alt="Beshumi mountain village of wooden houses among pines and green meadows" loading="lazy"/>
    <img src="/images/photo-069.jpg" alt="Colorful wooden houses on a green Beshumi hillside" loading="lazy"/>
    <img src="/images/photo-070.jpg" alt="Beshumi village houses above a pine forest" loading="lazy"/>
    <img src="/images/photo-071.jpg" alt="Village houses scattered across golden mountain meadows" loading="lazy"/>
    <img src="/images/photo-072.jpg" alt="Wooden village with snow-streaked peaks behind" loading="lazy"/>
    <img src="/images/photo-073.jpg" alt="Turquoise Green Lake surrounded by pines" loading="lazy"/>
    <img src="/images/photo-074.jpg" alt="Green Lake calm water between forested slopes" loading="lazy"/>
    <img src="/images/photo-075.jpg" alt="Green Lake seen from above with the mountain meadows beyond" loading="lazy"/>
    <img src="/images/photo-076.jpg" alt="Panorama of Green Lake and the Beshumi highlands" loading="lazy"/>
    <img src="/images/photo-077.jpg" alt="Turquoise lake framed by spruce trees" loading="lazy"/>
    </div></div></section></div>
    </>);
}

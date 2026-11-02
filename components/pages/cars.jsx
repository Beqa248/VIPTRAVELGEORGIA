"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="cars">
    <section><div className="wrap"><h2 data-k="carsH">{t("carsH")}</h2>
    <div className="tabs" id="carTabs"><button className="on" data-c="0">Subaru Crosstrek 4x4</button><button data-c="1">Jeep Wrangler</button><button data-c="2" data-k="carMini">{t("carMini")}</button><button data-c="3" data-k="carLux">{t("carLux")}</button><button data-c="4" data-k="carClassic">{t("carClassic")}</button></div>
    <div className="carsec on" data-c="0"><p className="cd" data-k="carD1">{t("carD1")}</p><div className="gal soft" id="galC1">
    <img src="/images/photo-099.jpg" alt="White Subaru Crosstrek with Mount Kazbek behind" loading="lazy"/>
    <img src="/images/photo-100.jpg" alt="Subaru Crosstrek above the clouds at sunset" loading="lazy"/>
    <img src="/images/photo-101.jpg" alt="Driver-guide leaning on the Subaru Crosstrek above the clouds" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Subaru Crosstrek 4x4" data-k="carAsk">{t("carAsk")}</a></p></div>
    <div className="carsec" data-c="1"><p className="cd" data-k="carD2">{t("carD2")}</p><div className="gal soft" id="galC2">
    <img src="/images/photo-102.jpg" alt="Black Jeep Wrangler Unlimited on a sunny street" loading="lazy"/>
    <img src="/images/photo-103.jpg" alt="Black Jeep Wrangler front view with a mountain road behind" loading="lazy"/>
    <img src="/images/photo-104.jpg" alt="Jeep Wrangler parked in front of a wooden mountain lodge" loading="lazy"/>
    <img src="/images/photo-105.jpg" alt="Jeep Wrangler seen from behind on a mountain road" loading="lazy"/>
    <img src="/images/photo-106.jpg" alt="Jeep Wrangler front seats and dashboard" loading="lazy"/>
    <img src="/images/photo-107.jpg" alt="Jeep Wrangler rear seats" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Jeep Wrangler" data-k="carAsk">{t("carAsk")}</a></p></div>
    <div className="carsec" data-c="2"><p className="cd" data-k="carD3">{t("carD3")}</p><div className="gal soft" id="galC3">
    <img src="/images/photo-108.jpg" alt="White Honda minivan parked by palm trees" loading="lazy"/>
    <img src="/images/photo-109.jpg" alt="White minivan front and side view" loading="lazy"/>
    <img src="/images/photo-110.jpg" alt="White minivan parked on a city street" loading="lazy"/>
    <img src="/images/photo-111.jpg" alt="White minivan from behind with the spoiler and rear windows" loading="lazy"/>
    <img src="/images/photo-112.jpg" alt="Minivan leather seats and rows of headrests" loading="lazy"/>
    <img src="/images/photo-113.jpg" alt="Minivan dashboard and front seats" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Minivan" data-k="carAsk">{t("carAsk")}</a></p></div>
    <div className="carsec" data-c="3"><p className="cd" data-k="carD4">{t("carD4")}</p><div className="gal soft" id="galC4"></div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Mercedes Luxury" data-k="carAsk">{t("carAsk")}</a></p></div>
    <div className="carsec" data-c="4"><p className="cd" data-k="carD5">{t("carD5")}</p><div className="gal soft" id="galC5"></div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Classic Mercedes Charlotte" data-k="carAsk">{t("carAsk")}</a></p></div>
    </div></section></div>
    </>);
}

"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="dashbashi">
    <div className="banner" id="bn-dashbashi"><div className="wrap"><a className="bk" href="/tours" data-k="back">{t("back")}</a><div><h1 data-k="t7">{t("t7")}</h1><p className="sub" data-k="d7">{t("d7")}</p></div></div></div>
    <section style={{ "paddingTop": "30px" }}><div className="wrap"><div className="gal soft" id="gal6">
    <img src="/images/photo-050.jpg" alt="Waterfalls streaming down a mossy rock wall at Dashbashi Canyon" loading="lazy"/>
    <img src="/images/photo-051.jpg" alt="Glass Diamond Bridge spanning the Dashbashi canyon" loading="lazy"/>
    <img src="/images/photo-052.jpg" alt="Clear blue-green pool below a wall of small waterfalls" loading="lazy"/>
    <img src="/images/photo-053.jpg" alt="Cable bikes riding beneath the diamond-shaped glass platform" loading="lazy"/>
    <img src="/images/photo-054.jpg" alt="Waterfalls pouring into a mossy green pool" loading="lazy"/>
    <img src="/images/photo-055.jpg" alt="Waterfalls and a rocky stream in the green Dashbashi canyon" loading="lazy"/>
    </div></div></section></div>
    </>);
}

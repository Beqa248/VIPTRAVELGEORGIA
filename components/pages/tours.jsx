"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="tours">
    <section id="tours"><div className="wrap"><h2 data-k="toursH">{t("toursH")}</h2>
    <div className="grid">
    <div className="card"><div className="pic p3"></div><div className="t"><h3 data-k="t1">{t("t1")}</h3><p data-k="d1">{t("d1")}</p><p className="lnk"><a href="/adjara" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p2"></div><div className="t"><h3 data-k="t2">{t("t2")}</h3><p data-k="d2">{t("d2")}</p><p className="lnk"><a href="/martvili" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p4"></div><div className="t"><h3 data-k="t3">{t("t3")}</h3><p data-k="d3">{t("d3")}</p><p className="lnk"><a href="/gomis" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p1"></div><div className="t"><h3 data-k="t4">{t("t4")}</h3><p data-k="d4">{t("d4")}</p><p className="lnk"><a href="/svaneti" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p6"></div><div className="t"><h3 data-k="t6">{t("t6")}</h3><p data-k="d6">{t("d6")}</p><p className="lnk"><a href="/kobuleti" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p7"></div><div className="t"><h3 data-k="t7">{t("t7")}</h3><p data-k="d7">{t("d7")}</p><p className="lnk"><a href="/dashbashi" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p8"></div><div className="t"><h3 data-k="t8">{t("t8")}</h3><p data-k="d8">{t("d8")}</p><p className="lnk"><a href="/vardzia" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p9"></div><div className="t"><h3 data-k="t9">{t("t9")}</h3><p data-k="d9">{t("d9")}</p><p className="lnk"><a href="/tusheti" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p10"></div><div className="t"><h3 data-k="t10">{t("t10")}</h3><p data-k="d10">{t("d10")}</p><p className="lnk"><a href="/beshumi" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p11"></div><div className="t"><h3 data-k="t11">{t("t11")}</h3><p data-k="d11">{t("d11")}</p><p className="lnk"><a href="/kazbegi" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p12"></div><div className="t"><h3 data-k="t12">{t("t12")}</h3><p data-k="d12">{t("d12")}</p><p className="lnk"><a href="/highlights" data-k="more">{t("more")}</a></p></div></div>
    <div className="card"><div className="pic p13"></div><div className="t"><h3 data-k="t13">{t("t13")}</h3><p data-k="d13">{t("d13")}</p><p className="lnk"><a href="/contact" data-r="Airport transfer" data-k="ask">{t("ask")}</a></p></div></div>
    </div></div></section>
    </div>
    </>);
}

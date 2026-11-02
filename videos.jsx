"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="videos">
    <section><div className="wrap"><h2 data-k="nVid">{t("nVid")}</h2><div className="grid" id="vidList"></div><p id="vidEmpty" data-k="vidSoon" style={{ "color": "var(--mut)" }}>{t("vidSoon")}</p></div></section></div>
    </>);
}

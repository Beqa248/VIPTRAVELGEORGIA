"use client";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    return (<>
    <div className="" data-p="reviews">
    <section id="rev" className="why"><div className="wrap"><h2 data-k="revH">{t("revH")}</h2><div className="grid" id="revList"></div><p id="gyg" style={{ "marginTop": "16px" }}></p></div></section>
    </div>
    </>);
}

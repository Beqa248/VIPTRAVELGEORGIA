import {headers} from "next/headers";
import {getLandingPages,ready} from "../../lib/landingPages";
import {getLocale} from "../../lib/seo";
import {localizedPath} from "../../lib/localizedPath";
import TourCatalog from "../../components/pages/tours";
import { getTourCatalog } from "../../lib/tourCatalog";

export default async function ToursPage() {
  const tours = await getTourCatalog();
  const lang=getLocale((await headers()).get("x-vtg-locale")); const pages=(await getLandingPages()).filter(row=>ready(row,lang));
  return <><TourCatalog tours={tours} />{pages.length>0&&<nav aria-label="Travel experiences" style={{maxWidth:1100,margin:"30px auto",padding:16,display:"flex",flexWrap:"wrap",gap:12}}>{pages.map(row=><a key={row.slug} style={{border:"1px solid #d9b76b",borderRadius:8,padding:12}} href={localizedPath(lang,"/experiences/"+row.slug)}>{row.content[lang].title}</a>)}</nav>}</>;
}

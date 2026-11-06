import { notFound } from "next/navigation";
import TourMedia from "../../components/TourMedia";
import TourEditableContent from "../../components/TourEditableContent";
import Home from "../../components/pages/home";
import Tours from "../../components/pages/tours";
import Adjara from "../../components/pages/adjara";
import Martvili from "../../components/pages/martvili";
import Gomis from "../../components/pages/gomis";
import Svaneti from "../../components/pages/svaneti";
import Kobuleti from "../../components/pages/kobuleti";
import Dashbashi from "../../components/pages/dashbashi";
import Vardzia from "../../components/pages/vardzia";
import Tusheti from "../../components/pages/tusheti";
import Beshumi from "../../components/pages/beshumi";
import Kazbegi from "../../components/pages/kazbegi";
import Highlights from "../../components/pages/highlights";
import Travel from "../../components/pages/travel";
import Plan from "../../components/pages/plan";
import Cars from "../../components/pages/cars";
import Videos from "../../components/pages/videos";
import Reviews from "../../components/pages/reviews";
import Contact from "../../components/pages/contact";
const pages = { "home": Home, "tours": Tours, "adjara": Adjara, "martvili": Martvili, "gomis": Gomis, "svaneti": Svaneti, "kobuleti": Kobuleti, "dashbashi": Dashbashi, "vardzia": Vardzia, "tusheti": Tusheti, "beshumi": Beshumi, "kazbegi": Kazbegi, "highlights": Highlights, "travel": Travel, "plan": Plan, "cars": Cars, "videos": Videos, "reviews": Reviews, "contact": Contact };
export function generateStaticParams() { return Object.keys(pages).filter(x => x !== "home").map(slug => ({ slug })); }
export default async function DynamicPage({ params }) { const { slug } = await params; const Page = pages[slug]; if (!Page)
    notFound(); return <><Page /><TourEditableContent slug={slug} /><TourMedia slug={slug} /></>; }

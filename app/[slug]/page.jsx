import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
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
export const dynamic = "force-dynamic";
export function generateStaticParams() { return Object.keys(pages).filter(x => x !== "home").map(slug => ({ slug })); }
export default async function DynamicPage({ params }) { const { slug } = await params; const Page = pages[slug]; if (!Page) notFound();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data,error}=await db.from('custom_tours').select('archived').eq('slug',slug).maybeSingle();
    if(!error&&data?.archived)notFound();
  }
  return <><Page /><TourEditableContent slug={slug} /><TourMedia slug={slug} /></>; }

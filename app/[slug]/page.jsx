import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import TourMedia from "../../components/TourMedia";
import TourEditableContent from "../../components/TourEditableContent";
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
import Plan from "../../components/pages/plan";
import Videos from "../../components/pages/videos";
import { localizedPath } from "../../lib/localizedPath";
import { getPublishedTour } from "../../lib/publicContent";
import { NO_INDEX, getLocale, pageMetadata, tourMetadata } from "../../lib/seo";
import { LEGACY_TOUR_SLUGS, getTourPath } from "../../lib/tourRoutes";

const pages = {
  adjara: Adjara,
  martvili: Martvili,
  gomis: Gomis,
  svaneti: Svaneti,
  kobuleti: Kobuleti,
  dashbashi: Dashbashi,
  vardzia: Vardzia,
  tusheti: Tusheti,
  beshumi: Beshumi,
  kazbegi: Kazbegi,
  highlights: Highlights,
  plan: Plan,
  videos: Videos,
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lang = getLocale((await headers()).get("x-vtg-locale"));
  if (!LEGACY_TOUR_SLUGS.includes(slug)) return pageMetadata(`/${slug}`, lang);

  const tour = await getPublishedTour(slug);
  return tour ? tourMetadata(tour, getTourPath(tour), lang) : NO_INDEX;
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  if (slug === "home") {
    const lang = getLocale((await headers()).get("x-vtg-locale"));
    permanentRedirect(localizedPath(lang, "/"));
  }
  if (!Object.hasOwn(pages, slug)) notFound();

  const Page = pages[slug];
  if (!LEGACY_TOUR_SLUGS.includes(slug)) return <Page />;
  if (!(await getPublishedTour(slug))) notFound();

  return <><Page /><TourEditableContent slug={slug} /><TourMedia slug={slug} /></>;
}

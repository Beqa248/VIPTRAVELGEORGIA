import { getPublishedRegionIds, getPublishedTourRoutes } from "../lib/publicContent";
import { localizedPath } from "../lib/localizedPath";
import { INDEXABLE_PAGE_PATHS, SEO_LANGS, SITE_URL, alternateUrls } from "../lib/seo";
import { getTourPath } from "../lib/tourRoutes";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [tours, regionIds] = await Promise.all([getPublishedTourRoutes(), getPublishedRegionIds()]);
  const paths = new Set(INDEXABLE_PAGE_PATHS);

  for (const tour of tours) {
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tour.slug) && tour.slug !== "airport-transfers") {
      paths.add(getTourPath(tour));
    }
  }

  for (const id of regionIds) paths.add(`/regions/${encodeURIComponent(id)}`);

  return [...paths].flatMap(path => {
    const languages = alternateUrls(path);
    return SEO_LANGS.map(lang => ({
      url: SITE_URL + localizedPath(lang, path),
      alternates: { languages },
    }));
  });
}

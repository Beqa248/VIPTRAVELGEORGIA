import { getPublishedRegionIds, getPublishedTourRoutes, getPublicDb } from "../lib/publicContent";
import { localizedPath } from "../lib/localizedPath";
import { INDEXABLE_PAGE_PATHS, SEO_LANGS, SITE_URL, alternateUrls } from "../lib/seo";
import { getTourPath } from "../lib/tourRoutes";

export const dynamic = "force-dynamic";

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// Read timestamps only when the database exposes them. Never invent a lastmod date.
async function publishedUpdateDates(table, key) {
  const db = getPublicDb();
  if (!db) return new Map();
  const { data, error } = await db.from(table)
    .select(`${key},updated_at`)
    .eq("published", true)
    .eq("archived", false);
  if (error) return new Map(); // Older schemas may not have updated_at.
  return new Map((data || []).map(item => [String(item[key]), validDate(item.updated_at)]));
}

export default async function sitemap() {
  const [tours, regionIds, tourDates, regionDates] = await Promise.all([
    getPublishedTourRoutes(),
    getPublishedRegionIds(),
    publishedUpdateDates("custom_tours", "slug"),
    publishedUpdateDates("travel_regions", "id"),
  ]);

  // Static pages are included without fabricated modification dates.
  const paths = new Map(INDEXABLE_PAGE_PATHS.map(path => [path, undefined]));

  for (const tour of tours) {
    if (VALID_SLUG.test(tour.slug) && tour.slug !== "airport-transfers") {
      paths.set(getTourPath(tour), tourDates.get(tour.slug));
    }
  }

  for (const id of regionIds) {
    paths.set(`/regions/${encodeURIComponent(id)}`, regionDates.get(String(id)));
  }

  return [...paths].flatMap(([path, lastModified]) => {
    const languages = alternateUrls(path);
    return SEO_LANGS.map(lang => ({
      url: SITE_URL + localizedPath(lang, path),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages },
    }));
  });
}

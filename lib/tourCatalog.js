import { cache } from "react";
import { getPublicDb, getPublishedTours } from "./publicContent";
import { getTourPath } from "./tourRoutes";

export const getTourCatalog = cache(async () => {
  const db = await getPublicDb();
  if (!db) return null;

  const [tours, { data: details }, { data: prices }] = await Promise.all([
    getPublishedTours(),
    db.from("tour_content").select("slug,overview"),
    db.from("tour_prices").select("slug,price_mode,price_amount,price_currency,price_unit"),
  ]);
  if (!tours) return null;

  const overviews = new Map((details ?? []).map(({ slug, overview }) => [slug, overview]));
  const pricing = new Map((prices ?? []).map((price) => [price.slug, price]));
  return tours.map((tour) => {
    const { slug, title, description, duration_days, category, cover_url, translations } = tour;
    const { price_mode, price_amount, price_currency, price_unit } = pricing.get(slug) ?? tour;
    return {
      slug, title, description: overviews.get(slug) || description,
      duration_days, category, cover_url, translations,
      price_mode, price_amount, price_currency, price_unit,
      path: getTourPath(tour),
    };
  });
});

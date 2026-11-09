export const LEGACY_TOUR_SLUGS = [
  "adjara", "martvili", "gomis", "svaneti", "kobuleti", "dashbashi",
  "vardzia", "tusheti", "beshumi", "kazbegi", "highlights",
];

export function getTourPath(tour) {
  if (tour.slug === "airport-transfers") return "/contact";

  const usesLegacyPage = LEGACY_TOUR_SLUGS.includes(tour.slug)
    && (tour.is_original || tour.original)
    && !tour.itinerary
    && !tour.gallery_images?.length;

  return usesLegacyPage ? `/${tour.slug}` : `/tour/${tour.slug}`;
}

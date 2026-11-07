export const SITE_URL = "https://viptravelgeorgia.vercel.app";
export const SITE_NAME = "VIPTravelGeorgia";
export const DEFAULT_DESCRIPTION = "Discover private tours in Georgia with a local driver-guide. Explore Batumi, Svaneti, Kazbegi, Kakheti and more with flexible itineraries.";
export const PAGE_SEO = {
  "/": ["Private Tours in Georgia | VIPTravelGeorgia", DEFAULT_DESCRIPTION],
  "/tours": ["Private Tours & Adventures in Georgia | VIPTravelGeorgia", "Explore private Georgia tours, mountain adventures and multi-day itineraries with a local driver-guide."],
  "/cars": ["Private Tour Vehicles & Transfers | VIPTravelGeorgia", "Explore vehicles for private Georgia tours, transfers and 4x4 mountain adventures."],
  "/travel": ["Georgia Highlights & Places to Visit | VIPTravelGeorgia", "Explore Georgia's beautiful regions, mountains, culture and must-see destinations."],
  "/videos": ["Georgia Travel Videos | VIPTravelGeorgia", "Watch videos from private tours and scenic adventures across Georgia."],
  "/recent-tours": ["Recent Tours & Travel Photos | VIPTravelGeorgia", "Browse photographs from our recent private tours and adventures in Georgia."],
  "/reviews": ["Guest Reviews | VIPTravelGeorgia", "Read guest experiences and reviews of VIPTravelGeorgia private tours and transfers."],
  "/contact": ["Contact & Book a Private Tour | VIPTravelGeorgia", "Contact VIPTravelGeorgia to plan a private tour or transfer in Georgia."],
  "/booking": ["Tour Booking & Deposit | VIPTravelGeorgia", "Arrange your private tour booking and confirm details with VIPTravelGeorgia."],
  "/custom-tour": ["Plan a Custom Georgia Tour | VIPTravelGeorgia", "Build a private Georgia itinerary tailored to your interests, dates and group."],
  "/planner": ["Georgia Trip Planner | VIPTravelGeorgia", "Plan your Georgia trip and explore itinerary ideas with VIPTravelGeorgia."],
  "/assistant": ["Georgia Travel Assistant | VIPTravelGeorgia", "Get help planning your private Georgia tour."],
};
export const LEGACY_TOUR_SLUGS = ["adjara","martvili","gomis","svaneti","kobuleti","dashbashi","vardzia","tusheti","beshumi","kazbegi"];
export const RESERVED_SLUGS = ["admin","api","images","tour","tours","cars","contact","reviews","recent-tours","travel","videos","booking","custom-tour","planner","assistant"];
export function seoMetadata(path, title, description, image) {
  const url = new URL(path, SITE_URL).toString();
  const metadata = {
    title, description, metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: SITE_NAME, title, description, url },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
  if (image && /^https?:\/\//.test(image)) {
    metadata.openGraph.images = [{ url: image, alt: title }];
    metadata.twitter.images = [image];
  }
  return metadata;
}
export function textOnly(input) { return String(input || "").replace(/<[^>]*>/g, " ").replace(/[#*_`]/g, "").replace(/\s+/g, " ").trim(); }
export function tourMetadata(tour, path) {
  const title = `${textOnly(tour.title || "Private Georgia Tour").slice(0, 95)} | VIPTravelGeorgia`;
  const description = (textOnly(tour.description) || "Discover this private Georgia tour with VIPTravelGeorgia. Contact us for details and availability.").slice(0, 160);
  return seoMetadata(path, title, description, tour.cover_url);
}
export function getPublicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return import("@supabase/supabase-js").then(({createClient}) => createClient(url, key, {auth:{persistSession:false,autoRefreshToken:false}}));
}

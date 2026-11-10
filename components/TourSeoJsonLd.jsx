import { SITE_URL } from "../lib/seo";
import { localizedPath } from "../lib/localizedPath";

const clean = value => String(value || "")
  .replace(/<[^>]*>/g, " ")
  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  .replace(/[#*_`]/g, "")
  .replace(/\s+/g, " ").trim();

const breadcrumbLabels = {
  en: ["Home", "Tours"],
  ka: ["მთავარი", "ტურები"],
  ru: ["Главная", "Туры"],
  he: ["דף הבית", "סיורים"],
};

function absoluteImage(value) {
  if (!value || typeof value !== "string") return undefined;
  try {
    const url = new URL(value, SITE_URL);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export default function TourSeoJsonLd({ tour, path, lang, pricing }) {
  const [homeLabel, toursLabel] = breadcrumbLabels[lang] || breadcrumbLabels.en;
  const title = clean(tour.translations?.[lang]?.title || tour.title);
  const description = clean(tour.translations?.[lang]?.description || tour.description);
  const url = SITE_URL + localizedPath(lang, path);
  const image = absoluteImage(tour.cover_url);
  const priceData = pricing || tour;
  const price = Number(priceData?.price_amount);
  const currency = String(priceData?.price_currency || "").toUpperCase();
  const hasFixedPrice = priceData?.price_mode === "fixed" &&
    Number.isFinite(price) && price > 0 && /^[A-Z]{3}$/.test(currency);

  const trip = {
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: title,
    ...(description ? { description } : {}),
    url,
    ...(image ? { image } : {}),
    inLanguage: lang,
    touristType: "Private tour travelers",
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(hasFixedPrice ? {
      offers: {
        "@type": "Offer",
        url,
        price: price.toString(),
        priceCurrency: currency,
      },
    } : {}),
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      trip,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: SITE_URL + localizedPath(lang, "/") },
          { "@type": "ListItem", position: 2, name: toursLabel, item: SITE_URL + localizedPath(lang, "/tours") },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }} />;
}

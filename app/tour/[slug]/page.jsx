import { headers } from "next/headers";
import { notFound } from "next/navigation";
import CurrencyTourPrice from "../../../components/CurrencyTourPrice";
import TranslatedText from "../../../components/TranslatedText";
import { localizedPath } from "../../../lib/localizedPath";
import { getPublicDb, getPublishedTour } from "../../../lib/publicContent";
import { NO_INDEX, getLocale, tourMetadata } from "../../../lib/seo";
import { getTourPath } from "../../../lib/tourRoutes";
import styles from "./tour.module.css";

export const dynamic = "force-dynamic";

const copy = {
  en: {
    back: "All tours", itinerary: "Your itinerary", gallery: "Photo gallery", day: "day", days: "days",
    question: "Interested in this tour?", prompt: "Contact us for dates, pricing and a personalized itinerary.",
    request: "Request this tour",
  },
  ka: {
    back: "ყველა ტური", itinerary: "თქვენი მარშრუტი", gallery: "ფოტოგალერეა", day: "დღე", days: "დღე",
    question: "დაინტერესდით ტურით?", prompt: "დაგვიკავშირდით თარიღების, ფასისა და ინდივიდუალური მარშრუტისთვის.",
    request: "მოითხოვეთ ეს ტური",
  },
  ru: {
    back: "Все туры", itinerary: "Ваш маршрут", gallery: "Фотогалерея", day: "день", days: "дн.",
    question: "Заинтересовал этот тур?", prompt: "Свяжитесь с нами, чтобы узнать даты, цены и обсудить маршрут.",
    request: "Запросить этот тур",
  },
  he: {
    back: "כל הסיורים", itinerary: "המסלול שלכם", gallery: "גלריית תמונות", day: "יום", days: "ימים",
    question: "מעוניינים בסיור הזה?", prompt: "פנו אלינו לקבלת תאריכים, מחירים ומסלול מותאם אישית.",
    request: "שלחו בקשה לסיור",
  },
};

export async function generateMetadata({ params }) {
  const [{ slug }, requestHeaders] = await Promise.all([params, headers()]);
  const tour = await getPublishedTour(slug);
  if (!tour) return NO_INDEX;

  const lang = getLocale(requestHeaders.get("x-vtg-locale"));
  const path = getTourPath(tour);
  if (path === "/contact") return { ...tourMetadata(tour, `/tour/${slug}`, lang), ...NO_INDEX };
  return tourMetadata(tour, path, lang);
}

function itineraryParts(value) {
  const clean = line => line.replace(/\*\*/g, "").replace(/^#{1,6}\s*/, "").trim();
  return (value || "").split(/\n\s*\n/).map(section => section.trim()).filter(Boolean).map(section => {
    const lines = section.split("\n").map(line => line.trim()).filter(Boolean);
    const first = lines[0];
    const titleLike = /^(?:\*\*)?(?:Departure|Return|Stop\s*\d+|Day\s*\d+|Tour Duration|Please Note|Important|Duration|Note)/i.test(first)
      || /^#{1,6}\s/.test(first);
    return {
      title: titleLike ? clean(first) : "",
      body: (titleLike ? lines.slice(1) : lines).map(clean).join(" "),
    };
  });
}

export default async function CustomTourPage({ params }) {
  const [{ slug }, requestHeaders] = await Promise.all([params, headers()]);
  const tour = await getPublishedTour(slug);
  if (!tour) notFound();

  const { data: pricing } = await getPublicDb().from("tour_prices")
    .select("price_mode,price_amount,price_currency,price_unit").eq("slug", slug).maybeSingle();
  const lang = getLocale(requestHeaders.get("x-vtg-locale"));
  const labels = copy[lang];
  const savedItinerary = tour.translations?.[lang]?.itinerary?.trim();
  const parts = itineraryParts(savedItinerary || tour.itinerary);
  const photos = [...new Set(tour.gallery_images || [])];
  const title = tour.translations?.[lang]?.title || tour.title;
  const direction = lang === "he" ? "→" : "←";

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <a href={localizedPath(lang, "/tours")} className={styles.back}>{direction} {labels.back}</a>
        <div className={styles.hero}>
          {tour.cover_url && <img src={tour.cover_url} alt={title} fetchPriority="high" />}
          <div className={styles.intro}>
            <span>{tour.duration_days} {tour.duration_days === 1 ? labels.day : labels.days} · {tour.category}</span>
            <h1><TranslatedText text={tour.title} translations={tour.translations} field="title" /></h1>
            <p><TranslatedText text={tour.description} translations={tour.translations} field="description" /></p>
            <CurrencyTourPrice pricing={pricing || tour} />
          </div>
        </div>
        {parts.length > 0 && (
          <section>
            <h2>{labels.itinerary}</h2>
            <div className={styles.itinerary}>
              {parts.map((part, index) => (
                <div className={styles.itineraryStop} key={index}>
                  {part.title && <h3>{savedItinerary ? part.title : <TranslatedText text={part.title} />}</h3>}
                  {part.body && <p>{savedItinerary ? part.body : <TranslatedText text={part.body} />}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {photos.length > 0 && (
          <section>
            <h2>{labels.gallery}</h2>
            <div className={styles.gallery}>
              {photos.map((url, index) => (
                <img key={url} src={url} alt={`${title} — ${labels.gallery} ${index + 1}`} loading="lazy" decoding="async" />
              ))}
            </div>
          </section>
        )}
        <section className={styles.cta}>
          <h2>{labels.question}</h2>
          <p>{labels.prompt}</p>
          <a href={`${localizedPath(lang, "/contact")}?tour=${encodeURIComponent(slug)}`}>
            {labels.request} {lang === "he" ? "←" : "→"}
          </a>
        </section>
      </div>
    </div>
  );
}

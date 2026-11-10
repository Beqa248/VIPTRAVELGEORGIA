"use client";

import { useId, useState } from "react";
import { localizedPath } from "../../lib/localizedPath";
import { tourPriceLabel, tourPriceLabels } from "../../lib/tourPricing";
import CardPhoto from "../CardPhoto";
import { useLanguage } from "../site-context";
import useTranslatedFields from "../useTranslatedFields";
import styles from "./tourChooser.module.css";

const COPY = {
  en: {
    label: "Explore Georgia", title: "Find your tour", intro: "From mountain passes to wine country, find a route that fits your time and interests.",
    search: "Search tours", placeholder: "Destination or tour name", duration: "Duration", any: "Any duration",
    one: "Day tours", many: "Multi-day tours", day: "1 day", days: "{n} days", count: "Tours found: {n}", reset: "Clear filters",
    empty: "No tours match these filters", emptyHint: "Try a different destination or clear the filters.",
    unavailable: "The tour catalog is temporarily unavailable", noTours: "No tours are listed right now",
    contactHint: "Tell us where you’d like to go and we’ll help you plan a route.", contact: "Contact us",
  },
  ka: {
    label: "აღმოაჩინეთ საქართველო", title: "იპოვეთ თქვენი ტური", intro: "მთის უღელტეხილებიდან ღვინის მხარეებამდე — აირჩიეთ მარშრუტი თქვენი დროისა და ინტერესების მიხედვით.",
    search: "ტურების ძიება", placeholder: "დანიშნულება ან ტურის სახელი", duration: "ხანგრძლივობა", any: "ნებისმიერი ხანგრძლივობა",
    one: "ერთდღიანი ტურები", many: "მრავალდღიანი ტურები", day: "1 დღე", days: "{n} დღე", count: "ნაპოვნი ტურები: {n}", reset: "ფილტრების გასუფთავება",
    empty: "ამ ფილტრებით ტური ვერ მოიძებნა", emptyHint: "სცადეთ სხვა დანიშნულება ან გაასუფთავეთ ფილტრები.",
    unavailable: "ტურების კატალოგი დროებით მიუწვდომელია", noTours: "ამჟამად ტურები არ არის დამატებული",
    contactHint: "გვითხარით, სად გსურთ წასვლა, და მარშრუტის დაგეგმვაში დაგეხმარებით.", contact: "დაგვიკავშირდით",
  },
  ru: {
    label: "Откройте Грузию", title: "Найдите свой тур", intro: "От горных перевалов до винных регионов — выберите маршрут по своим интересам и времени.",
    search: "Поиск туров", placeholder: "Направление или название тура", duration: "Длительность", any: "Любая длительность",
    one: "Однодневные туры", many: "Многодневные туры", day: "1 день", days: "Дней: {n}", count: "Найдено туров: {n}", reset: "Сбросить фильтры",
    empty: "По этим фильтрам туры не найдены", emptyHint: "Попробуйте другое направление или сбросьте фильтры.",
    unavailable: "Каталог туров временно недоступен", noTours: "Сейчас в каталоге нет туров",
    contactHint: "Расскажите, куда вы хотите поехать, и мы поможем составить маршрут.", contact: "Связаться с нами",
  },
  he: {
    label: "גלו את גאורגיה", title: "מצאו את הסיור שלכם", intro: "ממעברי הרים ועד אזורי יין, בחרו מסלול שמתאים לזמן ולתחומי העניין שלכם.",
    search: "חיפוש סיורים", placeholder: "יעד או שם הסיור", duration: "משך הסיור", any: "כל משך",
    one: "טיולי יום", many: "טיולים של כמה ימים", day: "יום אחד", days: "{n} ימים", count: "סיורים שנמצאו: {n}", reset: "ניקוי מסננים",
    empty: "לא נמצאו סיורים שמתאימים למסננים", emptyHint: "נסו יעד אחר או נקו את המסננים.",
    unavailable: "קטלוג הסיורים אינו זמין כרגע", noTours: "אין כרגע סיורים בקטלוג",
    contactHint: "ספרו לנו לאן תרצו להגיע ונעזור לכם לתכנן מסלול.", contact: "צרו קשר",
  },
};

function TourCard({ tour, copy }) {
  const { lang, t, formatPrice } = useLanguage();
  const saved = lang === "en" ? null : tour.translations?.[lang];
  const [title, description] = useTranslatedFields([
    saved?.title ? "" : tour.title,
    saved?.description ? "" : tour.description?.slice(0, 450),
  ]);
  const price = tourPriceLabel(tour, formatPrice, tourPriceLabels[lang]);
  const duration = Number(tour.duration_days);
  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <CardPhoto src={tour.cover_url} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 820px) 46vw, (max-width: 1220px) 30vw, 440px" />
      </div>
      <div className={styles.cardBody}>
        {duration > 0 && <span className={styles.duration}>{duration === 1 ? copy.day : copy.days.replace("{n}", duration)}</span>}
        <h2>{saved?.title || title || tour.slug}</h2>
        <p className={styles.description}>{saved?.description || description}</p>
        {price && <p className={styles.price}>{price}</p>}
        <a className={styles.details} href={localizedPath(lang, tour.path)}>
          {tour.slug === "airport-transfers" ? t("askAboutTour") : t("seeTourDetails")}
          <span className={styles.arrow} aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function TourCatalog({ tours }) {
  const { lang } = useLanguage();
  const copy = COPY[lang] || COPY.en;
  const id = useId();
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState("any");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = (tours ?? []).filter((tour) => {
    const days = Number(tour.duration_days);
    if (duration === "one" && !(days > 0 && days <= 1)) return false;
    if (duration === "many" && !(days > 1)) return false;
    const haystack = [tour.slug?.replaceAll("-", " "), tour.title, tour.category, tour.translations?.[lang]?.title]
      .filter(Boolean).join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  const reset = () => { setQuery(""); setDuration("any"); };

  return (
    <div className={styles.catalog}>
      <div className={styles.banner}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>{copy.label}</p>
          <h1>{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.wrap}>
          {tours?.length > 0 && (
            <>
              <div className={styles.filters} role="search" aria-label={copy.search}>
                <div>
                  <label htmlFor={id + "-query"}>{copy.search}</label>
                  <input id={id + "-query"} type="search" value={query} placeholder={copy.placeholder} onChange={(event) => setQuery(event.target.value)} />
                </div>
                <div>
                  <label htmlFor={id + "-duration"}>{copy.duration}</label>
                  <select id={id + "-duration"} value={duration} onChange={(event) => setDuration(event.target.value)}>
                    <option value="any">{copy.any}</option>
                    <option value="one">{copy.one}</option>
                    <option value="many">{copy.many}</option>
                  </select>
                </div>
                <button type="button" onClick={reset} disabled={!query && duration === "any"}>{copy.reset}</button>
              </div>
              <p className={styles.count} role="status">{copy.count.replace("{n}", results.length)}</p>
            </>
          )}
          {results.length > 0 ? (
            <div className={styles.grid}>{results.map((tour) => <TourCard key={tour.slug} tour={tour} copy={copy} />)}</div>
          ) : (
            <div className={styles.empty}>
              <h2>{tours?.length ? copy.empty : tours === null ? copy.unavailable : copy.noTours}</h2>
              <p>{tours?.length ? copy.emptyHint : copy.contactHint}</p>
              {tours?.length > 0
                ? <button type="button" onClick={reset}>{copy.reset}</button>
                : <a href={localizedPath(lang, "/contact")}>{copy.contact}</a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

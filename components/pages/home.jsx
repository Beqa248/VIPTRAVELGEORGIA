"use client";

import Image from "next/image";
import Link from "next/link";
import { localizedPath } from "../../lib/localizedPath";
import { tourPriceLabel, tourPriceLabels } from "../../lib/tourPricing";
import CardPhoto from "../CardPhoto";
import ContactForm from "../ContactForm";
import ReviewsList from "../ReviewsList";
import TripPlanner from "../TripPlanner";
import VehicleCards from "../VehicleCards";
import { useLanguage } from "../site-context";
import styles from "./home.module.css";

const steps = [1, 2, 3];
const faq = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Arrow() {
  return <span className={styles.arrow} aria-hidden="true">→</span>;
}

function TourCard({ tour, lang, formatPrice, t }) {
  const title = tour.translations?.[lang]?.title || tour.title;
  const price = tourPriceLabel(tour, formatPrice, tourPriceLabels[lang]);

  return (
    <article className={styles.tourCard}>
      <Link href={localizedPath(lang, tour.path)} className={styles.tourLink}>
        <div className={styles.tourPhoto}>
          <CardPhoto src={tour.cover_url} sizes="(max-width: 600px) 90vw, (max-width: 850px) 44vw, (max-width: 1360px) 30vw, 400px" />
        </div>
        <div className={styles.tourBody}>
          <h3>{title}</h3>
          {price && <p>{price}</p>}
          <span className={styles.tourDetails}>{t(tour.path === "/contact" ? "askAboutTour" : "seeTourDetails")} <Arrow /></span>
        </div>
      </Link>
    </article>
  );
}

export default function Home({ tours = null }) {
  const { lang, t, formatPrice } = useLanguage();
  const href = (path) => localizedPath(lang, path);

  return (
    <div className={styles.home} data-p="home">
      <div className={styles.hero} id="top">
        <Image src="/images/photo-001.jpg" className={styles.heroPhoto} alt="" fill priority sizes="100vw" />
        <div className={`${styles.container} ${styles.heroContent}`}>
          <p className={styles.eyebrow}>{t("homeLocation")}</p>
          <h1>{t("h1")}</h1>
          <p className={styles.heroLead}>{t("sub")}</p>
          <div className={styles.actions}>
            <a href="#hTours" className={styles.heroPrimary}>{t("see")} <Arrow /></a>
            <Link href={href("/plan")} className={styles.heroSecondary}>{t("cta")}</Link>
          </div>
        </div>
      </div>

      <ul className={`${styles.container} ${styles.benefits}`}>
        <li>{t("benefitPrivate")}</li>
        <li>{t("benefitFlexible")}</li>
        <li>{t("benefitGuide")}</li>
      </ul>

      <section className={styles.section} id="hTours" aria-labelledby="popular-tours" tabIndex={-1}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>{t("homeToursLabel")}</p>
              <h2 id="popular-tours">{t("popH")}</h2>
            </div>
            <Link href={href("/tours")} className={styles.outlineButton}>{t("allTours")} <Arrow /></Link>
          </div>
          {tours?.length ? (
            <div className={styles.tourGrid}>
              {tours.map((tour) => <TourCard key={tour.slug} tour={tour} lang={lang} formatPrice={formatPrice} t={t} />)}
            </div>
          ) : (
            <div className={styles.tourEmpty}>
              <p>{t(tours ? "homeToursEmpty" : "homeToursUnavailable")}</p>
              <Link href={href("/contact")} className={styles.textLink}>{t("nCont")} <Arrow /></Link>
            </div>
          )}
        </div>
      </section>

      <section className={`${styles.section} ${styles.planning}`} aria-labelledby="plan-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>{t("journeyStart")}</p>
              <h2 id="plan-heading">{t("planH")}</h2>
              <p className={styles.lead}>{t("journeyIntro")}</p>
            </div>
          </div>
          <div className={styles.planGrid}>
            <TripPlanner hideIntro hideFootnote />
            <div className={styles.planSide}>
              <h3>{t("howH")}</h3>
              <ol className={styles.steps}>
                {steps.map((step) => (
                  <li key={step}>
                    <span className={styles.stepNumber} aria-hidden="true">{step}</span>
                    <div>
                      <h4>{t(`how${step}t`)}</h4>
                      <p>{t(`how${step}d`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.tools}>
                <Link href={href("/planner")}>{t("aiPlanner")} <Arrow /></Link>
                <Link href={href("/custom-tour")}>{t("buildTour")} <Arrow /></Link>
                <Link href={href("/assistant")}>{t("travelAssistant")} <Arrow /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`${styles.container} ${styles.section} ${styles.twoColumns}`}>
        <section className={styles.panel} id="hGuide">
          <h2>{t("guideH")}</h2>
          <p>{t("guideT")}</p>
          <ul className={styles.facts}>
            {["factLang", "guideCar", "factPrivate", "factStart"].map((key) => <li key={key}>{t(key)}</li>)}
          </ul>
          <div className={styles.actions}>
            <Link href={href("/reviews")} className={styles.outlineButton}>{t("guideRev")}</Link>
            <Link href={href("/recent-tours")} className={styles.textLink}>{t("recentTours")} <Arrow /></Link>
          </div>
        </section>
        <section className={`${styles.panel} ${styles.sagePanel}`}>
          <h2>{t("whyH")}</h2>
          <ul className={styles.facts}>
            {[1, 2, 3, 4].map((item) => <li key={item}>{t(`w${item}`)}</li>)}
          </ul>
        </section>
      </div>

      <div className={styles.bookingBand}>
        <div className={`${styles.container} ${styles.section} ${styles.twoColumns}`}>
          <section className={styles.panel} id="hCars">
            <h2>{t("carsH")}</h2>
            <VehicleCards />
            <Link href={href("/cars")} className={styles.textLink}>{t("nCars")} <Arrow /></Link>
          </section>
          <section className={`${styles.panel} ${styles.bookingPanel}`} id="hPrice">
            <h2>{t("pricesBooking")}</h2>
            <p>{t("pricesIntro")}</p>
            <div className={styles.deposit}>
              <h3>{t("depositInfoHeading")}</h3>
              <p>{t("depositInfoLeadBefore")}<strong>{t("depositInfoLeadBold")}</strong>{t("depositInfoLeadAfter")}</p>
              <p>{t("depositInfoDetails")}</p>
              <p><strong>{t("depositInfoNoPayment")}</strong></p>
            </div>
            <div className={styles.actions}>
              <Link href={href("/booking")} className={styles.primaryButton}>{t("calculatePrice")} <Arrow /></Link>
              <a className={styles.textLink} href="https://wa.me/995558176108?text=Hello%21%20I%27d%20like%20a%20price%20quote%20for%20a%20private%20tour." target="_blank" rel="noopener noreferrer">{t("askPriceWhatsapp")}</a>
            </div>
          </section>
        </div>
      </div>

      <section className={`${styles.section} ${styles.reviews}`} id="guest-reviews">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>{t("revH")}</h2>
            <Link href={href("/reviews")} className={styles.outlineButton}>{t("allRev")} <Arrow /></Link>
          </div>
          <ReviewsList limit={3} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.season}`} id="travel-seasons">
        <div className={styles.container}>
          <h2>{t("seasonH")}</h2>
          <ul className={styles.seasons}>
            {[1, 2, 3, 4, 5].map((item) => <li key={item}>{t(`s${item}`)}</li>)}
          </ul>
          <p className={styles.lead}>{t("seasonNote")}</p>
        </div>
      </section>

      <div className={`${styles.container} ${styles.section} ${styles.twoColumns} ${styles.contactGrid}`}>
        <section className={styles.panel} id="hFaq">
          <h2>{t("faqH")}</h2>
          {faq.map((item) => (
            <details key={item}>
              <summary>{t(`f${item}q`)}</summary>
              <p>{t(`f${item}a`)}</p>
            </details>
          ))}
        </section>
        <ContactForm />
      </div>
    </div>
  );
}

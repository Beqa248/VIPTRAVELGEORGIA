import { headers } from "next/headers";
import { notFound } from "next/navigation";
import TranslatedText from "../../../components/TranslatedText";
import { localizedPath } from "../../../lib/localizedPath";
import { getPublishedRegion } from "../../../lib/publicContent";
import { NO_INDEX, getLocale, regionMetadata } from "../../../lib/seo";
import RegionGallery from "./RegionGallery";
import styles from "./region.module.css";

const copy = {
  en: ["Back to Georgia’s regions", "Photo gallery", "Open photo", "Close photo"],
  ka: ["საქართველოს რეგიონებთან დაბრუნება", "ფოტოგალერეა", "ფოტოს გახსნა", "ფოტოს დახურვა"],
  ru: ["К регионам Грузии", "Фотогалерея", "Открыть фото", "Закрыть фото"],
  he: ["חזרה לאזורי גאורגיה", "גלריית תמונות", "פתיחת תמונה", "סגירת תמונה"],
};

export async function generateMetadata({ params }) {
  const [{ id }, requestHeaders] = await Promise.all([params, headers()]);
  const region = await getPublishedRegion(id);
  return region ? regionMetadata(region, getLocale(requestHeaders.get("x-vtg-locale"))) : NO_INDEX;
}

export default async function RegionDetail({ params }) {
  const [{ id }, requestHeaders] = await Promise.all([params, headers()]);
  const region = await getPublishedRegion(id);
  if (!region) notFound();

  const lang = getLocale(requestHeaders.get("x-vtg-locale"));
  const [back, gallery, openPhoto, closePhoto] = copy[lang];
  const photos = [...new Set([region.image_url, ...(region.gallery_images || [])].filter(Boolean))];

  return (
    <div className={styles.page}>
      <a className={styles.back} href={`${localizedPath(lang, "/travel")}#trRegions`}>
        {lang === "he" ? "→" : "←"} {back}
      </a>
      <div className={styles.body}>
        <h1><TranslatedText text={region.title} /></h1>
        {region.description && <p><TranslatedText text={region.description} /></p>}
        {photos.length > 0 && (
          <section>
            <h2>{gallery}</h2>
            <RegionGallery photos={photos} title={region.title} labels={{ gallery, openPhoto, closePhoto }} />
          </section>
        )}
      </div>
    </div>
  );
}

import translations from "./translations.json";
import { localizedPath } from "./localizedPath";

export const SITE_URL = "https://viptravelgeorgia.vercel.app";
export const SITE_NAME = "VIPTravelGeorgia";
export const SEO_LANGS = ["en", "ka", "ru", "he"];
const OPEN_GRAPH_LOCALES = { en: "en_GB", ka: "ka_GE", ru: "ru_RU", he: "he_IL" };
const LOGO = "/viptravelgeorgia-round-logo.png";

const PAGE_COPY = {
  "/": {
    en: ["Private Tours in Georgia", "Explore Georgia with a local driver-guide. Discover private trips to Adjara, Svaneti and Kazbegi, with flexible itineraries and airport transfers."],
    ka: ["კერძო ტურები საქართველოში", "აღმოაჩინეთ აჭარა, სვანეთი და ყაზბეგი ადგილობრივ მძღოლ-გიდთან ერთად. დაგეგმეთ კერძო ტური, მოქნილი მარშრუტი ან აეროპორტის ტრანსფერი."],
    ru: ["Частные туры по Грузии", "Откройте Аджарию, Сванетию и Казбеги с местным водителем-гидом. Индивидуальные маршруты, частные поездки и трансферы из аэропорта."],
    he: ["טיולים פרטיים בגאורגיה", "גלו את אג׳רה, סוונטי וקזבגי עם נהג ומדריך מקומי. בחרו מסלול פרטי וגמיש או תיאמו הסעה משדה התעופה."],
  },
  "/tours": {
    en: ["Private Georgia Tours & Day Trips", "Find private tours, mountain day trips and multi-day itineraries in Georgia. Compare routes and request a trip with a local driver-guide."],
    ka: ["კერძო ტურები და ერთდღიანი გასვლები", "შეადარეთ საქართველოს მთის მარშრუტები, ერთდღიანი და მრავალდღიანი ტურები. მოითხოვეთ მოგზაურობა ადგილობრივ მძღოლ-გიდთან ერთად."],
    ru: ["Индивидуальные туры и экскурсии по Грузии", "Сравните горные маршруты, однодневные экскурсии и многодневные поездки по Грузии с местным водителем-гидом."],
    he: ["סיורים פרטיים וטיולי יום בגאורגיה", "השוו מסלולים בהרים, טיולי יום וסיורים של כמה ימים בגאורגיה עם נהג ומדריך מקומי."],
  },
  "/cars": {
    en: ["Vehicles for Private Tours & Transfers", "Explore the vehicles available for private tours and transfers in Georgia, from mountain-ready 4×4s to comfortable group transport."],
    ka: ["ავტომობილები კერძო ტურებისა და ტრანსფერებისთვის", "გაეცანით საქართველოს ტურებისა და ტრანსფერებისთვის ხელმისაწვდომ ავტომობილებს, მათ შორის მთის გზებისთვის განკუთვნილ 4×4 მანქანებს."],
    ru: ["Автомобили для частных туров и трансферов", "Выберите автомобиль для тура или трансфера по Грузии: внедорожник 4×4 для горных дорог или просторный транспорт для группы."],
    he: ["רכבים לטיולים פרטיים ולהסעות", "הכירו את הרכבים הזמינים בגאורגיה, מרכבי 4×4 לדרכים הרריות ועד לרכבים מרווחים לקבוצות."],
  },
  "/reviews": {
    en: ["Guest Reviews", "Read what guests say about their private tours and travel experiences with VIPTravelGeorgia."],
    ka: ["სტუმრების შეფასებები", "წაიკითხეთ სტუმრების შეფასებები და გაიგეთ, როგორ იმოგზაურეს მათ საქართველოში VIPTravelGeorgia-სთან ერთად."],
    ru: ["Отзывы гостей", "Почитайте отзывы путешественников о частных поездках и экскурсиях с VIPTravelGeorgia."],
    he: ["חוות דעת של מטיילים", "קראו מה מספרים המטיילים על הטיולים הפרטיים והחוויות שלהם עם VIPTravelGeorgia."],
  },
  "/contact": {
    en: ["Contact & Book a Private Georgia Tour", "Send your dates, group size and preferred route to VIPTravelGeorgia for a private tour or airport transfer quote."],
    ka: ["კონტაქტი და კერძო ტურის დაჯავშნა", "გამოგვიგზავნეთ თარიღები, ჯგუფის ზომა და სასურველი მარშრუტი კერძო ტურის ან აეროპორტის ტრანსფერის შეთავაზებისთვის."],
    ru: ["Контакты и бронирование частного тура", "Сообщите даты, размер группы и желаемый маршрут, чтобы получить предложение на частный тур или трансфер из аэропорта."],
    he: ["יצירת קשר והזמנת טיול פרטי", "שלחו לנו תאריכים, מספר משתתפים ומסלול מועדף כדי לקבל הצעה לטיול פרטי או להסעה משדה התעופה."],
  },
  "/plan": {
    en: ["Build Your Own Georgia Trip", "Choose tours, a starting city and a vehicle, then send your itinerary request to a local guide on WhatsApp."],
    ka: ["შექმენით თქვენი მოგზაურობა საქართველოში", "აირჩიეთ ტურები, საწყისი ქალაქი და ავტომობილი. გაგზავნეთ მარშრუტის მოთხოვნა ადგილობრივ გიდთან WhatsApp-ით."],
    ru: ["Составьте поездку по Грузии", "Выберите экскурсии, город отправления и автомобиль, затем отправьте запрос местному гиду в WhatsApp."],
    he: ["בנו מסלול משלכם בגאורגיה", "בחרו סיורים, עיר יציאה ורכב ושלחו למדריך המקומי בקשה למסלול בוואטסאפ."],
  },
  "/custom-tour": {
    en: ["Custom Private Tours in Georgia", "Request a private itinerary for your group, travel dates and interests. Start with your ideas and plan the route with a local guide."],
    ka: ["ინდივიდუალური კერძო ტურები საქართველოში", "მოითხოვეთ თქვენს ჯგუფზე, თარიღებსა და ინტერესებზე მორგებული მარშრუტი და დაგეგმეთ მოგზაურობა ადგილობრივ გიდთან ერთად."],
    ru: ["Частные туры по Грузии на заказ", "Запросите маршрут с учётом состава группы, дат и интересов. Спланируйте поездку вместе с местным гидом."],
    he: ["טיולים פרטיים בהתאמה אישית בגאורגיה", "בקשו מסלול לפי תאריכי הנסיעה, גודל הקבוצה ותחומי העניין שלכם ותכננו אותו עם מדריך מקומי."],
  },
  "/planner": {
    en: ["Georgia Trip Planner", "Explore itinerary ideas for your Georgia trip based on your starting point, dates and interests."],
    ka: ["მოგზაურობის დამგეგმავი საქართველოში", "გაეცანით მარშრუტის იდეებს საწყისი ქალაქის, მოგზაურობის თარიღებისა და ინტერესების მიხედვით."],
    ru: ["Планировщик поездок по Грузии", "Найдите идеи маршрутов по Грузии с учётом города отправления, дат и интересов."],
    he: ["מתכנן טיולים בגאורגיה", "קבלו רעיונות למסלולים בגאורגיה לפי נקודת היציאה, התאריכים ותחומי העניין שלכם."],
  },
  "/assistant": {
    en: ["Georgia Travel Assistant", "Ask for help with destinations and planning a private tour in Georgia."],
    ka: ["მოგზაურობის ასისტენტი საქართველოში", "დასვით კითხვები საქართველოს მიმართულებებზე და მიიღეთ დახმარება კერძო ტურის დაგეგმვაში."],
    ru: ["Помощник по путешествиям в Грузии", "Задайте вопросы о направлениях и планировании частного тура по Грузии."],
    he: ["עוזר לתכנון טיולים בגאורגיה", "שאלו על יעדים בגאורגיה וקבלו עזרה בתכנון טיול פרטי."],
  },
  "/booking": {
    en: ["Tour Booking & Deposit", "Estimate your private tour price and arrange booking with VIPTravelGeorgia."],
    ka: ["ტურის დაჯავშნა და დეპოზიტი", "მიიღეთ კერძო ტურის ფასის შეფასება და შეათანხმეთ ჯავშანი VIPTravelGeorgia-სთან."],
    ru: ["Бронирование тура и предоплата", "Рассчитайте примерную стоимость частного тура и согласуйте бронирование с VIPTravelGeorgia."],
    he: ["הזמנת טיול ומקדמה", "קבלו הערכת מחיר לטיול פרטי ותאמו הזמנה עם VIPTravelGeorgia."],
  },
  "/videos": {
    en: ["Georgia Travel Videos", "See footage from private tours and scenic trips across Georgia."],
    ka: ["მოგზაურობის ვიდეოები საქართველოდან", "ნახეთ ვიდეოები კერძო ტურებიდან და საქართველოს თვალწარმტაცი ადგილებიდან."],
    ru: ["Видео путешествий по Грузии", "Смотрите видео с частных экскурсий и поездок по живописным местам Грузии."],
    he: ["סרטוני טיולים בגאורגיה", "צפו בסרטונים מסיורים פרטיים ומטיולים בנופים של גאורגיה."],
  },
};

const TRANSLATED_PAGE_KEYS = {
  "/travel": ["trH", "trSub"],
  "/recent-tours": ["recentTours", "recentToursIntro"],
};

export const INDEXABLE_PAGE_PATHS = [
  ...Object.keys(PAGE_COPY).filter(path => path !== "/booking"),
  ...Object.keys(TRANSLATED_PAGE_KEYS),
];

const LEGACY_TOUR_COPY = {
  adjara: [1, "002"],
  martvili: [2, "009"],
  gomis: [3, "018"],
  svaneti: [4, "025"],
  kobuleti: [6, "043"],
  dashbashi: [7, "050"],
  vardzia: [8, "056"],
  tusheti: [9, "063"],
  beshumi: [10, "068"],
  kazbegi: [11, "078"],
  highlights: [12, "086"],
};

export const NO_INDEX = { robots: { index: false, follow: true } };

export function getLocale(value) {
  return SEO_LANGS.includes(value) ? value : "en";
}

export function alternateUrls(path) {
  return Object.fromEntries([
    ...SEO_LANGS.map(lang => [lang, SITE_URL + localizedPath(lang, path)]),
    ["x-default", SITE_URL + localizedPath("en", path)],
  ]);
}

function socialImage(image) {
  if (image?.startsWith("/") && !image.startsWith("//")) return new URL(image, SITE_URL).href;
  if (/^https?:\/\//i.test(image || "")) {
    try { return new URL(image).href; } catch { return null; }
  }
  return null;
}

export function localizedMetadata(path, title, description, image, lang) {
  const url = SITE_URL + localizedPath(lang, path);
  const cover = socialImage(image);
  const social = cover || SITE_URL + LOGO;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url, languages: alternateUrls(path) },
    openGraph: {
      type: "website", siteName: SITE_NAME, title, description, url,
      locale: OPEN_GRAPH_LOCALES[lang],
      alternateLocale: SEO_LANGS.filter(alternate => alternate !== lang)
        .map(alternate => OPEN_GRAPH_LOCALES[alternate]),
      images: [{ url: social, alt: cover ? title : SITE_NAME }],
    },
    twitter: { card: cover ? "summary_large_image" : "summary", title, description, images: [social] },
  };
}

function translate(keys, lang) {
  return keys.map(key => translations[lang]?.[key] || translations.en[key]);
}

export function pageMetadata(path, locale) {
  const lang = getLocale(locale);
  const keys = Object.hasOwn(TRANSLATED_PAGE_KEYS, path) ? TRANSLATED_PAGE_KEYS[path] : null;
  const copy = PAGE_COPY[path]?.[lang]
    || (keys && translate(keys, lang));
  if (!copy) return { title: SITE_NAME, metadataBase: new URL(SITE_URL) };

  const metadata = localizedMetadata(path, ...copy, undefined, lang);
  return path === "/booking" ? { ...metadata, ...NO_INDEX } : metadata;
}

function plainText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_\x60]/g, "").replace(/\s+/g, " ").trim();
}

function truncate(value, max) {
  const characters = Array.from(value);
  if (characters.length <= max) return value;
  const start = characters.slice(0, max - 1).join("");
  const lastSpace = start.lastIndexOf(" ");
  return (lastSpace > max * 0.75 ? start.slice(0, lastSpace) : start).trimEnd() + "…";
}

export function tourMetadata(tour, path, lang) {
  const legacyCopy = LEGACY_TOUR_COPY[tour.slug];
  const [titleKey, descriptionKey] = legacyCopy ? [`t${legacyCopy[0]}`, `d${legacyCopy[0]}`] : [];
  const [legacyTitle, legacyDescription] = legacyCopy ? translate([titleKey, descriptionKey], lang) : [];
  const saved = tour.translations?.[lang];
  const legacyPath = path === `/${tour.slug}`;
  const defaultDescription = PAGE_COPY["/tours"][lang][1];
  const title = plainText((legacyPath && legacyTitle) || saved?.title || tour.title);
  const description = plainText((legacyPath && legacyDescription) || saved?.description || tour.description);
  return localizedMetadata(
    path,
    truncate(title || PAGE_COPY["/tours"][lang][0], 70),
    truncate(description || defaultDescription, 160),
    tour.cover_url || (legacyCopy && `/images/photo-${legacyCopy[1]}.jpg`),
    lang,
  );
}

export function regionMetadata(region, lang) {
  return localizedMetadata(
    `/regions/${region.id}`,
    plainText(region.title),
    truncate(plainText(region.description) || translate(["trSub"], lang)[0], 160),
    region.image_url,
    lang,
  );
}

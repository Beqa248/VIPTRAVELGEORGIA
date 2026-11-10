import { getPublishedRegionIds, getPublishedTourRoutes, getPublicDb } from "../../lib/publicContent";
import { localizedPath } from "../../lib/localizedPath";
import { INDEXABLE_PAGE_PATHS, SEO_LANGS, SITE_URL, alternateUrls } from "../../lib/seo";
import { getTourPath } from "../../lib/tourRoutes";
import { renderSitemapTree } from "../../lib/sitemapTree.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const XML_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function publishedUpdateDates(table, key) {
  const db = getPublicDb();
  if (!db) return new Map();
  const { data, error } = await db.from(table)
    .select(`${key},updated_at`)
    .eq("published", true)
    .eq("archived", false);
  if (error) return new Map();
  return new Map((data || []).map(item => [String(item[key]), validDate(item.updated_at)]));
}

export async function GET(request) {
  const [tours, regionIds, tourDates, regionDates] = await Promise.all([
    getPublishedTourRoutes(),
    getPublishedRegionIds(),
    publishedUpdateDates("custom_tours", "slug"),
    publishedUpdateDates("travel_regions", "id"),
  ]);

  const paths = new Map(INDEXABLE_PAGE_PATHS.map(path => [path, null]));
  for (const tour of tours) {
    if (VALID_SLUG.test(tour.slug) && tour.slug !== "airport-transfers") {
      paths.set(getTourPath(tour), tourDates.get(tour.slug) || null);
    }
  }
  for (const id of regionIds) {
    paths.set(`/regions/${encodeURIComponent(id)}`, regionDates.get(String(id)) || null);
  }

  // Browsers opening /sitemap.xml get a collapsible tree; crawlers get the XML.
  // Force a view with ?view=tree or ?view=xml.
  const view = new URL(request.url).searchParams.get("view");
  const isBrowserNavigation =
    (request.headers.get("accept") || "").includes("text/html") &&
    request.headers.get("sec-fetch-dest") === "document";
  const vary = "Accept, Sec-Fetch-Dest";

  if (view === "tree" || (view !== "xml" && isBrowserNavigation)) {
    return new Response(
      renderSitemapTree({
        entries: [...paths],
        siteUrl: SITE_URL,
        langs: SEO_LANGS,
        localizedPath,
        siteName: "VIPTravelGeorgia",
      }),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex",
          Vary: vary,
        },
      }
    );
  }

  const urls = [];
  for (const [path, lastmod] of paths) {
    const alternatives = alternateUrls(path);
    for (const lang of SEO_LANGS) {
      const loc = SITE_URL + localizedPath(lang, path);
      const alternateTags = Object.entries(alternatives).map(([language, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(href)}" />`
      ).join("\n");
      urls.push([
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
        alternateTags,
        "  </url>",
      ].join("\n"));
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${XML_NS}" xmlns:xhtml="${XHTML_NS}">`,
    ...urls,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
      Vary: vary,
    },
  });
}

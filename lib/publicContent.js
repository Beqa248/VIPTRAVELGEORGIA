import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

const TOUR_FIELDS = "slug,title,description,duration_days,category,cover_url,itinerary,gallery_images,is_original,published,archived,sort_order";
const OPTIONAL_TOUR_FIELDS = ["translations", "price_mode,price_amount,price_currency,price_unit"];

export function getPublicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function published(db, table, fields) {
  return db.from(table).select(fields).eq("published", true).eq("archived", false);
}

function missingColumn(error, fields) {
  return ["42703", "PGRST204"].includes(error?.code)
    && fields.split(",").some(field => error.message?.includes(field));
}

async function readTours(query) {
  const db = getPublicDb();
  if (!db) return null;

  let fields = OPTIONAL_TOUR_FIELDS;
  while (true) {
    const { data, error } = await query(published(db, "custom_tours", [TOUR_FIELDS, ...fields].join(",")));
    if (!error) return data;

    const remainingFields = fields.filter(group => !missingColumn(error, group));
    if (remainingFields.length === fields.length) {
      console.error("Unable to read published tours:", error.message);
      return null;
    }
    fields = remainingFields;
  }
}

export const getPublishedTours = cache(() =>
  readTours(query => query.order("sort_order").order("slug")));

export const getPublishedTour = cache(slug =>
  readTours(query => query.eq("slug", slug).maybeSingle()));

export async function getPublishedTourRoutes() {
  const db = getPublicDb();
  if (!db) return [];

  const { data, error } = await published(
    db, "custom_tours", "slug,is_original,itinerary,gallery_images",
  ).order("slug");
  if (error) {
    console.error("Unable to read published tour routes:", error.message);
    return [];
  }
  return data;
}

export const getPublishedRegion = cache(async id => {
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) return null;
  const db = getPublicDb();
  if (!db) return null;

  const fields = "id,title,description,image_url";
  const readRegion = columns => published(db, "travel_regions", columns).eq("id", id).maybeSingle();
  let { data, error } = await readRegion(`${fields},gallery_images`);
  if (missingColumn(error, "gallery_images")) ({ data, error } = await readRegion(fields));
  if (error) {
    console.error("Unable to read published region:", error.message);
    return null;
  }
  return data;
});

export async function getPublishedRegionIds() {
  const db = getPublicDb();
  if (!db) return [];

  const { data, error } = await published(db, "travel_regions", "id").order("id");
  if (error) {
    console.error("Unable to read published regions:", error.message);
    return [];
  }
  return data.map(region => region.id);
}

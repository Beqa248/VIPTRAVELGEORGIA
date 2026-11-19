export const CONTENT_LANGS = ["en", "ka", "ru", "he"];
const present = v => typeof v === "string" && !!v.trim();
export function contentLocales(row, fields = ["title", "description"]) {
  return CONTENT_LANGS.filter(l => l === "en" || fields.every(f => !present(row[f]) || (present(row.translations?.[l]?.[f]))));
}
export function transferLocales(row) {
  return CONTENT_LANGS.filter(l => l === "en" || present(row.names?.[l]));
}
export function localizedField(row, field, lang) {
  return row.translations?.[lang]?.[field]?.trim() || row[field] || "";
}

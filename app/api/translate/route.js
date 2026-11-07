import { NextResponse } from "next/server";

// Free MyMemory public endpoint. No Google credentials or billing required.
// This is a best-effort fallback; limits, availability and language coverage vary.
const supported = new Set(["ru", "ka", "he"]);
const cache = new Map();
const MAX_CACHE = 1500;
async function translateOne(text, target) {
  if (!text.trim()) return text;
  const key = JSON.stringify([target, text]);
  if (cache.has(key)) return cache.get(key);
  // MyMemory limits individual requests to 500 bytes; split at Unicode boundaries.
  const parts = [];
  let chunk = "";
  for (const ch of text) {
    if (new TextEncoder().encode(chunk + ch).length > 450) {
      if (chunk) parts.push(chunk);
      chunk = ch;
    } else chunk += ch;
  }
  if (chunk) parts.push(chunk);
  const output = [];
  for (const part of parts) {
    const params = new URLSearchParams({ q: part, langpair: `en|${target}` });
    const email = process.env.MYMEMORY_CONTACT_EMAIL;
    if (email) params.set("de", email);
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Free translation provider unavailable");
    const data = await response.json();
    if (Number(data.responseStatus) !== 200 || !data.responseData?.translatedText) throw new Error(data.responseDetails || "Translation unavailable");
    output.push(data.responseData.translatedText);
  }
  const result = output.join("");
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(key, result);
  return result;
}
export async function POST(request) {
  try {
    const { texts, target } = await request.json();
    if (!Array.isArray(texts) || texts.length > 12 || !["en", ...supported].includes(target) || texts.some(t => typeof t !== "string" || t.length > 4000) || texts.join("").length > 10000)
      return NextResponse.json({ error: "Invalid translation request" }, { status: 400 });
    if (target === "en") return NextResponse.json({ translations: texts });
    const translations = [];
    for (const value of texts) translations.push(await translateOne(value, target));
    return NextResponse.json({ translations, configured: true });
  } catch (error) {
    return NextResponse.json({ error: "Free translation is temporarily unavailable or the daily limit was reached. Please retry later." }, { status: 503 });
  }
}

"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./site-context";

const cache = new Map();
const pending = new Map();
const CACHE_LIMIT = 250;

function translate(signature, values, lang) {
  if (cache.has(signature)) return Promise.resolve(cache.get(signature));
  if (pending.has(signature)) return pending.get(signature);
  const request = fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: values, target: lang }),
  })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      if (!Array.isArray(data?.translations) || data.translations.length !== values.length) return null;
      if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value);
      cache.set(signature, data.translations);
      return data.translations;
    })
    .catch(() => null)
    .finally(() => pending.delete(signature));
  pending.set(signature, request);
  return request;
}

export default function useTranslatedFields(fields) {
  const { lang } = useLanguage();
  const values = fields.map((value) => String(value ?? ""));
  const signature = JSON.stringify([lang, values]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    const [target, source] = JSON.parse(signature);
    if (target === "en" || !source.some(Boolean)) return;

    translate(signature, source, target).then((translations) => {
      if (active && translations) setResult({ signature, translations });
    });
    return () => { active = false; };
  }, [signature]);

  return result?.signature === signature ? result.translations : values;
}

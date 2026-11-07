"use client";
import useTranslatedFields from "./useTranslatedFields";
import { useLanguage } from "./site-context";
export default function TranslatedText({text, translations, field, as:Tag="span", ...props}) {
  const { lang } = useLanguage();
  const saved = lang !== "en" && translations?.[lang]?.[field];
  const [value] = useTranslatedFields([saved ? "" : (text || "")]);
  return <Tag {...props}>{saved || value}</Tag>;
}

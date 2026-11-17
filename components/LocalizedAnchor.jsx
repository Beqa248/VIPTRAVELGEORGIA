"use client";
import { useLanguage } from "./site-context";
import { localizedPath } from "../lib/localizedPath";
export default function LocalizedAnchor({ href, ...props }) {
  const { lang } = useLanguage();
  const target = typeof href === "string" && /^\/(?!\/)/.test(href)
    && !/^\/(?:en|ka|ru|he|admin|api|images|_next)(?:[/?#]|$)/.test(href)
    ? localizedPath(lang, href) : href;
  return <a {...props} href={target} />;
}

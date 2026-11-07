"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import translations from "../lib/translations.json";
const LANGS = ["en","ka","ru","he"];
const Context = createContext({lang:"en",setLang:()=>{},t:k=>k});
export function LanguageProvider({children, initialLang="en"}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const prefix = pathname.split("/")[1];
  const fromUrl = LANGS.includes(prefix) ? prefix : initialLang;
  const [lang,setLanguage] = useState(fromUrl);
  useEffect(()=>setLanguage(fromUrl),[fromUrl]);
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="he"?"rtl":"ltr";
  },[lang]);
  function setLang(next) {
    if (!LANGS.includes(next)) return;
    const path = LANGS.includes(prefix) ? pathname.replace(/^\\/(en|ka|ru|he)(?=\\/|$)/,"") || "/" : pathname;
    setLanguage(next);
    router.push("/"+next+(path==="/"?"":path));
  }
  const t=k=>(translations[lang]?.[k] || translations.en?.[k] || k);
  return <Context.Provider value={{lang,setLang,t}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);

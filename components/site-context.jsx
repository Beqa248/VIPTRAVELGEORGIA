"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "../lib/translations.json";
const Context = createContext({ lang: "en", setLang: () => { }, t: k => k });
export function LanguageProvider({ children }) { const [lang, setLang] = useState("en"); useEffect(() => { const saved = localStorage.getItem("vip-lang"); if (saved && ["en", "ru", "ka", "he"].includes(saved))
    setLang(saved); }, []); useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "he" ? "rtl" : "ltr"; localStorage.setItem("vip-lang", lang); }, [lang]); const t = (k) => (translations[lang][k] || translations.en[k] || k); return <Context.Provider value={{ lang, setLang, t }}>{children}</Context.Provider>; }
export const useLanguage = () => useContext(Context);

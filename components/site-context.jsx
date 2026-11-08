"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import translations from "../lib/translations.json";
const LANGS = ["en","ka","ru","he"];
const Context = createContext({lang:"en",setLang:()=>{},t:k=>k,currency:"USD",setCurrency:()=>{},rates:{USD:1},formatPrice:()=>""});
export function LanguageProvider({children, initialLang="en"}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const prefix = pathname.split("/")[1];
  const fromUrl = LANGS.includes(prefix) ? prefix : initialLang;
  const [lang,setLanguage] = useState(fromUrl);
  const [currency,setCurrencyState] = useState("USD");
  const [rates,setRates] = useState({USD:1});
  useEffect(()=>{try{const saved=localStorage.getItem("vtg-currency");if(["USD","EUR","GEL"].includes(saved))setCurrencyState(saved);}catch{}},[]);
  useEffect(()=>{let live=true;fetch("/api/exchange-rates").then(r=>r.json()).then(data=>{if(live&&data.rates?.USD===1)setRates(data.rates)}).catch(()=>{});return()=>{live=false}},[]);
  const setCurrency=(value)=>{if(!["USD","EUR","GEL"].includes(value))return;setCurrencyState(value);try{localStorage.setItem("vtg-currency",value)}catch{}};
  const formatPrice=(amount,base="USD")=>{const n=Number(amount);if(!Number.isFinite(n))return "";const target=rates[currency]&&rates[base]?currency:base;const converted=target===base?n:n/rates[base]*rates[target];return ({USD:"$",EUR:"€",GEL:"₾"}[target]||"$")+Math.round(converted).toLocaleString("en-US")};
  useEffect(()=>setLanguage(fromUrl),[fromUrl]);
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="he"?"rtl":"ltr";
  },[lang]);
  function setLang(next) {
    if (!LANGS.includes(next)) return;
    const path = LANGS.includes(prefix) ? pathname.replace(/^\/(en|ka|ru|he)(?=\/|$)/,"") || "/" : pathname;
    setLanguage(next);
    router.push("/"+next+(path==="/"?"":path));
  }
  const t=k=>(translations[lang]?.[k] || translations.en?.[k] || k);
  return <Context.Provider value={{lang,setLang,t,currency,setCurrency,rates,formatPrice}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);

"use client";
import {useEffect,useMemo,useState} from "react";
import {useLanguage} from "./site-context";
const cache=new Map();
export default function useTranslatedFields(fields){
 const {lang}=useLanguage(); const [translated,setTranslated]=useState(null);
 const values=useMemo(()=>fields.map(x=>String(x||"")),[JSON.stringify(fields)]);
 const signature=JSON.stringify([lang,values]);
 useEffect(()=>{let active=true;setTranslated(null);if(lang==="en"||!values.some(Boolean))return()=>{active=false};
 const existing=cache.get(signature);if(existing){setTranslated(existing);return()=>{active=false};}
 fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({texts:values,target:lang})}).then(r=>r.ok?r.json():null).then(data=>{if(active&&data?.translations?.length===values.length){cache.set(signature,data.translations);setTranslated(data.translations)}}).catch(()=>{});
 return()=>{active=false};},[signature]);
 return translated||values;
}

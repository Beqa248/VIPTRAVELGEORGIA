import { cache } from "react";
import {getPublicDb} from "./publicContent";
export const languages = ["en","ka","ru","he"];
export const ready = (row,lang) => Boolean(row?.content?.[lang]?.title?.trim() && row?.content?.[lang]?.body?.trim() && row?.content?.[lang]?.description?.trim());
export const getLandingPages = cache(async()=>{const db=getPublicDb(); if(!db)return []; const {data,error}=await db.from("seo_landing_pages").select("*").eq("published",true).order("slug"); if(error){console.error(error.message);return [];} return data||[];});

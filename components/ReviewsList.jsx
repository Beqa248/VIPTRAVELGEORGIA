"use client";
import { useState } from "react";
import { useLanguage } from "./site-context";
import reviews from "../lib/reviews.json";
export default function ReviewsList({ limit }) {
 const { lang } = useLanguage();
 return <div className="grid">{reviews.slice(0,limit || reviews.length).map((r,i)=><ReviewCard key={i} r={r} lang={lang}/>)}</div>;
}
function ReviewCard({r,lang}) {
 const [translated,setTranslated] = useState(false);
 const showEnglish = translated && r.en;
 return <article className="card review-card"><div className="t"><div className="stars">★★★★★</div><p>{showEnglish?r.en:r.text}</p><small><strong>{r.name}</strong> · {r.country} · {r.date} · GetYourGuide</small><small style={{display:"block",marginTop:5}}>{r.tour}</small>{r.en && <button className="trbtn" onClick={()=>setTranslated(v=>!v)}>{translated?"Original":"English translation"}</button>}</div></article>;
}

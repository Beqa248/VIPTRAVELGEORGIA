"use client";
import {useState,useEffect} from 'react';
import {useLanguage} from './site-context';
import {supabase} from '../lib/supabase';
import original from '../lib/reviews.json';
export default function ReviewsList({limit}){
 const {lang}=useLanguage();const [extra,setExtra]=useState([]);
 useEffect(()=>{if(!supabase)return;let alive=true;supabase.from('reviews').select('id,name,country,text,rating,created_at,tour').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>{if(alive)setExtra(data||[])});return()=>{alive=false}},[]);
 const all=[...extra,...original];return <div className="grid">{all.slice(0,limit||all.length).map((r,i)=><ReviewCard key={r.id||i} r={r} lang={lang}/>)}</div>
}
function ReviewCard({r}){const [translated,setTranslated]=useState(false);return <article className="card review-card"><div className="t"><div className="stars">{'★'.repeat(r.rating||5)}{'☆'.repeat(5-(r.rating||5))}</div><p>{translated&&r.en?r.en:r.text}</p><small><strong>{r.name}</strong> · {r.country||'Guest'} · {r.date||new Date(r.created_at).toLocaleDateString()} {r.id?'':'· GetYourGuide'}</small>{r.tour&&<small style={{display:'block',marginTop:5}}>{r.tour}</small>}{r.en&&<button className="trbtn" onClick={()=>setTranslated(v=>!v)}>{translated?'Original':'English translation'}</button>}</div></article>}

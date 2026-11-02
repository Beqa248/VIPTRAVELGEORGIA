"use client";
import {useState,useEffect} from 'react';
import {useLanguage} from '../site-context';
import usePublished from '../usePublished';
import {defaultVehicles} from '../../lib/defaultVehicles';
export default function Page(){
 const {t}=useLanguage();const {rows}=usePublished('vehicles');
 const cars=[...defaultVehicles.map(v=>rows.find(r=>r.name===v.name)||v),...rows.filter(r=>!defaultVehicles.some(v=>v.name===r.name))];
 const [active,setActive]=useState(0);
 useEffect(()=>{const requested=new URLSearchParams(window.location.search).get('car');if(requested){const i=cars.findIndex(v=>v.name===requested);if(i>=0)setActive(i);}},[rows]);
 const car=cars[active]||cars[0];
 return <div data-p="cars"><section><div className="wrap"><h2>{t('carsH')}</h2><div className="tabs" id="carTabs">{cars.map((c,i)=><button type="button" key={c.id||c.name} className={active===i?'on':''} onClick={()=>setActive(i)}>{c.name}</button>)}</div>{car&&<div className="carsec on"><p className="cd">{car.description||([t('carD1'),t('carD2'),t('carD3'),t('carD4'),t('carD5')][active]||'')}</p><div className="gal soft">{(car.images||[]).map((src,i)=><img key={src+i} src={src} alt={`${car.name} photo ${i+1}`} loading="lazy"/>)}</div>{!(car.images||[]).length&&<p>Photos coming soon</p>}<p className="soon">{t('carsSoon')}</p><p><a className="btn" href={`/contact?vehicle=${encodeURIComponent(car.name)}`}>{t('carAsk')}</a></p></div>}</div></section></div>;
}

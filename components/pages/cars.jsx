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
=======
import { useState } from "react";
import { useLanguage } from "../site-context";
export default function Page() {
    const { t } = useLanguage();
    const [activeCar, setActiveCar] = useState(0);
    return (<>
    <div className="" data-p="cars">
    <section><div className="wrap"><h2 data-k="carsH">{t("carsH")}</h2>
    <div className="tabs" id="carTabs"><button className={activeCar === 0 ? "on" : ""} onClick={() => setActiveCar(0)} data-c="0">Subaru Crosstrek 4x4</button><button className={activeCar === 1 ? "on" : ""} onClick={() => setActiveCar(1)} data-c="1">Jeep Wrangler</button><button className={activeCar === 2 ? "on" : ""} onClick={() => setActiveCar(2)} data-c="2" data-k="carMini">{t("carMini")}</button><button className={activeCar === 3 ? "on" : ""} onClick={() => setActiveCar(3)} data-c="3" data-k="carLux">{t("carLux")}</button><button className={activeCar === 4 ? "on" : ""} onClick={() => setActiveCar(4)} data-c="4" data-k="carClassic">{t("carClassic")}</button></div>
    {activeCar === 0 && <div className="carsec on" data-c="0"><p className="cd" data-k="carD1">{t("carD1")}</p><div className="gal soft" id="galC1">
    <img src="/images/photo-099.jpg" alt="White Subaru Crosstrek with Mount Kazbek behind" loading="lazy"/>
    <img src="/images/photo-100.jpg" alt="Subaru Crosstrek above the clouds at sunset" loading="lazy"/>
    <img src="/images/photo-101.jpg" alt="Driver-guide leaning on the Subaru Crosstrek above the clouds" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Subaru Crosstrek 4x4" data-k="carAsk">{t("carAsk")}</a></p></div>}
    {activeCar === 1 && <div className="carsec on" data-c="1"><p className="cd" data-k="carD2">{t("carD2")}</p><div className="gal soft" id="galC2">
    <img src="/images/photo-102.jpg" alt="Black Jeep Wrangler Unlimited on a sunny street" loading="lazy"/>
    <img src="/images/photo-103.jpg" alt="Black Jeep Wrangler front view with a mountain road behind" loading="lazy"/>
    <img src="/images/photo-104.jpg" alt="Jeep Wrangler parked in front of a wooden mountain lodge" loading="lazy"/>
    <img src="/images/photo-105.jpg" alt="Jeep Wrangler seen from behind on a mountain road" loading="lazy"/>
    <img src="/images/photo-106.jpg" alt="Jeep Wrangler front seats and dashboard" loading="lazy"/>
    <img src="/images/photo-107.jpg" alt="Jeep Wrangler rear seats" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Jeep Wrangler" data-k="carAsk">{t("carAsk")}</a></p></div>}
    {activeCar === 2 && <div className="carsec on" data-c="2"><p className="cd" data-k="carD3">{t("carD3")}</p><div className="gal soft" id="galC3">
    <img src="/images/photo-108.jpg" alt="White Honda minivan parked by palm trees" loading="lazy"/>
    <img src="/images/photo-109.jpg" alt="White minivan front and side view" loading="lazy"/>
    <img src="/images/photo-110.jpg" alt="White minivan parked on a city street" loading="lazy"/>
    <img src="/images/photo-111.jpg" alt="White minivan from behind with the spoiler and rear windows" loading="lazy"/>
    <img src="/images/photo-112.jpg" alt="Minivan leather seats and rows of headrests" loading="lazy"/>
    <img src="/images/photo-113.jpg" alt="Minivan dashboard and front seats" loading="lazy"/>
    </div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Minivan" data-k="carAsk">{t("carAsk")}</a></p></div>}
    {activeCar === 3 && <div className="carsec on" data-c="3"><p className="cd" data-k="carD4">{t("carD4")}</p><div className="gal soft" id="galC4"></div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Mercedes Luxury" data-k="carAsk">{t("carAsk")}</a></p></div>}
    {activeCar === 4 && <div className="carsec on" data-c="4"><p className="cd" data-k="carD5">{t("carD5")}</p><div className="gal soft" id="galC5"></div><p className="soon" data-k="carsSoon">{t("carsSoon")}</p><p><a className="btn" href="/contact" data-v="Classic Mercedes Charlotte" data-k="carAsk">{t("carAsk")}</a></p></div>}
    </div></section></div>
    </>);


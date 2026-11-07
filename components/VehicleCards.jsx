"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import usePublished from "./usePublished";
import { useLanguage } from "./site-context";
import { carIcon } from "../lib/defaultVehicles";

const translations = {
  en: { passengers: "Passengers", luggage: "Luggage", ac: "A/C", details: "Vehicle details", loading: "Loading available cars…", empty: "No vehicles are currently available.", yes: "Yes", no: "No" },
  ka: { passengers: "მგზავრები", luggage: "ბარგი", ac: "კონდიციონერი", details: "მანქანის დეტალები", loading: "მანქანები იტვირთება…", empty: "ამჟამად მანქანები არ არის ხელმისაწვდომი.", yes: "კი", no: "არა" },
  ru: { passengers: "Пассажиры", luggage: "Багаж", ac: "Кондиционер", details: "Детали автомобиля", loading: "Загрузка автомобилей…", empty: "Автомобили пока недоступны.", yes: "Да", no: "Нет" },
  he: { passengers: "נוסעים", luggage: "מטען", ac: "מיזוג אוויר", details: "פרטי הרכב", loading: "טוען רכבים…", empty: "אין רכבים זמינים כרגע.", yes: "כן", no: "לא" },
};

function VehicleCard({ car, labels }) {
  const [expanded, setExpanded] = useState(false);
  const hasAc = car.air_conditioning === true;
  return (
    <article className="vtg-modern-car-card">
      <Link className="vtg-modern-car-photo" href={`/cars?car=${encodeURIComponent(car.name)}`} aria-label={car.name}>
        {car.images?.[0] ? <img src={car.images[0]} alt={car.name} loading="lazy" /> : <span className="vtg-modern-car-fallback">{carIcon(car.name)}</span>}
      </Link>
      <div className="vtg-modern-car-body">
        <Link className="vtg-modern-car-title" href={`/cars?car=${encodeURIComponent(car.name)}`}>{car.name}</Link>
        <p className="vtg-modern-car-summary"><span aria-hidden="true">♙</span> {labels.passengers}: {Number(car.passengers) || 0}</p>
        <button type="button" className="vtg-modern-car-toggle" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
          <span>{labels.details}</span><span className={`vtg-modern-car-chevron ${expanded ? "open" : ""}`} aria-hidden="true">⌄</span>
        </button>
        {expanded && <div className="vtg-modern-car-expanded">
          <div className="vtg-modern-car-feature"><span aria-hidden="true">♙</span><strong>{Number(car.passengers) || 0}</strong><small>{labels.passengers}</small></div>
          <div className="vtg-modern-car-feature"><span aria-hidden="true">▣</span><strong>{car.luggage_capacity || "—"}</strong><small>{labels.luggage}</small></div>
          <div className="vtg-modern-car-feature"><span aria-hidden="true">❄</span><strong>{hasAc ? labels.yes : labels.no}</strong><small>{labels.ac}</small></div>
        </div>}
      </div>
    </article>
  );
}

export default function VehicleCards() {
  const { lang } = useLanguage();
  const labels = translations[lang] || translations.en;
  const { rows, loaded } = usePublished("vehicles");
  const cars = [...rows].sort((a,b) => (a.sort_order ?? 999999) - (b.sort_order ?? 999999));
  if (!loaded) return <p>{labels.loading}</p>;
  if (!cars.length) return <p>{labels.empty}</p>;
  return <VehicleCarousel cars={cars} labels={labels} />;
}

function VehicleCarousel({ cars, labels }) {
  const track = useRef(null);
  const [position, setPosition] = useState(0);
  const [canNext, setCanNext] = useState(cars.length > 2);
  const [canPrev, setCanPrev] = useState(false);
  const update = () => {
    const node = track.current;
    if (!node) return;
    const max = Math.max(0, node.scrollWidth - node.clientWidth);
    setCanPrev(node.scrollLeft > 4);
    setCanNext(node.scrollLeft < max - 4);
    setPosition(max ? Math.round((node.scrollLeft / max) * 100) : 0);
  };
  const move = direction => {
    const node = track.current;
    if (!node) return;
    const first = node.querySelector('.vtg-modern-car-card');
    const gap = parseFloat(getComputedStyle(node).columnGap) || 12;
    node.scrollBy({ left: direction * ((first?.getBoundingClientRect().width || node.clientWidth) + gap), behavior: 'smooth' });
  };
  return <div className="vtg-car-carousel">
    <div className="vtg-modern-cars-grid" ref={track} onScroll={update} role="region" aria-label={labels.details} tabIndex={0}>
      {cars.map(car => <VehicleCard key={car.id || car.name} car={car} labels={labels} />)}
    </div>
    {cars.length > 1 && <div className="vtg-car-carousel-controls">
      <div className="vtg-car-carousel-progress" aria-hidden="true"><span style={{left: `${position * .72}%`}} /></div>
      <div className="vtg-car-carousel-arrows">
        <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous vehicle">‹</button>
        <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next vehicle">›</button>
      </div>
    </div>}
  </div>;
}

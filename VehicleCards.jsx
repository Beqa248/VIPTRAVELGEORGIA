"use client";

import Link from "next/link";
import { useState } from "react";
import usePublished from "./usePublished";
import { useLanguage } from "./site-context";
import { carIcon } from "../lib/defaultVehicles";

const translations = {
  en: { passengers: "Passengers", luggage: "Luggage", ac: "A/C", details: "Vehicle details", loading: "Loading available cars…", empty: "No vehicles are currently available." },
  ka: { passengers: "მგზავრები", luggage: "ბარგი", ac: "კონდიციონერი", details: "მანქანის დეტალები", loading: "მანქანები იტვირთება…", empty: "ამჟამად მანქანები არ არის ხელმისაწვდომი." },
  ru: { passengers: "Пассажиры", luggage: "Багаж", ac: "Кондиционер", details: "Детали автомобиля", loading: "Загрузка автомобилей…", empty: "Автомобили пока недоступны." },
  he: { passengers: "נוסעים", luggage: "מטען", ac: "מיזוג אוויר", details: "פרטי הרכב", loading: "טוען רכבים…", empty: "אין רכבים זמינים כרגע." },
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
          {car.luggage_capacity && <div className="vtg-modern-car-feature"><span aria-hidden="true">▣</span><strong>{car.luggage_capacity}</strong><small>{labels.luggage}</small></div>}
          {hasAc && <div className="vtg-modern-car-feature"><span aria-hidden="true">❄</span><strong>{labels.ac}</strong></div>}
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
  return <div className="vtg-modern-cars-grid">{cars.map(car => <VehicleCard key={car.id || car.name} car={car} labels={labels} />)}</div>;
}

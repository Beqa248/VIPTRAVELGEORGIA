"use client";

import Link from "next/link";
import Image from "next/image";
import { isOptimizablePhoto } from "../lib/imageSources.mjs";
import { useEffect, useRef, useState } from "react";
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
        {car.images?.[0] ? (isOptimizablePhoto(car.images[0]) ? (
          <Image src={car.images[0]} alt={car.name} width={480} height={360}
            sizes="(max-width: 600px) 85vw, (max-width: 1100px) 45vw, 320px"
            loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <img src={car.images[0]} alt={car.name} loading="lazy" decoding="async" />
        )) : <span className="vtg-modern-car-fallback">{carIcon(car.name)}</span>}
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
  const rail = useRef(null);
  const drag = useRef(null);
  const [ratio, setRatio] = useState(0);
  const [thumbFraction, setThumbFraction] = useState(1);
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);

  const update = () => {
    const node = track.current;
    if (!node) return;
    const max = Math.max(0, node.scrollWidth - node.clientWidth);
    setRatio(max ? Math.max(0, Math.min(1, node.scrollLeft / max)) : 0);
    setThumbFraction(Math.min(1, node.clientWidth / Math.max(node.scrollWidth, 1)));
    setCanPrev(node.scrollLeft > 3);
    setCanNext(node.scrollLeft < max - 3);
  };
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(node);
    Array.from(node.children).forEach(child => observer?.observe(child));
    window.addEventListener("resize", update);
    update();
    return () => { observer?.disconnect(); window.removeEventListener("resize", update); };
  }, [cars.length]);

  const move = direction => {
    const node = track.current;
    if (!node) return;
    const first = node.querySelector(".vtg-modern-car-card");
    const gap = parseFloat(getComputedStyle(node).columnGap) || 10;
    node.scrollBy({ left: direction * ((first?.getBoundingClientRect().width || node.clientWidth) + gap), behavior: "smooth" });
  };
  const scrollToRailPosition = clientX => {
    const bar = rail.current, node = track.current;
    if (!bar || !node) return;
    const rect = bar.getBoundingClientRect();
    const thumbWidth = rect.width * thumbFraction;
    const available = Math.max(1, rect.width - thumbWidth);
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left - (drag.current?.offset ?? thumbWidth / 2)) / available));
    node.scrollLeft = fraction * Math.max(0, node.scrollWidth - node.clientWidth);
    update();
  };
  const startDrag = event => {
    const rect = rail.current.getBoundingClientRect();
    const thumbWidth = rect.width * thumbFraction;
    const thumbLeft = rect.left + (rect.width - thumbWidth) * ratio;
    drag.current = { offset: event.clientX >= thumbLeft && event.clientX <= thumbLeft + thumbWidth ? event.clientX - thumbLeft : thumbWidth / 2 };
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollToRailPosition(event.clientX);
  };
  const endDrag = event => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="vtg-car-carousel">
    <div className="vtg-modern-cars-grid" ref={track} onScroll={update} role="region" aria-label={labels.details} tabIndex={0}>
      {cars.map(car => <VehicleCard key={car.id || car.name} car={car} labels={labels} />)}
    </div>
    {cars.length > 1 && <div className="vtg-car-carousel-controls">
      <button className="vtg-car-arrow" type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous vehicle">‹</button>
      <div className="vtg-car-carousel-progress" ref={rail} role="scrollbar" aria-label="Scroll vehicles" aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ratio * 100)} tabIndex={0}
        onPointerDown={startDrag} onPointerMove={event => { if (drag.current) scrollToRailPosition(event.clientX); }} onPointerUp={endDrag} onPointerCancel={endDrag}
        onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
        <span className="vtg-car-carousel-thumb" style={{ width: `${thumbFraction * 100}%`, left: `${ratio * (1 - thumbFraction) * 100}%` }} />
      </div>
      <button className="vtg-car-arrow" type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next vehicle">›</button>
    </div>}
  </div>;
}

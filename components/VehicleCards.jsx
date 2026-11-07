"use client";

import Link from "next/link";
import usePublished from "./usePublished";
import { useLanguage } from "./site-context";
import { carIcon } from "../lib/defaultVehicles";

export default function VehicleCards() {
  const { lang } = useLanguage();
  const labels = ({en:["Passengers","Luggage","Drive"],ka:["მგზავრები","ბარგი","ამძრავი"],ru:["Пассажиры","Багаж","Привод"],he:["נוסעים","מטען","הנעה"]})[lang] || ["Passengers","Luggage","Drive"];
  // Use the exact published Supabase records that power /cars.
  // Never fall back to hardcoded defaults: deleted/hidden cars must stay hidden.
  const { rows, loaded } = usePublished("vehicles");
  const cars = [...rows].sort((a, b) =>
    (a.sort_order ?? 999999) - (b.sort_order ?? 999999)
  );

  if (!loaded) return <p>Loading available cars…</p>;
  if (!cars.length) return <p>No vehicles are currently available.</p>;

  return (
    <div className="ctiles">
      {cars.map((car, i) => (
        <Link
          key={car.id || car.name}
          className="ctile"
          href={`/cars?car=${encodeURIComponent(car.name)}`}
          style={{
            background: car.images?.[0]
              ? `linear-gradient(0deg,rgba(0,0,0,.68),rgba(0,0,0,.05)),url("${car.images[0]}") center/cover`
              : [
                  "linear-gradient(135deg,#00897b,#80cbc4)",
                  "linear-gradient(135deg,#6d4c41,#bcaaa4)",
                  "linear-gradient(135deg,#3949ab,#9fa8da)",
                  "linear-gradient(135deg,#37474f,#90a4ae)",
                  "linear-gradient(135deg,#8e24aa,#ce93d8)",
                ][i % 5],
          }}
        >
          {!car.images?.length && <i>{carIcon(car.name)}</i>}
          <span className="vtg-vehicle-card-content"><strong>{car.name}</strong>
            <span className="vtg-vehicle-card-specs">
              {Number(car.passengers)>0 && <span>♙ {labels[0]}: {car.passengers}</span>}
              {car.luggage_capacity && <span>▣ {labels[1]}: {car.luggage_capacity}</span>}
              {car.drivetrain && <span>⚙ {labels[2]}: {car.drivetrain}</span>}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

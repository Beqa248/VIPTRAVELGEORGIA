"use client";
import usePublished from "./usePublished";
import { useLanguage } from "./site-context";
export default function VehicleSelect({ id="v", name }) {
 const { t } = useLanguage();
 const { rows, loaded } = usePublished("vehicles");
 const cars = [...rows].sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999));
 return <select id={id} name={name} defaultValue=""><option value="">{loaded?t("contactNotSure"):t("contactLoadingCars")}</option>{cars.map(car=><option key={car.id||car.name} value={car.name}>{car.name}</option>)}</select>;
}

"use client";
import usePublished from "./usePublished";
export default function VehicleSelect({ id="v", name }) {
 const { rows, loaded } = usePublished("vehicles");
 const cars = [...rows].sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999));
 return <select id={id} name={name} defaultValue=""><option value="">{loaded?"Not sure yet":"Loading vehicles…"}</option>{cars.map(car=><option key={car.id||car.name} value={car.name}>{car.name}</option>)}</select>;
}

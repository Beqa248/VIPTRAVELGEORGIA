"use client";
import Link from 'next/link';
import usePublished from './usePublished';
import {defaultVehicles,carIcon} from '../lib/defaultVehicles';
export default function VehicleCards(){
 const {rows}=usePublished('vehicles');
 const cars=[...defaultVehicles.map(v=>rows.find(r=>r.name===v.name)||v),...rows.filter(r=>!defaultVehicles.some(v=>v.name===r.name))];
 return <div className="ctiles">{cars.map((car,i)=><Link key={car.id||car.name} className="ctile" href={`/cars?car=${encodeURIComponent(car.name)}`} style={{background:car.images?.[0]?`linear-gradient(0deg,rgba(0,0,0,.68),rgba(0,0,0,.05)),url("${car.images[0]}") center/cover`:['linear-gradient(135deg,#00897b,#80cbc4)','linear-gradient(135deg,#6d4c41,#bcaaa4)','linear-gradient(135deg,#3949ab,#9fa8da)','linear-gradient(135deg,#37474f,#90a4ae)','linear-gradient(135deg,#8e24aa,#ce93d8)'][i%5]}}>{!car.images?.length&&<i>{carIcon(car.name)}</i>}<span>{car.name}</span></Link>)}</div>;
}

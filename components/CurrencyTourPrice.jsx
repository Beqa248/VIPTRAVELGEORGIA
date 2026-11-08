"use client";
import {useLanguage} from "./site-context";
import {tourPriceLabel} from "../lib/tourPricing";
export default function CurrencyTourPrice({pricing}){
 const {formatPrice}=useLanguage();
 const label=tourPriceLabel(pricing,formatPrice);
 return label?<p className="vtg-tour-price">{label}</p>:null;
}

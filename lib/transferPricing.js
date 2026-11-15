export function isWinter(route,date) { const day=(date||'').slice(5,10); if(!day)return false; const a=route.winter_start,b=route.winter_end; return a<=b?day>=a&&day<=b:day>=a||day<=b; }
export function priceFor(route,direction,date,vehicle) { const key=direction==='to'?'inbound':'outbound'; const base=vehicle?route.vehicle_prices?.[vehicle]?.[key]:route[key]; const winter=isWinter(route,date); if(base==null)return !vehicle&&winter&&route.winter_quote!=null?Number(route.winter_quote):null; return winter&&Number(route.winter_percent)>0?Math.ceil(Number(base)*(1+Number(route.winter_percent)/100)/5-1e-9)*5:Number(base); }
export function transferSlug(route,direction){return direction==='to'?`${route.slug}-to-batumi`:`batumi-to-${route.slug}`;}
export function routeName(route,lang){return route.names?.[lang]||route.names?.en||route.slug;}
export const batumiNames={en:'Batumi',ka:'ბათუმი',ru:'Батуми',he:'באטומי'};
export function tripName(route,direction,lang){const b=batumiNames[lang]||batumiNames.en,n=routeName(route,lang);return direction==='to'?`${n} → ${b}`:`${b} → ${n}`;}

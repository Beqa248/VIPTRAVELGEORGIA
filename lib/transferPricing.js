export function isWinter(route,date) { const day=(date||'').slice(5,10); if(!day)return false; const a=route.winter_start,b=route.winter_end; return a<=b?day>=a&&day<=b:day>=a||day<=b; }
export const roundPrice=n=>Math.ceil(n/10-1e-9)*10;
export function vehicleKind(v){const n=v?.name||'';return /sprinter/i.test(n)?'sprinter':/wrangler|jeep/i.test(n)?'wrangler':/minivan|mini van|v.class|vito/i.test(n)?'minivan':/subaru|crosstrek/i.test(n)?'subaru':null;}
export const factors={subaru:1,minivan:1.25,wrangler:1.4,sprinter:1.4};
export function automaticPrice(base,kind){return base==null||!factors[kind]?null:roundPrice(Number(base)*factors[kind]);}
export function driverEstimate(base,kind){return base==null||!factors[kind]?null:roundPrice(Number(base))*factors[kind];}
export function retail(cost,margin=15,minimum=10){return cost==null?null:roundPrice(Math.max(Number(cost)/(1-margin/100),Number(cost)+minimum));}
export function priceFor(route,direction,date,vehicle) {
 const key=direction==='to'?'inbound':'outbound', id=typeof vehicle==='object'?vehicle?.id:vehicle, kind=vehicleKind(vehicle);
 const override=route.vehicle_prices?.[id]?.[key];
 const base=route[key];
 let amount=override!==undefined?override:!vehicle?base:kind==='subaru'?base:automaticPrice(base,kind);
 if(vehicle&&route.slug==='goderdzi'&&kind==='sprinter')return null;
 if(vehicle&&route.slug==='goderdzi'&&kind==='minivan'&&isWinter(route,date))return null;
 if(amount==null)return !vehicle&&isWinter(route,date)&&route.winter_quote!=null?roundPrice(Number(route.winter_quote)):null;
 return roundPrice(Number(amount)*(isWinter(route,date)?1+Math.max(route.category==='ski'?20:0,Number(route.winter_percent)||0)/100:1));
}
export function transferSlug(route,direction){return direction==='to'?`${route.slug}-to-batumi`:`batumi-to-${route.slug}`;}
export function routeName(route,lang){return route.names?.[lang]||route.names?.en||route.slug;}
export const batumiNames={en:'Batumi',ka:'ბათუმი',ru:'Батуми',he:'באטומי'};
export function tripName(route,direction,lang){const b=batumiNames[lang]||batumiNames.en,n=routeName(route,lang);return direction==='to'?`${n} → ${b}`:`${b} → ${n}`;}

import {transferContent} from "./transferContent";
import {transferLocales} from "./contentLocales";
import {localizedMetadata,SITE_URL} from './seo';
import {localizedPath} from './localizedPath';
import {tripName,transferSlug} from './transferPricing';
export const transferCover='/images/transfers-road-cover.webp';
const copy={
 en:['Private transfers from & to Batumi','Book private door-to-door transfers between Batumi and destinations in Georgia, including Tbilisi, Kutaisi Airport and mountain resorts.','Private transfer','Request a private door-to-door transfer with a local driver. Choose your vehicle and travel dates; availability and pricing are confirmed before booking.'],
 ka:['კერძო ტრანსფერები ბათუმიდან და ბათუმში','დაჯავშნეთ კერძო ტრანსფერი ბათუმსა და საქართველოს ქალაქებს, აეროპორტებსა და მთის კურორტებს შორის.','კერძო ტრანსფერი','მოითხოვეთ კერძო ტრანსფერი ადგილობრივ მძღოლთან ერთად. აირჩიეთ ავტომობილი და თარიღები; ფასი და ხელმისაწვდომობა დადასტურდება დაჯავშნამდე.'],
 ru:['Частные трансферы из Батуми и в Батуми','Закажите частный трансфер между Батуми и городами, аэропортами и горными курортами Грузии.','Частный трансфер','Закажите индивидуальный трансфер с местным водителем. Выберите автомобиль и даты; стоимость и доступность подтверждаются до бронирования.'],
 he:['הסעות פרטיות מבאטומי ואליה','הזמינו הסעה פרטית בין באטומי לערים, שדות תעופה ואתרי נופש הרריים בגאורגיה.','הסעה פרטית','בחרו רכב ותאריכים להסעה פרטית עם נהג מקומי. המחיר והזמינות יאושרו לפני ההזמנה.']
};
export function transferMeta(lang,route,direction){const c=copy[lang]||copy.en; const name=route?tripName(route,direction,lang):c[0];const path=route?'/transfers/'+transferSlug(route,direction):'/transfers';return localizedMetadata(path,route?`${c[2]}: ${name}`:name,route?`${name}. ${transferContent(route,direction,lang).note}`:c[1],transferCover,lang,route?transferLocales(route):undefined);}
export function transferSchema(lang,route,direction){const c=copy[lang]||copy.en;const path=route?'/transfers/'+transferSlug(route,direction):'/transfers';const url=SITE_URL+localizedPath(lang,path);const name=route?`${tripName(route,direction,lang)} — ${c[2]}`:c[0];const items=[{name:c[0],item:SITE_URL+localizedPath(lang,'/transfers')}];if(route)items.push({name,item:url});return [{'@context':'https://schema.org','@type':'Service',name,url,serviceType:c[2],provider:{'@id':SITE_URL+'/#organization'},areaServed:{'@type':'Country',name:'Georgia'},image:SITE_URL+transferCover},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'VIPToursGeorgia',item:SITE_URL+localizedPath(lang,'/')},...items].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))}];}

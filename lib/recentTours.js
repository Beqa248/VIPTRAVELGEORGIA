import { cache } from 'react';
import { getPublicDb } from './publicContent';
export const validRecentId = id => /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id);
export const recentPath = id => `/recent-tours/${id}`;
export const getRecentTours = cache(async () => {
 const db = getPublicDb(); if (!db) throw new Error('Storage configuration unavailable');
 const {data,error} = await db.from('recent_tours').select('*').eq('published',true).order('created_at',{ascending:false});
 if(error) throw new Error(error.message);
 return data.sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999));
});
export const getRecentTour = cache(async id => {
 if(!validRecentId(id)) return null;
 const db=getPublicDb(); if(!db) throw new Error('Storage configuration unavailable');
 const {data,error}=await db.from('recent_tours').select('*').eq('published',true).eq('id',id).maybeSingle();
 if(error) throw new Error(error.message); return data;
});
export function tripDate(row,lang){
 const fmt=v=>new Intl.DateTimeFormat(({en:'en-GB',ka:'ka-GE',ru:'ru-RU',he:'he-IL'})[lang]||'en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(v+'T00:00:00Z'));
 return row.tour_date ? fmt(row.tour_date)+(row.tour_end_date&&row.tour_end_date!==row.tour_date?' – '+fmt(row.tour_end_date):'') : '';
}
export const recentCopy={en:['View trip','All recent tours','Photo gallery','Videos','Plan your own trip','Recent Tours','Photographs from our recent adventures across Georgia.','No trips yet.'],ka:['ტურის ნახვა','ყველა ბოლო ტური','ფოტოგალერეა','ვიდეოები','დაგეგმეთ თქვენი ტური','ბოლო ტურები','ფოტოები ჩვენი ბოლო მოგზაურობებიდან საქართველოში.','ტურები ჯერ არ არის.'],ru:['Смотреть поездку','Все недавние поездки','Фотогалерея','Видео','Спланировать поездку','Недавние поездки','Фотографии наших недавних путешествий по Грузии.','Пока нет поездок.'],he:['לצפייה בטיול','כל הטיולים האחרונים','גלריית תמונות','סרטונים','תכננו טיול משלכם','טיולים אחרונים','תמונות מהטיולים האחרונים שלנו בגאורגיה.','אין עדיין טיולים.']};

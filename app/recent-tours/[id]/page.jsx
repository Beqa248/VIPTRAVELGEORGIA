import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import TranslatedText from '../../../components/TranslatedText';
import RegionGallery from '../../regions/[id]/RegionGallery';
import {getLocale,localizedMetadata,NO_INDEX,firstSocialImage} from '../../../lib/seo';
import {localizedPath} from '../../../lib/localizedPath';
import {getRecentTour,recentPath,tripDate,recentCopy} from '../../../lib/recentTours';
import styles from '../../../components/pages/recentTours.module.css';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){
 const {id}=await params; const row=await getRecentTour(id); if(!row)return NO_INDEX;
 const lang=getLocale((await headers()).get('x-vtg-locale'));
 return localizedMetadata(recentPath(id),row.title,(row.description||row.title).replace(/\s+/g,' ').slice(0,160),firstSocialImage(row.cover_url,...(row.images||[])),lang, ["en"]);
}
export default async function Trip({params}){
 const {id}=await params; const row=await getRecentTour(id); if(!row)notFound();
 const lang=getLocale((await headers()).get('x-vtg-locale')); const copy=recentCopy[lang];
 const cover=row.cover_url||row.images?.[0];const photos=[...new Set((row.images||[]).filter(Boolean))];const date=tripDate(row,lang);
 return <main className={styles.wrap}><Link className={styles.back} href={localizedPath(lang,'/recent-tours')}>← {copy[1]}</Link><article className={styles.detail}>
 <h1><TranslatedText text={row.title}/></h1>{date&&<p className={styles.date}>{date}</p>}
 {cover&&<img className={styles.hero} src={cover} alt={row.title} decoding="async"/>}
 {row.description&&<p className={styles.story}><TranslatedText text={row.description}/></p>}
 {photos.length>0&&<div className={styles.gallery}><h2>{copy[2]}</h2><RegionGallery photos={photos} title={row.title} labels={{gallery:copy[2],openPhoto:copy[2],closePhoto:'×'}}/></div>}
 {!!row.video_urls?.length&&<div><h2>{copy[3]}</h2><div className={styles.videos}>{row.video_urls.map((url,i)=><video key={i} controls playsInline preload="metadata" src={url}/>)}</div></div>}
 <Link className={styles.action} href={localizedPath(lang,'/custom-tour')}>{copy[4]} →</Link></article></main>;
}

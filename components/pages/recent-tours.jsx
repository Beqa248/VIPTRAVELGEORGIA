import Link from 'next/link';
import TranslatedText from '../TranslatedText';
import {getRecentTours,recentPath,tripDate,recentCopy} from '../../lib/recentTours';
import {localizedPath} from '../../lib/localizedPath';
import styles from './recentTours.module.css';
export default async function Page({lang='en'}){
 const rows=await getRecentTours(); const copy=recentCopy[lang]||recentCopy.en;
 return <main className={styles.wrap}><h1>{copy[5]}</h1><p>{copy[6]}</p><div className={styles.posts}>{rows.map(r=>{
 const cover=r.cover_url||r.images?.[0]; const date=tripDate(r,lang);
 return <Link prefetch={false} className={styles.post} key={r.id} href={localizedPath(lang,recentPath(r.id))}>
 {cover&&<img className={styles.cover} src={cover} alt={r.title} loading="lazy" decoding="async"/>}
 <div className={styles.body}><h2><TranslatedText text={r.title}/></h2>{date&&<small>{date}</small>}
 {r.description&&<p className={styles.excerpt}><TranslatedText text={r.description.slice(0,280)+(r.description.length>280?'…':'')}/></p>}
 <span className={styles.action}>{copy[0]} →</span></div></Link>;
 })}</div>{!rows.length&&<p>{copy[7]}</p>}</main>;
}

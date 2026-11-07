"use client";
import TranslatedText from "../TranslatedText";
import usePublished from '../usePublished';
import {useLanguage} from '../site-context';
export default function Page(){const {t}=useLanguage();const {rows,loaded}=usePublished('videos');return <div data-p="videos"><section><div className="wrap"><h2>{t('nVid')}</h2><div className="grid">{([...rows].sort((a,b)=>(a.sort_order??999999)-(b.sort_order??999999))).map(v=><article key={v.id} className="card"><video controls preload="metadata" playsInline poster={v.cover_url||undefined} style={{width:'100%',borderRadius:10,maxHeight:350}} src={v.video_url}/><div className="t"><h3><TranslatedText text={v.title}/></h3>{v.description&&<p><TranslatedText text={v.description}/></p>}</div></article>)}</div>{loaded&&!rows.length&&<p style={{color:'var(--mut)'}}>{t('vidSoon')}</p>}</div></section></div>}

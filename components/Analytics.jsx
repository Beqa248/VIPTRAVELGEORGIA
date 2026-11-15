"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { track, GA_ID, publicPage } from '../lib/analytics';
import { useLanguage } from './site-context';
const copy={en:['Allow anonymous website analytics?','Accept','Decline','Analytics settings'],ka:['დავუშვათ ვებსაიტის ანალიტიკა?','თანხმობა','უარი','ანალიტიკის პარამეტრები'],ru:['Разрешить аналитику сайта?','Принять','Отклонить','Настройки аналитики'],he:['לאפשר ניתוח שימוש באתר?','אישור','דחייה','הגדרות ניתוח']};
export default function Analytics(){
 const pathname=usePathname(); const {lang}=useLanguage(); const [choice,setChoice]=useState(null); const [open,setOpen]=useState(false);
 const [title,yes,no,settings]=copy[lang]||copy.en;
 useEffect(()=>{try{setChoice(localStorage.getItem('vtg-analytics')||'unset')}catch{setChoice('unset')}},[]);
 useEffect(()=>{if(!GA_ID||choice!=='yes'||!publicPage())return;
 window['ga-disable-'+GA_ID]=false;
 if(!window.__vtgGA){window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',GA_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});window.__vtgGA=true;const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_ID);document.head.appendChild(s);}
 const url=location.origin+location.pathname; if(window.__vtgLastPage!==url){window.__vtgLastPage=url;track('page_view');}
 const click=e=>{const a=e.target.closest?.('a[href]');if(!a)return;const href=a.getAttribute('href')||'';if(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href))track('whatsapp_click');else if(href.startsWith('tel:'))track('phone_click');else if(href.startsWith('mailto:'))track('email_click');};document.addEventListener('click',click,true);return()=>{document.removeEventListener('click',click,true);window['ga-disable-'+GA_ID]=true;};
 },[choice,pathname,lang]);
 function choose(v){try{localStorage.setItem('vtg-analytics',v)}catch{}window['ga-disable-'+GA_ID]=v!=='yes';if(v==='no'){window.__vtgLastPage=null;for(const c of document.cookie.split(';')){const k=c.split('=')[0].trim();if(/^_ga(?:_|$)/.test(k)){for(const d of ['', '; domain='+location.hostname,'; domain=.viptravelgeorgia.com'])document.cookie=k+'=; Max-Age=0; path=/'+d;}}}setChoice(v);setOpen(false);}
 if(!GA_ID||choice===null||/^\/(?:en\/|ka\/|ru\/|he\/)?admin(?:\/|$)/.test(pathname||''))return null;
 const panel={position:'fixed',bottom:16,insetInlineStart:16,zIndex:30,maxWidth:'min(360px, calc(100vw - 32px))',background:'#fff',color:'#153D35',padding:16,border:'1px solid #b9c9bf',borderRadius:12,boxShadow:'0 4px 20px #0002',fontSize:14};
 return choice==='unset'||open?<aside aria-label={settings} style={panel}><p style={{margin:'0 0 12px'}}>{title}</p><div style={{display:'flex',gap:8}}><button type="button" onClick={()=>choose('yes')} style={{background:'#153D35',color:'#fff',padding:'8px 16px',borderRadius:6}}>{yes}</button><button type="button" onClick={()=>choose('no')} style={{background:'#fff',color:'#153D35',padding:'8px 16px',border:'1px solid #153D35',borderRadius:6}}>{no}</button></div></aside>:<button type="button" onClick={()=>setOpen(true)} style={{display:'block',margin:'8px auto',fontSize:12,background:'transparent',color:'#153D35',textDecoration:'underline',border:0}}>{settings}</button>;
}

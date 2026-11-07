"use client";
import styles from "./SiteFooter.module.css";

const icons = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>,
  facebook: <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-1.5 1.6-1.5H18V2.2A19 19 0 0 0 15.4 2C11.9 2 10 4 10 7v2H7v4h3v8"/>,
  whatsapp: <><path d="M20 11.6a8.1 8.1 0 0 1-11.8 7.2L3 20l1.3-5.1a8.1 8.1 0 1 1 15.7-3.3Z"/><path d="M8.4 8.3c.5-.4.9-.1 1.2.5l.7 1.2c.2.4-.2.8-.5 1.1.8 1.5 1.9 2.4 3.4 3.1.4-.4.7-.9 1.2-.7l1.5.8c.5.3.4.8 0 1.2-.6.7-1.6.8-2.6.4-2.5-1-4.4-2.9-5.4-5.2-.3-.8-.2-1.7.5-2.4Z"/></>,
  telegram: <><path d="m21 3-3.7 17-5.5-4-3 2 .5-4.7L3 11l18-8Z"/><path d="m9.3 13.3 8.1-6.6-5.6 9.3"/></>
};
const socials = [
  {name:"Instagram",icon:"instagram",href:"https://www.instagram.com/viptravelgeorgia/"},
  {name:"Facebook",icon:"facebook",href:"https://www.facebook.com/share/19PjaiQedA/"},
  {name:"WhatsApp",icon:"whatsapp",href:"https://wa.me/995558176108"},
  {name:"Telegram",icon:"telegram",href:"https://t.me/SubTravelGeorgia"}
];
export default function SiteFooter(){return <footer className={styles.footer}>
  <div className={styles.inner}>
    <div className={styles.rule}/>
    <div className={styles.socials}>{socials.map(s=><a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${s.name}`} title={s.name}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[s.icon]}</svg></a>)}</div>
    <p>© {new Date().getFullYear()} VIPTravelGeorgia. All rights reserved.</p>
  </div>
</footer>}

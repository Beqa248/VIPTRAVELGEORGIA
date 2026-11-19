'use client';
import Link from 'next/link';
import styles from './subpages.module.css';
import dashboard from './dashboard.module.css';
const links=[['/admin','🚙','Cars'],['/admin','▶','Videos'],['/admin','🏔','Recent Tours'],['/admin','★','Guest Reviews'],['/admin/regions','🗺','Georgia Highlights'],['/admin/inquiries','✉','Customer Inquiries'],['/admin/tour-photos','▧','Tour Photos']];
export default function AdminSubLayout({active,title,subtitle,children,embedded=false,action=null}){
 return <div className={`${styles.root} adminSubRoot ${embedded ? `${styles.embedded} adminEmbedded` : ""}`}><div className={styles.frame}>
 
 {!embedded && <nav className={styles.nav} aria-label="Admin navigation">{links.map(([href,icon,label],i)=><Link key={i} href={href} className={`${styles.navLink} ${active===label?styles.active:''}`}>{icon} {label}</Link>)}</nav>}
 <div className={dashboard.content}><div className={dashboard.headingRow}><div><div className={dashboard.eyebrow}>WEBSITE MANAGEMENT</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>{children}</div></div></div>;
}

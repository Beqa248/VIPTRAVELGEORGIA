'use client';
import Link from 'next/link';
import styles from './subpages.module.css';
const links=[['/admin','🚙','Cars'],['/admin','▶','Videos'],['/admin','🏔','Recent Tours'],['/admin','★','Guest Reviews'],['/admin/inquiries','✉','Customer Inquiries'],['/admin/tour-photos','▧','Tour Photos']];
export default function AdminSubLayout({active,title,subtitle,children}){
 return <div className={`${styles.root} adminSubRoot`}><div className={styles.frame}>
 <div className={styles.header}><div className={styles.brand}><span className={styles.brandIcon}>▲</span><div><strong>VIPTravelGeorgia</strong><small>Content management</small></div></div><Link className={styles.back} href="/admin">← Dashboard</Link></div>
 <nav className={styles.nav} aria-label="Admin navigation">{links.map(([href,icon,label],i)=><Link key={i} href={href} className={`${styles.navLink} ${active===label?styles.active:''}`}>{icon} {label}</Link>)}</nav>
 <main className={styles.content}><p className={styles.eyebrow}>CONTENT MANAGEMENT</p><h1 className={styles.title}>{title}</h1><p className={styles.subtitle}>{subtitle}</p>{children}</main></div></div>;
}

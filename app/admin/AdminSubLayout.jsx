'use client';
import Link from 'next/link';
import styles from './subpages.module.css';
import dashboardStyles from './dashboard.module.css';
const links=[['/admin','🚙','Cars'],['/admin','▶','Videos'],['/admin','🏔','Recent Tours'],['/admin','★','Guest Reviews'],['/admin/regions','🗺','Regions'],['/admin/inquiries','✉','Customer Inquiries'],['/admin/tour-photos','▧','Tour Photos']];
export default function AdminSubLayout({active,title,subtitle,children,embedded=false}){
 return <div className={`${styles.root} adminSubRoot`} style={embedded ? {minHeight:0,background:"transparent"} : undefined}><div className={styles.frame}>
 
 {!embedded && <nav className={styles.nav} aria-label="Admin navigation">{links.map(([href,icon,label],i)=><Link key={i} href={href} className={`${styles.navLink} ${active===label?styles.active:''}`}>{icon} {label}</Link>)}</nav>}
 <main className={embedded ? dashboardStyles.content : styles.content}>
 {embedded ? (
   <div className={dashboardStyles.headingRow}>
     <div>
       <div className={dashboardStyles.eyebrow}>WEBSITE MANAGEMENT</div>
       <h1>{active}</h1>
       <p>Manage content, photographs and visibility from one place.</p>
     </div>
   </div>
 ) : (
   <><p className={styles.eyebrow}>CONTENT MANAGEMENT</p><h1 className={styles.title}>{title}</h1><p className={styles.subtitle}>{subtitle}</p></>
 )}
 {children}
 </main></div></div>;
}

import {headers} from 'next/headers';
import {getLocale} from '../../lib/seo';
import Page from '../../components/pages/recent-tours';
export const dynamic='force-dynamic';
export default async function RecentTours(){const h=await headers();return <Page lang={getLocale(h.get('x-vtg-locale'))}/>;}

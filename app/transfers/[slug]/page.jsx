import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import TransferPage from '../../../components/TransferPage';
import {getTransfers,getTransferVehicles,getTransferCover} from '../../../lib/transfers';
import {transferSlug,tripName} from '../../../lib/transferPricing';
import {transferLabels} from '../../../lib/transferLabels';
import {localizedMetadata,getLocale} from '../../../lib/seo';
export const dynamic='force-dynamic';
function match(routes,slug){for(const r of routes)for(const d of ['from','to'])if((d==='from'?r.allow_from:r.allow_to)&&transferSlug(r,d)===slug)return {r,d};return null;}
export async function generateMetadata({params}){const {slug}=await params,h=await headers(),lang=getLocale(h.get('x-vtg-locale')),found=match(await getTransfers(),slug);if(!found)return {robots:{index:false,follow:false}};const title=tripName(found.r,found.d,lang);return localizedMetadata('/transfers/'+slug,title,`${title} — ${transferLabels[lang][0]}. VIPToursGeorgia`,found.r.cover_url,lang);}
export default async function Page({params}){const {slug}=await params;const [routes,vehicles,cover]=await Promise.all([getTransfers(),getTransferVehicles(),getTransferCover()]);const found=match(routes,slug);if(!found)notFound();return <TransferPage routes={routes} vehicles={vehicles} cover={cover} initialSlug={found.r.slug} initialDirection={found.d}/>;}

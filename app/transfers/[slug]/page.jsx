import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import TransferPage from '../../../components/TransferPage';
import {getTransfers,getTransferVehicles,getTransferCover} from '../../../lib/transfers';
import {transferSlug,tripName} from '../../../lib/transferPricing';
import {transferMeta,transferSchema} from '../../../lib/transferSeo';
import {getLocale} from '../../../lib/seo';
export const dynamic='force-dynamic';
function match(routes,slug){for(const r of routes)for(const d of ['from','to'])if((d==='from'?r.allow_from:r.allow_to)&&transferSlug(r,d)===slug)return {r,d};return null;}
export async function generateMetadata({params}){const {slug}=await params,h=await headers(),lang=getLocale(h.get('x-vtg-locale')),found=match(await getTransfers(),slug);if(!found)return {robots:{index:false,follow:false}};return transferMeta(lang,found.r,found.d);}
export default async function Page({params}){const {slug}=await params;const [routes,vehicles,cover]=await Promise.all([getTransfers(),getTransferVehicles(),getTransferCover()]);const found=match(routes,slug);if(!found)notFound();const lang=getLocale((await headers()).get("x-vtg-locale"));return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(transferSchema(lang,found.r,found.d)).replace(/</g,"\\u003c")}}/><TransferPage routes={routes} vehicles={vehicles} cover={cover} initialSlug={found.r.slug} initialDirection={found.d}/></>;}

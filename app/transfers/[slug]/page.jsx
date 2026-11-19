import {transferContent} from "../../../lib/transferContent";
import {localizedPath} from "../../../lib/localizedPath";
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
export default async function Page({params}){const {slug}=await params;const [routes,vehicles,cover]=await Promise.all([getTransfers(),getTransferVehicles(),getTransferCover()]);const found=match(routes,slug);if(!found)notFound();const lang=getLocale((await headers()).get("x-vtg-locale"));const info=transferContent(found.r,found.d,lang),l=info.labels,reverse=found.d==="from"?"to":"from";return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(transferSchema(lang,found.r,found.d)).replace(/</g,"\\u003c")}}/><TransferPage routes={routes} vehicles={vehicles} cover={cover} initialSlug={found.r.slug} initialDirection={found.d}/><section style={{maxWidth:1000,margin:"24px auto",padding:"0 20px 24px"}}><h2>{l[0]} — {info.title}</h2><h3>{l[1]}</h3><p>{info.note}</p><h3>{l[2]}</h3><p>{l[3]}</p><nav style={{display:"flex",gap:16,flexWrap:"wrap"}}>{(reverse==="from"?found.r.allow_from:found.r.allow_to)&&<a href={localizedPath(lang,"/transfers/"+transferSlug(found.r,reverse))}>{l[6]}</a>}<a href={localizedPath(lang,"/tours")}>{l[4]}</a><a href={localizedPath(lang,"/travel")}>{l[5]}</a></nav></section></>;}

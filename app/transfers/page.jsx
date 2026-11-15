import {headers} from 'next/headers';
import {getLocale} from '../../lib/seo';
import {transferMeta,transferSchema} from '../../lib/transferSeo';
import TransferPage from '../../components/TransferPage';
import {getTransfers,getTransferVehicles,getTransferCover} from '../../lib/transfers';
export const dynamic='force-dynamic';
export async function generateMetadata(){return transferMeta(getLocale((await headers()).get("x-vtg-locale")));}
export default async function Page(){const lang=getLocale((await headers()).get("x-vtg-locale"));const [routes,vehicles,cover]=await Promise.all([getTransfers(),getTransferVehicles(),getTransferCover()]);return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(transferSchema(lang)).replace(/</g,"\\u003c")}}/><TransferPage routes={routes} vehicles={vehicles} cover={cover}/></>;}

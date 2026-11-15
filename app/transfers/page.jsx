import TransferPage from '../../components/TransferPage';
import {getTransfers,getTransferVehicles,getTransferCover} from '../../lib/transfers';
export const dynamic='force-dynamic';
export default async function Page(){const [routes,vehicles,cover]=await Promise.all([getTransfers(),getTransferVehicles(),getTransferCover()]);return <TransferPage routes={routes} vehicles={vehicles} cover={cover}/>;}

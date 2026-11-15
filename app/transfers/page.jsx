import TransferPage from '../../components/TransferPage';
import {getTransfers,getTransferVehicles} from '../../lib/transfers';
export const dynamic='force-dynamic';
export default async function Page(){const [routes,vehicles]=await Promise.all([getTransfers(),getTransferVehicles()]);return <TransferPage routes={routes} vehicles={vehicles}/>;}

import {getPublicDb} from './publicContent';
export async function getTransfers(){const db=getPublicDb();if(!db)return [];const {data,error}=await db.from('transfer_routes').select('*').eq('published',true).order('slug');if(error){console.error('Transfer routes:',error.message);return [];}return data||[];}
export async function getTransferVehicles(){const db=getPublicDb();if(!db)return [];const {data}=await db.from('vehicles').select('*').eq('published',true);return data||[];}

export async function getTransferCover(){const db=getPublicDb();if(!db)return '';const {data}=await db.from('travel_regions').select('slug,title,image_url').eq('published',true).eq('archived',false);const rows=data||[];return rows.find(r=>/batumi/i.test(r.slug||r.title))?.image_url||'';}

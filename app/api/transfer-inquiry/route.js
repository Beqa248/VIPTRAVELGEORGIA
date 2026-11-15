import { deliverInquiry } from '../../../lib/inquiryDelivery';
export const runtime='nodejs';
const clean=(v,n=4000)=>typeof v==='string'?v.trim().slice(0,n):'';
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export async function POST(req){
 try{
 const b=await req.json(),name=clean(b.name,100),email=clean(b.email,180),phone=clean(b.phone,100),tour=clean(b.tour,200),vehicle=clean(b.vehicle,100),message=clean(b.message),date=clean(b.date,10),back=clean(b.back,10),travelers=Number(b.people);
 if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!phone||!tour||!message||!validDate(date)||(back&&(!validDate(back)||back<date))||!Number.isInteger(travelers)||travelers<1||travelers>40||b.consent!==true)return Response.json({error:'Please check all required fields and consent.'},{status:400});
 return await deliverInquiry({name,email,phone,destinations:[tour],vehicle,start_date:date,end_date:back||null,travelers,interests:message,language:['en','ru','he'].includes(b.lang)?b.lang:'en',consent:true,source:'transfer',status:'new'});
 }catch{return Response.json({error:'Unable to process request.'},{status:400});}
}

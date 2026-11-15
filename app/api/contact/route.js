import {clean,validEmail,validDate,language,deliverInquiry} from '../../../lib/inquiryDelivery';
export const runtime='nodejs';
export async function POST(request){
 try {
  const b=await request.json();
  if(clean(b.website))return Response.json({ok:true,saved:true});
  const name=clean(b.name,100),email=clean(b.email,180),vehicle=clean(b.vehicle,100);
  if(name.length<2||!validEmail(email)||b.consent!==true)return Response.json({error:'Please enter your name, valid email and consent.'},{status:400});
  const row={name,email,vehicle,language:language(b.lang),consent:true,status:'new',source:'tour-builder'};
  if(b.custom===true){
   const start=clean(b.start_date,10),end=clean(b.end_date,10),travelers=Number(b.travelers);
   const destinations=Array.isArray(b.destinations)?b.destinations.slice(0,30).map(v=>clean(v,100)).filter(Boolean):[];
   if(!validDate(start)||(end&&(!validDate(end)||end<start))||!Number.isInteger(travelers)||travelers<1||travelers>40||!destinations.length)return Response.json({error:'Please check dates, destinations and travelers.'},{status:400});
   Object.assign(row,{phone:clean(b.phone,100),start_date:start,end_date:end||null,travelers,destinations,budget:clean(b.budget,100),interests:clean(b.interests)});
  } else {
   const tour=clean(b.tour,200),message=clean(b.message);
   if(!tour||!message)return Response.json({error:'Please choose a service and enter a message.'},{status:400});
   Object.assign(row,{destinations:[tour],interests:`Dates/group: ${clean(b.dates,180)}\n${message}`});
  }
  return await deliverInquiry(row);
 } catch {return Response.json({error:'Unable to process request.'},{status:400});}
}

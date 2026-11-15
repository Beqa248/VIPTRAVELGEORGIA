import { createClient } from '@supabase/supabase-js';
export const runtime='nodejs';
const clean=(v,n=4000)=>typeof v==='string'?v.trim().slice(0,n):'';
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export async function POST(req){
 try{
 const b=await req.json(),name=clean(b.name,100),email=clean(b.email,180),phone=clean(b.phone,100),tour=clean(b.tour,200),vehicle=clean(b.vehicle,100),message=clean(b.message),date=clean(b.date,10),back=clean(b.back,10),travelers=Number(b.people);
 if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!phone||!tour||!message||!validDate(date)||(back&&(!validDate(back)||back<date))||!Number.isInteger(travelers)||travelers<1||travelers>40||b.consent!==true)return Response.json({error:'Please check all required fields and consent.'},{status:400});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return Response.json({error:'Booking storage is not configured. Please contact us directly.'},{status:503});
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await db.from('inquiries').insert({name,email,phone,destinations:[tour],vehicle,start_date:date,end_date:back||null,travelers,interests:message,language:['en','ru','he'].includes(b.lang)?b.lang:'en',consent:true,source:'transfer',status:'new'});
 if(error){console.error('Transfer inquiry storage failed:',error.code);return Response.json({error:'Unable to save booking. Please contact us directly.'},{status:503});}
 let notified=false;
 try{if(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM_EMAIL){const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:['SubTravelGeorgia@gmail.com'],reply_to:email,subject:'VIPToursGeorgia — New transfer request',text:message}),signal:AbortSignal.timeout(5000)});notified=r.ok;}}catch{console.error('Transfer notification failed');}
 return Response.json({saved:true,notified});
 }catch{return Response.json({error:'Unable to process request.'},{status:400});}
}

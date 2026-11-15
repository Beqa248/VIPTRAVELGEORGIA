import { createClient } from '@supabase/supabase-js';

export const clean = (v, n = 4000) => typeof v === 'string' ? v.trim().slice(0,n) : '';
export const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const validDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
export const language = v => ['en','ru','he'].includes(v) ? v : 'en';
async function sendEmail(payload) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {method:'POST', headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,...payload}), signal:AbortSignal.timeout(5000),cache:'no-store'});
    if (!r.ok) console.error('Resend rejected inquiry email:',r.status);
    return r.ok;
  } catch { console.error('Inquiry email network failure'); return false; }
}
export async function deliverInquiry(row) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({error:'Booking storage is not configured. Please contact us directly.'},{status:503});
  try {
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {error}=await db.from('inquiries').insert(row);
    if(error){console.error('Inquiry storage failed:',error.code);return Response.json({error:'Unable to save your inquiry. Please contact us directly.'},{status:503});}
  } catch {return Response.json({error:'Unable to confirm storage. Please contact us before retrying.'},{status:503});}
  const recipient=process.env.CONTACT_TO_EMAIL || 'SubTravelGeorgia@gmail.com';
  const text=Object.entries(row).filter(([k])=>!['consent','status'].includes(k)).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v??''}`).join('\n');
  const [notified,confirmed]=await Promise.all([
    sendEmail({to:[recipient],reply_to:row.email,subject:'VIPToursGeorgia — New website inquiry',text}),
    sendEmail({to:[row.email],reply_to:recipient,subject:'VIPToursGeorgia — Request received',text:'Thank you for your inquiry. We have received your request and will contact you to confirm availability and pricing. This is not a confirmed reservation. No payment is required at this stage.'})
  ]);
  return Response.json({ok:true,saved:true,notified,confirmed});
}

import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { texts, target } = await request.json();
    if (!Array.isArray(texts) || texts.length > 40 || !["en", "ru", "ka", "he"].includes(target) || texts.some(t => typeof t !== "string" || t.length > 4000)) return NextResponse.json({error:"Invalid translation request"},{status:400});
    if (target === "en") return NextResponse.json({translations:texts});
    const key=process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!key) return NextResponse.json({translations:texts,configured:false});
    const response=await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({q:texts,source:"en",target,format:"text"}),cache:"no-store"});
    if(!response.ok){console.error("Translation provider error:",response.status);return NextResponse.json({translations:texts,configured:false});}
    const result=await response.json();
    return NextResponse.json({translations:result.data.translations.map(x=>x.translatedText),configured:true});
  } catch(e){return NextResponse.json({error:"Translation unavailable"},{status:500});}
}

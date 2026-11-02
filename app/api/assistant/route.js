// @ts-nocheck
import { NextResponse } from 'next/server';
export async function POST(req) { let d; try {
    d = await req.json();
}
catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} if (!['en', 'ru', 'he'].includes(d.language) || typeof d.question !== 'string' || d.question.length < 1 || d.question.length > 700)
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 }); const fallback = { en: 'I can help you request a private tour in Georgia. Please share your travel dates, number of travelers, pickup city, destinations and preferences. Our team will confirm prices and availability.', ru: 'Я помогу оформить запрос на индивидуальный тур по Грузии. Укажите даты, количество путешественников, город отправления и интересующие места. Цены и наличие подтвердит наша команда.', he: 'אשמח לעזור בתכנון טיול פרטי בגאורגיה. שלחו תאריכים, מספר מטיילים, עיר איסוף ויעדים. הצוות יאשר מחיר וזמינות.' }; if (!process.env.OPENAI_API_KEY)
    return NextResponse.json({ answer: fallback[d.language], mode: 'fallback' }); try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are VIP Travel Georgia multilingual assistant. Reply in requested language. Provide general Georgia travel advice and gather lead details (dates, people, pickup, destinations). Do not invent actual prices, company fleet details, confirmed availability, or payment links. Refer to /custom-tour for quotes and /booking for deposit estimates. Be brief.' }, { role: 'user', content: `Language ${d.language}. Question: ${d.question}` }], max_tokens: 320 }) });
    if (!r.ok)
        throw Error('unavailable');
    let j = await r.json();
    return NextResponse.json({ answer: j.choices?.[0]?.message?.content || fallback[d.language], mode: 'ai' });
}
catch {
    return NextResponse.json({ answer: fallback[d.language], mode: 'fallback' });
} }

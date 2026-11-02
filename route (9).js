// @ts-nocheck
import { NextResponse } from 'next/server';
const options = { Tbilisi: ['Tbilisi old town', 'Mtskheta', 'Kazbegi', 'Kakheti', 'Borjomi', 'Uplistsikhe', 'Kutaisi'], Batumi: ['Batumi city', 'Botanical Garden', 'Gomismta (weather permitting)', 'Mtirala National Park', 'Martvili', 'Kutaisi'], Kutaisi: ['Kutaisi', 'Prometheus Cave', 'Martvili', 'Okatse', 'Borjomi', 'Tbilisi'] };
const translations = { en: ['Your Georgia adventure', 'A draft route based on your interests. Your guide must confirm driving times, prices and seasonal access.', 'Explore'], ru: ['Ваше путешествие по Грузии', 'Предварительный маршрут. Гид подтвердит время в пути, цены и сезонную доступность.', 'Посетите'], he: ['הטיול שלכם בגאורגיה', 'מסלול מוצע בלבד. המדריך יאשר זמני נסיעה, מחירים ונגישות עונתית.', 'בקרו ב'] };
export async function POST(req) { let data; try {
    data = await req.json();
}
catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} let n = Number(data.days); if (!Number.isInteger(n) || n < 1 || n > 14 || !options[data.start] || !translations[data.language] || String(data.interests || '').length > 500)
    return NextResponse.json({ error: 'Invalid trip details' }, { status: 400 }); const [title, summary, visit] = translations[data.language]; const destinations = options[data.start]; const fallback = { title, summary, days: Array.from({ length: n }, (_, i) => ({ title: destinations[i % destinations.length], description: `${visit} ${destinations[i % destinations.length]}. Confirm road conditions, travel time and itinerary with your guide.` })) }; const key = process.env.OPENAI_API_KEY; if (!key)
    return NextResponse.json({ ...fallback, mode: 'suggested' }); try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.5, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'You are a cautious Georgia tour itinerary assistant. Output only JSON {title:string,summary:string,days:[{title:string,description:string}]}. Do not invent prices, driving times, confirmed availability or open roads. Respect geography and day count. No unsafe remote mountain trips without seasonal caution.' }, { role: 'user', content: JSON.stringify({ days: n, start: data.start, interests: String(data.interests || ''), budget: String(data.budget || '').slice(0, 80), language: data.language }) }] }) });
    if (!r.ok)
        throw Error('AI unavailable');
    const json = await r.json();
    const parsed = JSON.parse(json.choices[0].message.content);
    if (!Array.isArray(parsed.days) || parsed.days.length !== n)
        throw Error('Invalid AI output');
    return NextResponse.json({ ...parsed, mode: 'ai' });
}
catch {
    return NextResponse.json({ ...fallback, mode: 'suggested' });
} }

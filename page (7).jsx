// @ts-nocheck
'use client';
import { useState } from 'react';
import { Shell, card, field, button } from '../../lib/ui';
export default function Planner() {
    const [language, setLanguage] = useState('en'), [days, setDays] = useState(5), [start, setStart] = useState('Tbilisi'), [interests, setInterests] = useState('mountains, nature, culture'), [budget, setBudget] = useState(''), [result, setResult] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(false);
    async function generate(e) { e.preventDefault(); setLoading(true); setError(''); try {
        let r = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, days: Number(days), start, interests, budget }) });
        let data = await r.json();
        if (!r.ok)
            throw Error(data.error || 'Could not generate itinerary');
        setResult(data);
    }
    catch (e) {
        setError(e.message);
    }
    finally {
        setLoading(false);
    } }
    return <Shell title="AI Georgia itinerary planner" lang={language}><p>Build a suggested itinerary, then ask us to check real travel times, road conditions and availability. This is a draft, not a confirmed booking.</p><form onSubmit={generate} style={card}><label>Language<select style={field} value={language} onChange={e => setLanguage(e.target.value)}><option value="en">English</option><option value="ru">Русский</option><option value="he">עברית</option></select></label><label>Days<input style={field} type="number" min="1" max="14" value={days} onChange={e => setDays(e.target.value)}/></label><label>Starting city<select style={field} value={start} onChange={e => setStart(e.target.value)}><option>Tbilisi</option><option>Batumi</option><option>Kutaisi</option></select></label><label>Interests<textarea style={field} value={interests} onChange={e => setInterests(e.target.value)}/></label><label>Approximate budget (optional)<input style={field} value={budget} onChange={e => setBudget(e.target.value)}/></label><button disabled={loading} style={button}>{loading ? 'Planning…' : 'Create itinerary'}</button></form>{error && <p role="alert">{error}</p>}{result && <section style={card}><h2>{result.title}</h2><p>{result.summary}</p>{result.days?.map((d, i) => <div key={i} style={{ padding: 12, borderBottom: '1px solid #eee' }}><h3>Day {i + 1}: {d.title}</h3><p>{d.description}</p></div>)}<p style={{ fontSize: 13 }}>AI suggestions require human confirmation. No live road or hotel availability has been checked.</p><button style={button} onClick={() => window.print()}>Print / save PDF</button> <a href="/custom-tour">Request this trip</a></section>}</Shell>;
}

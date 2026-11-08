// @ts-nocheck
'use client';
import { useState } from 'react';
import { Shell, card, field, button } from '../../lib/ui';
export default function Assistant() { const [messages, setMessages] = useState([]), [question, setQuestion] = useState(''), [busy, setBusy] = useState(false), [lang, setLang] = useState('en'); async function send(e) { e.preventDefault(); if (!question.trim())
    return; let q = question; setQuestion(''); setMessages(s => [...s, { role: 'user', text: q }]); setBusy(true); try {
    let r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, language: lang }) });
    let j = await r.json();
    setMessages(s => [...s, { role: 'assistant', text: j.answer || 'Please contact us for details.' }]);
}
catch {
    setMessages(s => [...s, { role: 'assistant', text: 'Please contact us via WhatsApp.' }]);
}
finally {
    setBusy(false);
} } return <Shell title="VIP Georgia Assistant" lang={lang}><p>Ask about tours, transport, luggage, and bookings. Prices and dates are confirmed by our team.</p><select style={field} value={lang} onChange={e => setLang(e.target.value)}><option value="en">English</option><option value="ru">Русский</option><option value="he">עברית</option></select><div style={{ ...card, minHeight: 64, padding: 14 }}>{messages.length === 0 ? <p>How can we help you explore Georgia?</p> : messages.map((m, i) => <p key={i} style={{ padding: 12, borderRadius: 9, background: m.role === 'user' ? '#f7eee0' : '#e8f3f0', whiteSpace: 'pre-wrap' }}><b>{m.role === 'user' ? 'You' : 'Assistant'}:</b> {m.text}</p>)}{busy && <p>Typing…</p>}</div><form onSubmit={send} style={{ display: 'flex', flexDirection:'column', gap: 10, marginTop:12 }}><textarea style={{ ...field, margin: 0, minHeight: 145, resize:'vertical' }} maxLength={700} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question about tours, destinations, or prices..."/><div style={{display:'flex',justifyContent:'flex-end'}}><button style={button} disabled={busy}>Send</button></div></form><p><a href="/custom-tour">Request a personalized quote</a></p></Shell>; }

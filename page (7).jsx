// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Shell, card } from '../../../lib/ui';
export default function Inquiries() { const [session, setSession] = useState(null), [authorized, setAuthorized] = useState(false), [items, setItems] = useState([]), [message, setMessage] = useState(''); useEffect(() => { if (!supabase)
    return; supabase.auth.getSession().then(({ data }) => setSession(data.session)); const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s)); return () => subscription.unsubscribe(); }, []); useEffect(() => { if (!session)
    return; supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data }) => { setAuthorized(!!data); if (data)
    load(); }); }, [session]); async function load() { let { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }); if (error)
    setMessage(error.message);
else
    setItems(data || []); } async function change(id, status) { let { error } = await supabase.from('inquiries').update({ status }).eq('id', id); if (error)
    setMessage(error.message);
else
    load(); } return <Shell title="Admin — inquiries & bookings"><p><a href="/admin">← Content dashboard</a></p>{!supabase ? <p>Configure Supabase first.</p> : !session ? <p>Please sign in at <a href="/admin">/admin</a>.</p> : !authorized ? <p>Administrator authorization required.</p> : <><p>{items.length} requests</p>{message && <p role="alert">{message}</p>}{items.map(x => <article key={x.id} style={card}><h3>{x.name} — {x.status}</h3><p>{x.email} · {x.phone} · {x.travelers} travelers</p><p>{x.start_date || 'Date TBD'} → {x.end_date || 'TBD'} · {x.destinations?.join(', ')}</p><p>Budget: {x.budget || 'Not supplied'} · Vehicle: {x.vehicle || 'Not selected'}</p><p>{x.interests}</p><label>Booking status <select value={x.status} onChange={e => change(x.id, e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="deposit_pending">Deposit pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label> <a href={'mailto:' + encodeURIComponent(x.email)}>Email customer</a></article>)}</>}</Shell>; }

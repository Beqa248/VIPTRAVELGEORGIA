// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client = url && key ? createClient(url, key) : null;
const palette = { bg: '#fffaf1', teal: '#007f73', orange: '#f58200', ink: '#173e39' };
const style = { input: { padding: 11, border: '1px solid #d9c9b4', borderRadius: 8, width: '100%', boxSizing: 'border-box', margin: '5px 0 12px' }, btn: { background: palette.teal, color: 'white', border: 0, borderRadius: 8, padding: '11px 16px', cursor: 'pointer', marginRight: 8 }, card: { background: 'white', padding: 20, border: '1px solid #eadfcf', borderRadius: 12, marginBottom: 14 } };
export default function Admin() {
    const [session, setSession] = useState(null), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [tab, setTab] = useState('vehicles'), [rows, setRows] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false), [authorized, setAuthorized] = useState(false), [editing, setEditing] = useState(null);
    useEffect(() => { if (!client)
        return; client.auth.getSession().then(({ data }) => setSession(data.session)); let { data: { subscription } } = client.auth.onAuthStateChange((_event, s) => setSession(s)); return () => subscription.unsubscribe(); }, []);
    useEffect(() => { if (!client || !session) {
        setAuthorized(false);
        return;
    } client.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data, error }) => { setAuthorized(!!data && !error); if (!data)
        setError('This account has not been granted administrator access.'); }); }, [session]);
    async function refresh(which = tab) { if (!client)
        return; let { data, error } = await client.from(which).select('*').order('created_at', { ascending: false }); if (error)
        setError(error.message);
    else
        setRows(data || []); }
    useEffect(() => { if (authorized)
        refresh(tab); }, [tab, authorized]);
    async function login(e) { e.preventDefault(); setError(''); let { error } = await client.auth.signInWithPassword({ email, password }); if (error)
        setError(error.message); }
    async function upload(files) { let urls = []; for (let file of Array.from(files || [])) {
        if (!file.type.startsWith('image/') || file.size > 6 * 1024 * 1024)
            throw Error('Use JPG/PNG/WebP images smaller than 6 MB.');
        let name = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        let { error } = await client.storage.from('tour-media').upload(name, file, { upsert: false });
        if (error)
            throw error;
        urls.push(client.storage.from('tour-media').getPublicUrl(name).data.publicUrl);
    } return urls; }
    async function save(e) { e.preventDefault(); setBusy(true); setError(''); let f = new FormData(e.currentTarget); try {
        let payload = tab === 'vehicles' ? { name: f.get('name'), description: f.get('description'), passengers: Number(f.get('passengers') || 0), published: f.get('published') === 'on', images: [...(editing?.images || []), ...await upload(f.getAll('images').filter(x => x.size))] } : { title: f.get('title'), description: f.get('description'), published: f.get('published') === 'on', image_url: (await upload(f.getAll('images').filter(x => x.size)))[0] || editing?.image_url || '' };
        let query = editing ? client.from(tab).update(payload).eq('id', editing.id) : client.from(tab).insert(payload);
        let { error } = await query;
        if (error)
            throw error;
        setEditing(null);
        e.target.reset();
        await refresh();
    }
    catch (e) {
        setError(e.message);
    }
    finally {
        setBusy(false);
    } }
    async function action(id, changes) { setError(''); let { error } = await client.from(tab).update(changes).eq('id', id); if (error)
        setError(error.message);
    else
        refresh(); }
    async function remove(id) { if (!window.confirm('Delete this item?'))
        return; let { error } = await client.from(tab).delete().eq('id', id); if (error)
        setError(error.message);
    else
        refresh(); }
    const input = (name, label, defaultValue = '', type = 'text') => <label style={{ display: 'block' }}>{label}<input style={style.input} name={name} type={type} defaultValue={defaultValue} required={name === 'name' || name === 'title'}/></label>;
    return <main style={{ minHeight: '100vh', background: palette.bg, color: palette.ink, fontFamily: 'Arial,sans-serif' }}><header style={{ background: 'white', borderBottom: '3px solid #f58200', padding: '20px max(5%,20px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ fontSize: 22, color: '#f27600' }}>VIPTravelGeorgia <span style={{ color: palette.teal }}>Admin</span></strong><a href="/" style={{ color: palette.teal }}>View original website</a></header><div style={{ maxWidth: 1080, margin: '30px auto', padding: '0 18px' }}>{!client ? <div style={style.card}>Supabase is not configured. Follow SETUP.md before using the dashboard.</div> : !session ? <form onSubmit={login} style={{ ...style.card, maxWidth: 430, margin: '40px auto' }}><h2>Administrator sign in</h2>{input('email', 'Email', email, 'email')}{input('password', 'Password', '', 'password')}<button style={style.btn}>Sign in</button>{error && <p role="alert">{error}</p>}</form> : !authorized ? <div style={style.card}><h2>Access restricted</h2><p>{error || 'Checking administrator permissions…'}</p><button style={style.btn} onClick={() => client.auth.signOut()}>Sign out</button></div> : <><div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}><h1>Content management</h1><a href='/admin/inquiries' style={{ color: '#007f73', padding: 12 }}>View customer inquiries & bookings →</a><button style={style.btn} onClick={() => client.auth.signOut()}>Sign out</button></div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>{[['vehicles', 'Cars'], ['tour_photos', 'Tourist photos'], ['reviews', 'Guest reviews']].map(([id, label]) => <button key={id} style={{ ...style.btn, background: tab === id ? palette.orange : palette.teal }} onClick={() => { setTab(id); setEditing(null); setError(''); }}>{label}</button>)}</div>{error && <p role="alert" style={{ color: '#a52418' }}>{error}</p>}{tab !== 'reviews' && <form key={tab + '-' + (editing?.id || 'new')} onSubmit={save} style={style.card}><h2>{editing ? 'Edit' : 'Add'} {tab === 'vehicles' ? 'vehicle' : 'tour photo'}</h2>{tab === 'vehicles' ? <>{input('name', 'Vehicle name', editing?.name || '')}{input('passengers', 'Passengers', editing?.passengers || '', 'number')}</> : input('title', 'Photo title / destination', editing?.title || '')}<label>Description<textarea style={{ ...style.input, minHeight: 85 }} name="description" defaultValue={editing?.description || ''}/></label><label>Upload images <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple={tab === 'vehicles'} style={style.input}/></label><label><input type="checkbox" name="published" defaultChecked={editing?.published ?? true}/> Publish on website</label><div style={{ marginTop: 18 }}><button disabled={busy} style={style.btn}>{busy ? 'Saving…' : 'Save'}</button>{editing && <button type="button" style={style.btn} onClick={() => setEditing(null)}>Cancel edit</button>}</div></form>}<h2>{tab === 'reviews' ? 'Review moderation' : 'Existing content'}</h2>{rows.length === 0 && <p>No entries yet.</p>}{rows.map(row => <article key={row.id} style={style.card}><div style={{ display: 'flex', gap: 15, alignItems: 'flex-start', flexWrap: 'wrap' }}>{(row.image_url || row.images?.[0]) && <img src={row.image_url || row.images?.[0]} alt="Uploaded" style={{ width: 135, height: 95, objectFit: 'cover', borderRadius: 8 }}/>}<div style={{ flex: 1, minWidth: 200 }}><strong>{row.name || row.title}</strong>{tab === 'reviews' && <p>{'★'.repeat(row.rating)} · {row.country || 'Guest'} · {row.text}</p>}{row.description && <p>{row.description}</p>}<small>{tab === 'reviews' ? (row.approved ? 'Approved' : 'Pending') : (row.published ? 'Published' : 'Hidden')}</small></div></div><div style={{ marginTop: 15 }}>{tab === 'reviews' ? <><button style={style.btn} onClick={() => action(row.id, { approved: !row.approved })}>{row.approved ? 'Unapprove' : 'Approve'}</button></> : <><button style={style.btn} onClick={() => { setEditing(row); window.scrollTo(0, 0); }}>Edit</button><button style={style.btn} onClick={() => action(row.id, { published: !row.published })}>{row.published ? 'Hide' : 'Publish'}</button></>}<button style={{ ...style.btn, background: '#ad3428' }} onClick={() => remove(row.id)}>Delete</button></div></article>)}</>}</div></main>;
}

"use client";
import {useEffect,useState} from 'react';
import {supabase as client} from '../../lib/supabase';
const tabs=[['vehicles','Cars'],['videos','Videos'],['recent_tours','Recent Tours'],['reviews','Guest Reviews']];
const inputStyle={display:'block',width:'100%',boxSizing:'border-box',padding:11,border:'1px solid #d8cbb8',borderRadius:8,margin:'6px 0 14px'};
const btn={padding:'10px 16px',border:0,borderRadius:8,background:'#007f73',color:'white',cursor:'pointer',marginRight:8,marginBottom:8};
const card={background:'white',border:'1px solid #e5d8c6',borderRadius:12,padding:20,marginBottom:18};
const field=(label,name,value='',type='text',required=false)=><label style={{display:'block',fontWeight:600}}>{label}<input key={name+String(value)} style={inputStyle} type={type} name={name} defaultValue={value} required={required}/></label>;
export default function Admin(){
 const [session,setSession]=useState(null),[authorized,setAuthorized]=useState(false),[checking,setChecking]=useState(true),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[tab,setTab]=useState('vehicles'),[rows,setRows]=useState([]),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[removed,setRemoved]=useState([]);
 useEffect(()=>{if(!client){setChecking(false);return;}client.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=client.auth.onAuthStateChange((event, s) => {
  if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
    setSession(s);
  }
});return()=>subscription.unsubscribe()},[]);
 useEffect(()=>{let alive=true;setAuthorized(false);setChecking(true);if(!client||!session){setChecking(false);return;}client.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle().then(({data,error})=>{if(alive){setAuthorized(!!data&&!error);setChecking(false);if(error)setError(error.message);}});return()=>{alive=false}},[session]);
 
async function refresh(which = tab) {
  if (!client) return;

  let query = client.from(which).select("*");

  if (which === "vehicles") {
    query = query
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) setError(error.message);
  else setRows(data || []);
}

 

async function login(e) {
  e.preventDefault();
  setError("");

  if (!client) {
    setError("Supabase is not configured.");
    return;
  }

  const formData = new FormData(e.currentTarget);
  const loginEmail = String(formData.get("email") || "").trim();
  const loginPassword = String(formData.get("password") || "");

  if (!loginEmail || !loginPassword) {
    setError("Please enter your email and password.");
    return;
  }

  const { error } = await client.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword,
  });

  if (error) {
    setError(error.message);
  }
}
 async function upload(files,kind){const urls=[];for(const file of Array.from(files||[]).filter(f=>f.size)){const video=kind==='video';const allowed=video?['video/mp4','video/webm','video/quicktime']:['image/jpeg','image/png','image/webp'];const max=video?100*1024*1024:6*1024*1024;if(!allowed.includes(file.type)||file.size>max)throw Error(video?'Use MP4/WebM/MOV videos up to 100 MB.':'Use JPG/PNG/WebP images up to 6 MB.');const bucket=video?'tour-videos':'tour-media';const name=`${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'')}`;const {error}=await client.storage.from(bucket).upload(name,file,{upsert:false,contentType:file.type});if(error)throw error;urls.push(client.storage.from(bucket).getPublicUrl(name).data.publicUrl)}return urls}
 async function save(e){e.preventDefault();setBusy(true);setError('');setNotice('');const form=e.currentTarget;const f=new FormData(form);try{let payload;if(tab==='vehicles'){const newImages=await upload(f.getAll('images'),'image');payload={name:String(f.get('name')).trim(),description:String(f.get('description')||''),passengers:Number(f.get('passengers')||0),published:f.get('published')==='on',images:[...(editing?.images||[]).filter(u=>!removed.includes(u)),...newImages]};}else if(tab==='videos'){const video=(await upload(f.getAll('video'),'video'))[0]||editing?.video_url;const cover=(await upload(f.getAll('cover'),'image'))[0]||editing?.cover_url||null;if(!video)throw Error('Select a video file.');payload={title:String(f.get('title')).trim(),description:String(f.get('description')||''),video_url:video,cover_url:cover,published:f.get('published')==='on'};}else{const images=await upload(f.getAll('images'),'image');payload={title:String(f.get('title')).trim(),description:String(f.get('description')||''),tour_date:f.get('tour_date')||null,images:[...(editing?.images||[]).filter(u=>!removed.includes(u)),...images],published:f.get('published')==='on'};if(!payload.images.length)throw Error('Add at least one tour photograph.');}
                                                                                                                                              if (tab === "vehicles" && !editing) {
  payload.sort_order =
    Math.max(0, ...rows.map(car => car.sort_order ?? 0)) + 1;
}const {error}=editing?.id?await client.from(tab).update(payload).eq('id',editing.id):await client.from(tab).insert(payload);if(error)throw error;setEditing(null);setRemoved([]);form.reset();setNotice('Saved successfully. Published changes appear on the public site after refresh.');await refresh()}catch(e){setError(e.message)}finally{setBusy(false)}}
 async function change(id,payload){setError('');const {error}=await client.from(tab).update(payload).eq('id',id);if(error)setError(error.message);else refresh()}
 async function remove(id){if(!window.confirm('Delete this record?'))return;const {error}=await client.from(tab).delete().eq('id',id);if(error)setError(error.message);else refresh()}
 
async function moveVehicle(id, direction) {
  if (busy || tab !== "vehicles") return;

  const index = rows.findIndex((car) => car.id === id);
  const target = index + direction;

  if (index < 0 || target < 0 || target >= rows.length) return;

  const current = rows[index];
  const other = rows[target];

  setBusy(true);
  setError("");

  try {
    const first = await client
      .from("vehicles")
      .update({ sort_order: other.sort_order })
      .eq("id", current.id);

    if (first.error) throw first.error;

    const second = await client
      .from("vehicles")
      .update({ sort_order: current.sort_order })
      .eq("id", other.id);

    if (second.error) throw second.error;

    await refresh("vehicles");
  } catch (err) {
    setError(err.message || "Could not change vehicle order.");
    await refresh("vehicles");
  } finally {
    setBusy(false);
  }
}

 return <div style={{minHeight:'100vh',background:'#fffaf1',padding:'30px max(4%,18px)',color:'#173e39',fontFamily:'Arial,sans-serif'}}><div style={{maxWidth:1080,margin:'auto'}}><h1 style={{color:'#007f73'}}>VIPTravelGeorgia Admin</h1><p><a href="/">View website</a></p>{!client?<p>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.</p>:!session?<form onSubmit={login} style={{...card,maxWidth:440}}><h2>Administrator sign in</h2>{field('Email','email',email,'email',true)}{field('Password','password','','password',true)}<button style={btn}>Sign in</button>{error&&<p role="alert">{error}</p>}</form>:checking?<p>Checking administrator permissions…</p>:!authorized?<div><p>Access restricted. Add your authenticated user ID to admin_users.</p><button style={btn} onClick={()=>client.auth.signOut()}>Sign out</button></div>:<><button style={btn} onClick={()=>client.auth.signOut()}>Sign out</button><a href="/admin/inquiries">Customer inquiries</a> <a href="/admin/tour-photos" style={{marginLeft:18}}>Tour Photos</a><nav style={{display:'flex',flexWrap:'wrap',gap:8,margin:'20px 0'}}>{tabs.map(([id,label])=><button key={id} style={{...btn,background:tab===id?'#f58200':'#007f73'}} onClick={()=>{setTab(id);setEditing(null);setRemoved([]);setError('');setNotice('')}}>{label}</button>)}</nav>{error&&<p role="alert" style={{color:'#a52418'}}>{error}</p>}{notice&&<p role="status" style={{color:'#007f73'}}>{notice}</p>}{tab!=='reviews'&&<form key={tab+'-'+(editing?.id||'new')} onSubmit={save} style={card}><h2>{editing?'Edit':'Add'} {tab==='vehicles'?'car':tab==='videos'?'video':'recent tour'}</h2>{tab==='vehicles'?<>{field('Vehicle name','name',editing?.name||'', 'text',true)}{field('Passengers','passengers',editing?.passengers||0,'number')}</>:field('Title','title',editing?.title||'','text',true)}<label>Description<textarea name="description" style={{...inputStyle,minHeight:85}} defaultValue={editing?.description||''}/></label>{tab==='recent_tours'&&field('Tour date','tour_date',editing?.tour_date||'','date')}{tab==='videos'?<><label>Upload video (MP4, WebM or MOV, up to 100 MB)<input style={inputStyle} name="video" type="file" accept="video/mp4,video/webm,video/quicktime" required={!editing}/></label><label>Optional cover photo<input style={inputStyle} name="cover" type="file" accept="image/jpeg,image/png,image/webp"/></label>{editing?.video_url&&<video src={editing.video_url} controls style={{width:260,maxWidth:'100%'}}/>}</>:<><label>Add photographs<input style={inputStyle} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple/></label>{editing?.images?.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:15}}>{editing.images.map((url,i)=><label key={url+i} style={{display:'block'}}><img src={url} alt="Vehicle or tour" style={{width:110,height:80,objectFit:'cover',display:'block'}}/><input type="checkbox" checked={removed.includes(url)} onChange={e=>setRemoved(v=>e.target.checked?[...v,url]:v.filter(x=>x!==url))}/> Remove</label>)}</div>}</>}<label><input type="checkbox" name="published" defaultChecked={editing?.published??true}/> Published</label><div style={{marginTop:20}}><button style={btn} disabled={busy}>{busy?'Uploading / saving…':'Save'}</button>{editing&&<button style={btn} type="button" onClick={()=>{setEditing(null);setRemoved([])}}>Cancel</button>}</div></form>}<h2>{tab==='reviews'?'Review moderation':'Existing content'}</h2>{rows.length===0&&<p>No records yet.</p>}{rows.map((row, index)=><article key={row.id} style={card}>{(row.images?.[0]||row.cover_url)&&<img src={row.images?.[0]||row.cover_url} alt="Cover" style={{width:160,height:110,objectFit:'cover',borderRadius:8,float:'right'}}/>}<h3>{row.name||row.title}</h3>{tab==='reviews'&&<p>{'★'.repeat(row.rating)} · {row.country} · {row.text}</p>}{row.description&&<p>{row.description}</p>}<p><small>{tab==='reviews'?(row.approved?'Approved':'Pending'):(row.published?'Published':'Hidden')}</small></p>{tab==='reviews'?<button style={btn} onClick={()=>change(row.id,{approved:!row.approved})}>{row.approved?'Unapprove':'Approve'}</button>:<><button style={btn} onClick={()=>{setEditing(row);setRemoved([]);window.scrollTo({top:0,behavior:'smooth'})}}>Edit / Photos</button><button style={btn} onClick={()=>change(row.id,{published:!row.published})}>{row.published?'Hide':'Publish'}</button></>}
  
{tab === "vehicles" && (
  <>
    <button
      type="button"
      style={btn}
      disabled={busy || index === 0}
      onClick={() => moveVehicle(row.id, -1)}
    >
      ↑ Move Up
    </button>

    <button
      type="button"
      style={btn}
      disabled={busy || index === rows.length - 1}
      onClick={() => moveVehicle(row.id, 1)}
    >
      ↓ Move Down
    </button>
  </>
)}
<button style={{...btn,background:'#b63a30'}} onClick={()=>remove(row.id)}>Delete</button><div style={{clear:'both'}}/></article>)}</>}</div></div>
}

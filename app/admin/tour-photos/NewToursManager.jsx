"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import css from "./newTours.module.css";
const empty = {archived:false,title:"",slug:"",description:"",duration_days:1,category:"mountains",itinerary:"",published:false,cover_url:"",gallery_images:[],sort_order:100,price_mode:"hidden",price_amount:"",price_currency:"USD",price_unit:"car"};
const categories=["mountains","waterfalls","culture","winter","coast","lakes","transfers","other"];
function makeSlug(s){return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,75)}
export default function NewToursManager({archivedOnly=false}){
 const [translationBusy,setTranslationBusy]=useState(false);
 const [tours,setTours]=useState([]),[draft,setDraft]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[cover,setCover]=useState(null),[gallery,setGallery]=useState([]),[removed,setRemoved]=useState([]),[query,setQuery]=useState("");
 async function load(){const {data,error}=await supabase.from("custom_tours").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:true});if(error)setError(error.message);else setTours(data||[])}
 useEffect(()=>{load()},[]);
 function start(t){
  setDraft(t?{...t}:{...empty});
  if(t) supabase.from("tour_prices").select("price_mode,price_amount,price_currency,price_unit").eq("slug",t.slug).maybeSingle().then(({data})=>{if(data)setDraft(d=>d?.slug===t.slug?{...d,...data}:d)});setCover(null);setGallery([]);setRemoved([]);setError("");setNotice("")}
 function set(k,v){setDraft(d=>({...d,[k]:v}))}
 async function upload(files,slug){let out=[];for(const file of files){if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>6*1024*1024)throw Error("Images must be JPG, PNG or WebP, up to 6 MB each.");const path=`custom-tours/${slug}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"")}`;const {error}=await supabase.storage.from("tour-media").upload(path,file,{contentType:file.type});if(error)throw error;out.push(supabase.storage.from("tour-media").getPublicUrl(path).data.publicUrl)}return out}
 async function generateTranslations(){
  if(!draft?.title?.trim() || !draft?.description?.trim()){setError("Enter the tour name and description first.");return;}
  setTranslationBusy(true);setError("");setNotice("");
  try {
   const next={...(draft.translations||{})};
   for(const lang of ["ka","ru","he"]){
    const response=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target:lang,texts:[draft.title,draft.description,draft.itinerary||""]})});
    const payload=await response.json();
    if(!response.ok||!payload.translations)throw Error(`${lang}: ${payload.error||"Translation failed"}`);
    next[lang]={title:payload.translations[0],description:payload.translations[1],itinerary:payload.translations[2]};
   }
   setDraft(d=>({...d,translations:next}));setNotice("Translations generated. Review them below, then save the tour.");
  }catch(e){setError(e.message||"Translation failed. Please try later.");}
  finally{setTranslationBusy(false)}
 }
 async function save(e){e.preventDefault();setError("");setNotice("");setBusy(true);try{const slug=makeSlug(draft.slug||draft.title);if(!slug||!draft.title.trim())throw Error("Enter a tour name and a valid URL slug.");if(draft.price_mode==="starting"&&(!Number.isFinite(Number(draft.price_amount))||Number(draft.price_amount)<=0))throw Error("Enter a starting price greater than zero.");const newCover=cover?(await upload([cover],slug))[0]:null;const newPhotos=await upload(gallery,slug);const payload={title:draft.title.trim(),slug,description:draft.description.trim(),duration_days:Number(draft.duration_days)||1,category:draft.category,itinerary:draft.itinerary,published:!!draft.published,cover_url:newCover||draft.cover_url||null,archived:!!draft.archived,gallery_images:[...(draft.gallery_images||[]).filter(x=>!removed.includes(x)),...newPhotos],sort_order:Number(draft.sort_order)||100,translations:draft.translations||{},price_mode:draft.price_mode||"hidden",price_amount:draft.price_mode==="starting"?Number(draft.price_amount):null,price_currency:draft.price_currency||"USD",price_unit:draft.price_unit||"car"};let result;if(draft.id){result=await supabase.from("custom_tours").update(payload).eq("id",draft.id)}else{result=await supabase.from("custom_tours").insert(payload)}if(result.error)throw result.error;
const {error:priceError}=await supabase.from("tour_prices").upsert({slug,price_mode:draft.price_mode||"hidden",price_amount:draft.price_mode==="starting"?Number(draft.price_amount):null,price_currency:draft.price_currency||"USD",price_unit:draft.price_unit||"car"},{onConflict:"slug"});
if(priceError)throw priceError;await load();setDraft(null);setNotice("Tour saved successfully. Published tours appear on the Tours page.")}catch(e){setError(e.message||"Could not save tour.")}finally{setBusy(false)}}
 async function del(t){if(t.is_original){setError("Original tours cannot be permanently deleted; use Hide to remove them from the website.");return;}if(!window.confirm(`Permanently delete ${t.title}?`))return;setBusy(true);setError("");const {error}=await supabase.from("custom_tours").delete().eq("id",t.id);if(error)setError(error.message);else{await load();setNotice("Tour deleted.")}setBusy(false)}
 async function archive(t,restore=false){
  if(!window.confirm(`${restore?'Restore':'Archive'} ${t.title}?`))return;
  setBusy(true);setError('');
  const {error}=await supabase.from('custom_tours').update({archived:!restore,published:false}).eq('id',t.id);
  if(error)setError(error.message);else{await load();setNotice(restore?'Tour restored as a draft. Publish it when ready.':'Tour archived and hidden from the public website.');}
  setBusy(false);
 }
 async function toggle(t){setBusy(true);const {error}=await supabase.from("custom_tours").update({published:!t.published}).eq("id",t.id);if(error)setError(error.message);await load();setBusy(false)}
 async function move(t,dir){const i=tours.findIndex(x=>x.id===t.id),j=i+dir;if(j<0||j>=tours.length)return;setBusy(true);setError("");const order=tours.map(x=>x.id);[order[i],order[j]]=[order[j],order[i]];for(let k=0;k<order.length;k++){const {error}=await supabase.from("custom_tours").update({sort_order:(k+1)*10}).eq("id",order[k]);if(error){setError(error.message);break}}await load();setBusy(false)}
 return <div className={css.manager}>
  <div className={css.heading}><div><span className={css.eyebrow}>TOUR MANAGEMENT</span><h2>{archivedOnly?"Archived Tours":"All Tours Manager"}</h2><p>{archivedOnly?"Restore archived tours or permanently delete custom tours.":"Edit existing tours and create new ones. Published changes appear on the public Tours page."}</p></div>{!archivedOnly&&<button className={css.primary} type="button" onClick={()=>start(null)}>＋ Add New Tour</button>}</div>
  <div className={css.stats}><div><small>Total tours</small><strong>{tours.length}</strong></div><div><small>Published</small><strong>{tours.filter(x=>x.published&&!x.archived).length}</strong></div><div><small>Drafts</small><strong>{tours.filter(x=>!x.published&&!x.archived).length}</strong></div></div>
  {error&&<p className={css.error} role="alert">{error}</p>}{notice&&<p className={css.notice} role="status">{notice}</p>}
  {!archivedOnly&&draft&&<form className={css.editor} onSubmit={save}><div className={css.heading}><h3>{draft.id?"Edit tour":"Create a new tour"}</h3><button type="button" onClick={()=>setDraft(null)}>✕ Close</button></div><div className={css.fields}>
   <label>Tour name<input required value={draft.title} onChange={e=>{set("title",e.target.value);if(!draft.id)set("slug",makeSlug(e.target.value))}} placeholder="3-Day Bakuriani Winter Adventure"/></label>
   <label>URL slug<input required disabled={!!draft.id} value={draft.slug} onChange={e=>set("slug",makeSlug(e.target.value))} placeholder="bakuriani-winter"/><small>Public link: /tour/{makeSlug(draft.slug||draft.title)}</small></label>
   <label>Duration (days)<input type="number" min="1" max="60" value={draft.duration_days} onChange={e=>set("duration_days",e.target.value)}/></label>
   <label>Category<select value={draft.category} onChange={e=>set("category",e.target.value)}>{categories.map(c=><option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}</select></label>
   <label className={css.wide}>Short description<textarea required rows="3" value={draft.description} onChange={e=>set("description",e.target.value)} placeholder="What makes this trip special?"/></label>
   <label className={css.wide}>Itinerary — one day per paragraph<textarea rows="7" value={draft.itinerary||""} onChange={e=>set("itinerary",e.target.value)} placeholder={"Day 1: ...\n\nDay 2: ..."}/></label>
   <div className={css.wide} style={{border:"1px solid #d6e1d8",borderRadius:12,padding:16}}>
    <strong>Free translations (Georgian, Russian, Hebrew)</strong>
    <p>Generate once, review and edit each language, then save. Free service daily limits apply.</p>
    <button type="button" disabled={busy||translationBusy} onClick={generateTranslations}>{translationBusy?"Generating translations…":"Generate translations — free"}</button>
    {[["ka","Georgian"],["ru","Russian"],["he","Hebrew"]].map(([lang,label])=><details key={lang} style={{marginTop:12}}><summary>{label} translation</summary>
      {[["title","Tour name"],["description","Description"],["itinerary","Itinerary"]].map(([field,fieldLabel])=><label key={field} style={{display:"block",marginTop:10}}>{fieldLabel}<textarea rows={field==="itinerary"?5:2} value={draft.translations?.[lang]?.[field]||""} onChange={e=>setDraft(d=>({...d,translations:{...(d.translations||{}),[lang]:{...(d.translations?.[lang]||{}),[field]:e.target.value}}}))}/></label>)}
    </details>)}
   </div>
   <fieldset className={css.wide} style={{border:"1px solid #d6e1d8",borderRadius:12,padding:16,display:"grid",gap:12}}>
     <legend style={{fontWeight:700,color:"#173c32",padding:"0 6px"}}>Tour pricing</legend>
     <label>Price display<select value={draft.price_mode||"hidden"} onChange={e=>set("price_mode",e.target.value)}><option value="starting">Starting price</option><option value="request">Price on request</option><option value="hidden">Hide price</option></select></label>
     {draft.price_mode==="starting"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
       <label>Starting amount<input type="number" min="0.01" step="0.01" required value={draft.price_amount??""} onChange={e=>set("price_amount",e.target.value)}/></label>
       <label>Currency<select value={draft.price_currency||"USD"} onChange={e=>set("price_currency",e.target.value)}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GEL">GEL (₾)</option></select></label>
       <label>Price per<select value={draft.price_unit||"car"} onChange={e=>set("price_unit",e.target.value)}><option value="car">Car</option><option value="person">Person</option><option value="group">Group</option></select></label>
     </div>}
     <small>Pricing appears on the homepage, Tours page and tour details. Hidden prices display nothing.</small>
   </fieldset>
   <label>Display order<input type="number" value={draft.sort_order} onChange={e=>set("sort_order",e.target.value)}/></label>
  </div><div className={css.uploads}><label className={css.upload}>Cover photograph (JPG/PNG/WebP, max 6 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setCover(e.target.files?.[0]||null)}/>{cover&&<small>Selected: {cover.name}</small>}{draft.cover_url&&<img src={draft.cover_url} alt="Current tour cover"/>}</label><label className={css.upload}>Add gallery photographs<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>setGallery(Array.from(e.target.files||[]))}/>{gallery.length>0&&<small>{gallery.length} new images selected</small>}</label></div>
  {!!draft.gallery_images?.length&&<div className={css.photos}>{draft.gallery_images.map(url=><label key={url}><img src={url} alt="Tour gallery"/><input type="checkbox" checked={removed.includes(url)} onChange={e=>setRemoved(a=>e.target.checked?[...a,url]:a.filter(x=>x!==url))}/> Remove</label>)}</div>}
  <div className={css.actions}><label><input type="checkbox" checked={draft.published} onChange={e=>set("published",e.target.checked)}/> Publish on website</label><button className={css.primary} disabled={busy} type="submit">{busy?"Saving…":"Save tour"}</button></div></form>}
  <div className={css.listhead}><h3>Manage all tours</h3><input placeholder="Search tours..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
  {tours.filter(t=>!!t.archived===archivedOnly&&t.title.toLowerCase().includes(query.toLowerCase())).map((t,i)=><article className={css.tour} key={t.id}><div className={css.thumb}>{t.cover_url?<img src={t.cover_url} alt=""/>:"🏔️"}</div><div className={css.details}><strong>{t.title}</strong><small>{t.duration_days} day(s) · {t.category} · {t.published?"Published":"Draft"}</small><div className={css.actions}>{!archivedOnly&&<button disabled={busy} onClick={()=>start(t)}>Edit</button>}{!archivedOnly&&<button disabled={busy} onClick={()=>toggle(t)}>{t.published?"Hide":"Publish"}</button>}<button disabled={busy} onClick={()=>archive(t,archivedOnly)}>{archivedOnly?"Restore":"Archive"}</button>{!archivedOnly&&<button disabled={busy||i===0} onClick={()=>move(t,-1)}>↑ Up</button>}{!archivedOnly&&<button disabled={busy||i===tours.length-1} onClick={()=>move(t,1)}>↓ Down</button>}{!archivedOnly&&<a href={`/tour/${t.slug}`} target="_blank" rel="noreferrer">View ↗</a>}{archivedOnly&&!t.is_original&&<button className={css.danger} disabled={busy} onClick={()=>del(t)}>Delete</button>}</div></div></article>)}
  {!tours.filter(t=>!!t.archived===archivedOnly).length&&<div className={css.empty}>{archivedOnly?"No archived tours yet. Archive a tour from either active tours section and it will appear here.":"No active tours found."}</div>}
 </div>
}

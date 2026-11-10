"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminSubLayout from "../AdminSubLayout";
import styles from "../subpages.module.css";
import studio from "./studio.module.css";
import NewToursManager from "./NewToursManager";

const tours = ["adjara", "martvili", "gomis", "svaneti", "kobuleti", "dashbashi", "vardzia", "tusheti", "beshumi", "kazbegi", "highlights", "airport-transfers"];
const tourName = slug => slug === "airport-transfers" ? "Airport Transfers" : slug === "gomis" ? "Gomis Mta" : slug === "highlights" ? "Georgia Highlights" : slug.charAt(0).toUpperCase() + slug.slice(1);

export default function TourPhotosAdmin({embedded=false}) {
  const [mode, setMode] = useState("new");
  const [session, setSession] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [slug, setSlug] = useState(tours[0]);
  const [record, setRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removed, setRemoved] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [resetCover, setResetCover] = useState(false);
  const [published, setPublished] = useState(true);
  const [tourText, setTourText] = useState({overview:"",itinerary:""});
  const [tourDetails,setTourDetails] = useState({title:"",description:"",duration_days:1,category:"mountains",sort_order:100});
  const [tourRow,setTourRow] = useState(null);
  const [allTours,setAllTours] = useState([]);
  const [price, setPrice] = useState({price_mode:"hidden",price_amount:"",price_currency:"USD",price_unit:"car"});

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    let active = true;
    supabase.auth.getSession().then(async ({ data, error: authError }) => {
      if (!active) return;
      if (authError) { setError(authError.message); setChecking(false); return; }
      const current = data.session;
      setSession(current);
      if (current?.user) {
        const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", current.user.id).maybeSingle();
        if (!active) return;
        if (adminError) setError(adminError.message);
        setAllowed(!!admin);
      }
      if (active) setChecking(false);
    });
    return () => { active = false; };
  }, []);

  async function load(which) {
    if (!supabase) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await supabase.from("tour_page_media").select("*");
      if (queryError) throw queryError;
      const list = data || [];
      setRecords(list);
      const {data:allRows,error:allError}=await supabase.from("custom_tours").select("id,slug,title,published,archived,sort_order").order("sort_order",{ascending:true});
      if(allError) throw allError;
      setAllTours(allRows||[]);
      const found = list.find(item => item.slug === which) || null;
      setRecord(found);
      setPublished(found?.published ?? true);
      const {data:priceRow,error:priceError}=await supabase.from("tour_prices").select("price_mode,price_amount,price_currency,price_unit").eq("slug",which).maybeSingle();
      if(priceError) throw priceError;
      setPrice({price_mode:priceRow?.price_mode||"hidden",price_amount:priceRow?.price_amount??"",price_currency:priceRow?.price_currency||"USD",price_unit:priceRow?.price_unit||"car"});
      const {data:textRow,error:textError}=await supabase.from("tour_content").select("overview,itinerary").eq("slug",which).maybeSingle();
      if(textError) throw textError;
      setTourText({overview:textRow?.overview||"",itinerary:textRow?.itinerary||""});
      const {data:existingTour,error:tourError}=await supabase.from("custom_tours").select("*").eq("slug",which).maybeSingle();
      if(tourError)throw tourError;
      setTourRow(existingTour);
      const originalOrder=tours.indexOf(which)*10;
      setTourDetails({title:existingTour?.title||tourName(which),description:existingTour?.description||"",duration_days:existingTour?.duration_days||1,category:existingTour?.category||"mountains",sort_order:existingTour?.sort_order??originalOrder});
    } catch (err) { setError(err.message || "Unable to load tour photos."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (allowed) load(slug); }, [allowed, slug]);

  function changeTour(next) {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    galleryPreview.forEach(url => URL.revokeObjectURL(url));
    setCoverPreview(null); setGalleryPreview([]); setRemoved([]); setResetCover(false);
    setMessage(""); setError(""); setSlug(next);
  }

  function chooseCover(files) {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(files?.[0] ? URL.createObjectURL(files[0]) : null);
    if (files?.[0]) setResetCover(false);
  }

  function chooseGallery(files) {
    galleryPreview.forEach(url => URL.revokeObjectURL(url));
    setGalleryPreview(Array.from(files || []).map(file => URL.createObjectURL(file)));
  }

  async function upload(files) {
    const result = [];
    for (const file of Array.from(files || []).filter(file => file?.size)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 6 * 1024 * 1024)
        throw new Error("Use JPG, PNG or WebP images smaller than 6 MB.");
      const path = `${slug}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const { error: uploadError } = await supabase.storage.from("tour-media").upload(path, file, { contentType: file.type, cacheControl: "86400" });
      if (uploadError) throw uploadError;
      result.push(supabase.storage.from("tour-media").getPublicUrl(path).data.publicUrl);
    }
    return result;
  }

  async function save(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      if(price.price_mode==="starting" && !(Number(price.price_amount)>0)) throw new Error("Enter a starting price greater than zero.");
      const uploadedCover = (await upload(data.getAll("cover")))[0];
      const cover = uploadedCover || (resetCover ? null : record?.cover_url || null);
      const uploadedGallery = await upload(data.getAll("gallery"));
      const gallery_images = [...(record?.gallery_images || []).filter(url => !removed.includes(url)), ...uploadedGallery];
      const { error: saveError } = await supabase.from("tour_page_media").upsert({ slug, cover_url: cover, gallery_images, published }, { onConflict: "slug" });
      if (saveError) throw saveError;
      const {error:pricingError}=await supabase.from("tour_prices").upsert({slug,...price,price_amount:price.price_mode==="starting"?Number(price.price_amount):null},{onConflict:"slug"});
      if(pricingError) throw pricingError;
      const {error:textSaveError}=await supabase.from("tour_content").upsert({slug,overview:tourText.overview.trim(),itinerary:tourText.itinerary.trim()},{onConflict:"slug"});
      const tourPayload={title:tourDetails.title.trim()||tourName(slug),description:tourDetails.description.trim(),duration_days:Number(tourDetails.duration_days)||1,category:tourDetails.category||"mountains",sort_order:Number(tourDetails.sort_order)||0,published,is_original:tours.includes(slug)};
      const originalCovers={adjara:"/images/photo-003.jpg",martvili:"/images/photo-009.jpg",gomis:"/images/photo-018.jpg",svaneti:"/images/photo-026.jpg",kobuleti:"/images/photo-044.jpg",dashbashi:"/images/photo-051.jpg",vardzia:"/images/photo-057.jpg",tusheti:"/images/photo-064.jpg",beshumi:"/images/photo-073.jpg",kazbegi:"/images/photo-080.jpg",highlights:"/images/photo-086.jpg"};
      const savedTour=tourRow
        ? await supabase.from("custom_tours").update(tourPayload).eq("id",tourRow.id)
        : await supabase.from("custom_tours").insert({...tourPayload,slug,cover_url:cover||originalCovers[slug]||null,gallery_images:gallery_images||[],itinerary:tourText.itinerary.trim()});
      if(savedTour.error)throw savedTour.error;
      // Custom tour media is read from custom_tours on its public detail page.
      if(tourRow && !tours.includes(slug)){
        const {error:mediaUpdateError}=await supabase.from("custom_tours").update({
          cover_url:cover||tourRow.cover_url||null,
          gallery_images:gallery_images.length?gallery_images:(tourRow.gallery_images||[]),
          itinerary:tourText.itinerary.trim()||tourRow.itinerary||""
        }).eq("id",tourRow.id);
        if(mediaUpdateError)throw mediaUpdateError;
      }
      if(textSaveError) throw textSaveError;
      form.reset();
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreview.forEach(url => URL.revokeObjectURL(url));
      setCoverPreview(null); setGalleryPreview([]); setRemoved([]); setResetCover(false);
      await load(slug);
      setMessage("Changes saved successfully. Refresh the public tour page to see your photos.");
    } catch (err) { setError(err.message || "Unable to save changes."); }
    finally { setBusy(false); }
  }

  const tourChoices = [
    ...allTours.filter(t=>!t.archived).map(t=>({slug:t.slug,name:t.title||tourName(t.slug)})),
    ...tours.filter(t=>!allTours.some(r=>r.slug===t)).map(t=>({slug:t,name:tourName(t)}))
  ];
  const currentGallery = (record?.gallery_images || []).filter(url => !removed.includes(url));
  async function archiveSelected(){
    if(!window.confirm(`Archive ${tourDetails.title||tourName(slug)}? It will disappear from the public website.`))return;
    setBusy(true);setError('');
    try{
      const payload={slug,title:tourDetails.title||tourName(slug),description:tourDetails.description||'',duration_days:Number(tourDetails.duration_days)||1,category:tourDetails.category||'other',sort_order:Number(tourDetails.sort_order)||100,published:false,archived:true,is_original:tours.includes(slug)};
      const {error:saveError}=await supabase.from('custom_tours').upsert(payload,{onConflict:'slug'});
      if(saveError)throw saveError;
      const {error:mediaError}=await supabase.from('tour_page_media').upsert({slug,published:false},{onConflict:'slug'});
      if(mediaError)throw mediaError;
      setMessage('Tour archived. You can restore it from Archived Tours.');
      await load(slug);setMode('archived');
    }catch(e){setError(e.message||'Unable to archive tour.');}finally{setBusy(false)}
  }
  const customCovers = records.filter(item => !!item.cover_url).length;
  const totalPhotos = records.reduce((sum, item) => sum + (item.gallery_images || []).length, 0);
  const shownCover = coverPreview || (!resetCover && record?.cover_url);

  return <AdminSubLayout embedded={embedded} active="Tour Photos" title="Tours" subtitle="Create, edit, publish, and archive your tours in one place.">
    {!supabase ? <div className={styles.error}>Supabase is not configured.</div> : checking ? <div className={styles.empty}>Checking administrator access…</div> : !session ? <div className={styles.empty}>Please <a href="/admin">sign in</a> first.</div> : !allowed ? <div className={styles.error}>Administrator access required.</div> : <>
      <div className={studio.modeBar}>
        <button type="button" className={mode === "new" ? studio.modeActive : studio.modeButton} onClick={() => setMode("new")}>＋ Create & Manage Tours</button>
        <button type="button" className={mode === "archived" ? studio.modeActive : studio.modeButton} onClick={() => setMode("archived")}>Archived Tours</button>
      </div>
      {mode === "new" ? <NewToursManager /> : mode === "archived" ? <NewToursManager archivedOnly /> : <>
      <div className={studio.stats}>
        <div className={studio.stat}><span>Total tours</span><strong>{tourChoices.length}</strong><small>Available to manage</small></div>
        <div className={studio.stat}><span>Custom covers</span><strong>{customCovers}</strong><small>Uploaded main images</small></div>
        <div className={studio.stat}><span>Gallery photos</span><strong>{totalPhotos}</strong><small>Saved additional photos</small></div>
      </div>
      <div className={studio.toolbar}>
        <div><span className={studio.eyebrow}>SELECT DESTINATION</span><h2>Choose a tour</h2><p>Pick a tour to manage its cover and gallery photos.</p></div>
        <select aria-label="Choose a tour" value={slug} disabled={busy} onChange={e => changeTour(e.target.value)}>{tourChoices.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
      </div>
      <form onSubmit={save} className={studio.editor} key={slug}>
        <div className={studio.editorHeader}><div><span className={studio.eyebrow}>PHOTO EDITOR</span><h2>{tourDetails.title||tourName(slug)}</h2><p>Changes are saved to your existing Supabase database.</p></div><span className={studio.status}>{loading ? "Loading…" : published ? "● Published" : "○ Hidden"}</span></div>
        <div className={studio.section}>
          <div className={studio.sectionTitle}><div><h3>Edit tour details</h3><p>Changes update the Tours page and homepage ordering.</p></div></div>
          <div style={{display:"grid",gap:12,maxWidth:720}}>
            <label style={{display:"grid",gap:5}}>Tour name<input value={tourDetails.title} onChange={e=>setTourDetails(v=>({...v,title:e.target.value}))} required /></label>
            <label style={{display:"grid",gap:5}}>Short description<textarea rows={3} value={tourDetails.description} onChange={e=>setTourDetails(v=>({...v,description:e.target.value}))}/></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
              <label style={{display:"grid",gap:5}}>Duration (days)<input type="number" min="1" value={tourDetails.duration_days} onChange={e=>setTourDetails(v=>({...v,duration_days:e.target.value}))}/></label>
              <label style={{display:"grid",gap:5}}>Category<select value={tourDetails.category} onChange={e=>setTourDetails(v=>({...v,category:e.target.value}))}><option value="mountains">Mountains</option><option value="waterfalls">Waterfalls</option><option value="canyons">Canyons</option><option value="culture">Culture</option><option value="winter">Winter</option><option value="transfers">Transfers</option></select></label>
              <label style={{display:"grid",gap:5}}>Display order<input type="number" value={tourDetails.sort_order} onChange={e=>setTourDetails(v=>({...v,sort_order:e.target.value}))}/></label>
            </div>
          </div>
        </div>
        <div className={studio.section}>
          <div className={studio.sectionTitle}><div><h3>Cover photo</h3><p>The main image on the tour banner and Tours-page card.</p></div><span className={studio.chip}>{shownCover ? "Custom cover" : "Original cover"}</span></div>
          <div className={studio.coverRow}>
            <div className={studio.coverFrame}>{shownCover ? <img src={shownCover} alt="Selected tour cover" /> : <div className={studio.placeholder}><span>▧</span><strong>Original cover is active</strong><small>Upload a new cover to replace it.</small></div>}</div>
            <div className={studio.coverControls}><label className={studio.upload}><strong>＋ Upload new cover</strong><span>Choose a landscape photograph</span><small>JPG, PNG or WebP · Up to 6 MB</small><input type="file" name="cover" accept="image/jpeg,image/png,image/webp" onChange={e => chooseCover(e.target.files)} /></label>
            {record?.cover_url && <label className={studio.check}><input type="checkbox" checked={resetCover} onChange={e => setResetCover(e.target.checked)} /> Restore original cover on save</label>}</div>
          </div>
        </div>
        <div className={studio.section}>
          <div className={studio.sectionTitle}><div><h3>Gallery photos</h3><p>Add more images or remove previously uploaded photographs.</p></div><span className={studio.chip}>{currentGallery.length} saved</span></div>
          <label className={studio.uploadWide}><strong>＋ Add gallery photos</strong><span>Select multiple images at once · JPG, PNG or WebP · Up to 6 MB each</span><input type="file" name="gallery" multiple accept="image/jpeg,image/png,image/webp" onChange={e => chooseGallery(e.target.files)} /></label>
          {currentGallery.length || galleryPreview.length || removed.length ? <div className={studio.gallery}>
            {(record?.gallery_images || []).map(url => <div key={url} className={`${studio.photo} ${removed.includes(url) ? studio.marked : ""}`}><img src={url} alt="Saved tour gallery photo"/><label><input type="checkbox" checked={removed.includes(url)} onChange={e => setRemoved(old => e.target.checked ? [...old, url] : old.filter(item => item !== url))}/>{removed.includes(url) ? "Remove when saved" : "Remove photo"}</label></div>)}
            {galleryPreview.map((url, i) => <div className={studio.photo} key={url}><img src={url} alt={`New gallery preview ${i + 1}`} /><span className={studio.newTag}>New photo · ready to upload</span></div>)}
          </div> : <div className={studio.empty}>No additional photos yet. The original tour gallery will remain unchanged.</div>}
        </div>
        <div className={studio.section}>
          <div className={studio.sectionTitle}><div><h3>Tour overview & itinerary</h3><p>Edit the description and detailed itinerary for this existing tour. Leave either field blank to keep the original website text.</p></div></div>
          <div style={{display:"grid",gap:16,maxWidth:850}}>
            <label style={{display:"grid",gap:8,fontWeight:650}}>Tour overview
              <textarea rows={5} value={tourText.overview} onChange={e=>setTourText(v=>({...v,overview:e.target.value}))} placeholder="Describe what makes this experience special..." style={{width:"100%",boxSizing:"border-box",border:"1px solid #cadbd0",borderRadius:10,padding:12,font:"inherit",fontWeight:400}} />
            </label>
            <label style={{display:"grid",gap:8,fontWeight:650}}>Detailed itinerary
              <textarea rows={9} value={tourText.itinerary} onChange={e=>setTourText(v=>({...v,itinerary:e.target.value}))} placeholder={"Stop 1: ...\n\nStop 2: ..."} style={{width:"100%",boxSizing:"border-box",border:"1px solid #cadbd0",borderRadius:10,padding:12,font:"inherit",fontWeight:400}} />
            </label>
            <small style={{color:"#65786d"}}>Text is saved when you click Save changes below. Existing photos and pricing remain unchanged.</small>
          </div>
        </div>
        <div className={studio.section}>
          <div className={studio.sectionTitle}><div><h3>Tour pricing</h3><p>Shown on the homepage, Tours page and tour details.</p></div></div>
          <div style={{display:"grid",gap:14,maxWidth:720}}>
            <label>Price display<select value={price.price_mode} onChange={e=>setPrice(x=>({...x,price_mode:e.target.value}))}><option value="starting">Starting price</option><option value="request">Price on request</option><option value="hidden">Hide price</option></select></label>
            {price.price_mode==="starting"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
              <label>Starting amount<input type="number" min="0.01" step="0.01" required value={price.price_amount} onChange={e=>setPrice(x=>({...x,price_amount:e.target.value}))}/></label>
              <label>Currency<select value={price.price_currency} onChange={e=>setPrice(x=>({...x,price_currency:e.target.value}))}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GEL">GEL (₾)</option></select></label>
              <label>Price per<select value={price.price_unit} onChange={e=>setPrice(x=>({...x,price_unit:e.target.value}))}><option value="car">Car</option><option value="person">Person</option><option value="group">Group</option></select></label>
            </div>}
          </div>
        </div>
        <div className={studio.actions}><label className={studio.check}><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published on website</label><div className={studio.actionButtons}>{slug !== "airport-transfers" && <a className={studio.secondaryButton} href={`/${slug}`} target="_blank" rel="noreferrer">View tour ↗</a>}<button type="button" className={studio.secondaryButton} disabled={busy||loading} onClick={archiveSelected}>Archive tour</button><button className={studio.saveButton} type="submit" disabled={busy || loading}>{busy ? "Uploading & saving…" : "Save changes"}</button></div></div>
      </form>
      </>}
      {error && <div role="alert" className={styles.error}>{error}</div>}{message && <div role="status" className={styles.notice}>{message}</div>}
    </>}
  </AdminSubLayout>;
}

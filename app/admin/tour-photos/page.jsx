"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminSubLayout from "../AdminSubLayout";
import styles from "../subpages.module.css";
import studio from "./studio.module.css";

const tours = [
  "adjara",
  "martvili",
  "gomis",
  "svaneti",
  "kobuleti",
  "dashbashi",
  "vardzia",
  "tusheti",
  "beshumi",
  "kazbegi",
  "highlights",
  "airport-transfers"
];
const button = { background: "#234B40", color: "white", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", marginRight: 8 };
const field = { width: "100%", padding: 10, margin: "8px 0 16px", boxSizing: "border-box" };

export default function TourPhotosAdmin() {
  const [session, setSession] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [slug, setSlug] = useState(tours[0]);
  const [record, setRecord] = useState(null);
  const [removed, setRemoved] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      setSession(data.session);
      if (user) {
        const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
        if (active) setAllowed(!!admin);
      }
      if (active) setChecking(false);
    });
    return () => { active = false; };
  }, []);

  async function load(which) {
    setError(""); setMessage(""); setRemoved([]); setCoverPreview(null); setGalleryPreview([]);
    const { data, error } = await supabase.from("tour_page_media").select("*").eq("slug", which).maybeSingle();
    if (error) setError(error.message);
    setRecord(data || null);
  }
  useEffect(() => { if (allowed) load(slug); }, [allowed, slug]);

  async function upload(files) {
    const result = [];
    for (const file of Array.from(files || []).filter(f => f.size)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 6 * 1024 * 1024)
        throw Error("Use JPG, PNG or WebP images smaller than 6 MB.");
      const path = `${slug}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const { error } = await supabase.storage.from("tour-media").upload(path, file, { contentType: file.type });
      if (error) throw error;
      result.push(supabase.storage.from("tour-media").getPublicUrl(path).data.publicUrl);
    }
    return result;
  }

  async function save(e) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const cover = (await upload(data.getAll("cover")))[0] || (data.get("remove_cover") === "on" ? null : record?.cover_url || null);
      const newGallery = await upload(data.getAll("gallery"));
      const gallery_images = [...(record?.gallery_images || []).filter(url => !removed.includes(url)), ...newGallery];
      const payload = { slug, cover_url: cover, gallery_images, published: data.get("published") === "on" };
      const { error } = await supabase.from("tour_page_media").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      setMessage("Saved. Refresh the public tour page to see the changes.");
      form.reset(); setCoverPreview(null); setGalleryPreview([]);
      await load(slug);
      setMessage("Saved. Refresh the public tour page to see the changes.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <AdminSubLayout active="Tour Photos" title="Tour Media Studio" subtitle="A dedicated workspace for tour covers and galleries.">
    {!supabase ? <div className={styles.error}>Supabase is not configured.</div> : checking ? <div className={styles.empty}>Checking administrator access…</div> : !session ? <div className={styles.empty}>Please <a href="/admin">sign in</a> first.</div> : !allowed ? <div className={styles.error}>Administrator access required.</div> : <>
      <div className={studio.selector}><div><span className={studio.eyebrow}>SELECT DESTINATION</span><h2>Choose a tour</h2><p>Manage each tour's photos without changing its itinerary.</p></div><select aria-label="Choose a tour" value={slug} onChange={e=>setSlug(e.target.value)}>{tours.map(t=><option key={t} value={t}>{t==="airport-transfers"?"Airport Transfers":t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select></div>
      <form onSubmit={save} key={slug+(record?.updated_at||"new")}>
        <div className={studio.workspace}>
          <section className={studio.panel}>
            <div className={studio.panelHead}><div><span className={studio.eyebrow}>MAIN IMAGE</span><h2>Cover photo</h2><p>Shown on the tour banner and Tours page card.</p></div><span className={studio.count}>{record?.cover_url?"Custom cover":"Original cover"}</span></div>
            <div className={studio.coverFrame}>{coverPreview||record?.cover_url?<img src={coverPreview||record.cover_url} alt="Tour cover preview"/>:<div className={studio.placeholder}><span className={studio.largeIcon}>▧</span><strong>Original cover in use</strong><small>Upload a new image to replace it.</small></div>}</div>
            <label className={studio.upload}><span>＋ Choose cover image</span><small>JPG, PNG or WebP · Maximum 6 MB</small><input type="file" name="cover" accept="image/jpeg,image/png,image/webp" onChange={e=>{if(coverPreview)URL.revokeObjectURL(coverPreview);setCoverPreview(e.target.files?.[0]?URL.createObjectURL(e.target.files[0]):null)}}/></label>
            {record?.cover_url&&<label className={studio.check}><input type="checkbox" name="remove_cover"/> Restore original cover when saving</label>}
          </section>
          <section className={studio.panel}>
            <div className={studio.panelHead}><div><span className={studio.eyebrow}>PHOTO COLLECTION</span><h2>Gallery photos</h2><p>Add multiple photos and manage uploaded images.</p></div><span className={studio.count}>{(record?.gallery_images||[]).length} saved</span></div>
            <label className={studio.upload}><span>＋ Add gallery photos</span><small>Select multiple images · Maximum 6 MB each</small><input type="file" name="gallery" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>{galleryPreview.forEach(u=>URL.revokeObjectURL(u));setGalleryPreview(Array.from(e.target.files||[]).map(f=>URL.createObjectURL(f)))}}/></label>
            <div className={studio.gallery}>
              {(record?.gallery_images||[]).map(url=><label key={url} className={`${studio.photo} ${removed.includes(url)?studio.marked:""}`}><img src={url} alt="Uploaded gallery photograph"/><span><input type="checkbox" checked={removed.includes(url)} onChange={e=>setRemoved(old=>e.target.checked?[...old,url]:old.filter(x=>x!==url))}/>{removed.includes(url)?"Remove on save":"Mark for removal"}</span></label>)}
              {galleryPreview.map((url,i)=><div className={studio.photo} key={url}><img src={url} alt={`New photo ${i+1}`}/><span>New · ready to upload</span></div>)}
            </div>
            {!(record?.gallery_images||[]).length&&!galleryPreview.length&&<div className={studio.noPhotos}>No additional photos uploaded yet. Original gallery photos remain on the tour page.</div>}
          </section>
        </div>
        <div className={studio.savebar}><label className={studio.check}><input type="checkbox" name="published" defaultChecked={record?.published??true}/> Published</label><div className={studio.saveactions}>{slug!=="airport-transfers"&&<a href={`/${slug}`} target="_blank" rel="noreferrer" className={studio.view}>View tour ↗</a>}<button className={studio.save} type="submit" disabled={busy}>{busy?"Uploading & saving…":"Save changes"}</button></div></div>
      </form>
      {error&&<div role="alert" className={styles.error}>{error}</div>}{message&&<div role="status" className={styles.notice}>{message}</div>}
    </>}
  </AdminSubLayout>;
}

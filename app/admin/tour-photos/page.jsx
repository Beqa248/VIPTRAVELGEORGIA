"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminSubLayout from "../AdminSubLayout";
import styles from "../subpages.module.css";
import studio from "./studio.module.css";

const tours = ["adjara", "martvili", "gomis", "svaneti", "kobuleti", "dashbashi", "vardzia", "tusheti", "beshumi", "kazbegi", "highlights", "airport-transfers"];
const tourName = slug => slug === "airport-transfers" ? "Airport Transfers" : slug === "gomis" ? "Gomis Mta" : slug === "highlights" ? "Georgia Highlights" : slug.charAt(0).toUpperCase() + slug.slice(1);

export default function TourPhotosAdmin() {
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
      const found = list.find(item => item.slug === which) || null;
      setRecord(found);
      setPublished(found?.published ?? true);
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
      const { error: uploadError } = await supabase.storage.from("tour-media").upload(path, file, { contentType: file.type });
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
      const uploadedCover = (await upload(data.getAll("cover")))[0];
      const cover = uploadedCover || (resetCover ? null : record?.cover_url || null);
      const uploadedGallery = await upload(data.getAll("gallery"));
      const gallery_images = [...(record?.gallery_images || []).filter(url => !removed.includes(url)), ...uploadedGallery];
      const { error: saveError } = await supabase.from("tour_page_media").upsert({ slug, cover_url: cover, gallery_images, published }, { onConflict: "slug" });
      if (saveError) throw saveError;
      form.reset();
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreview.forEach(url => URL.revokeObjectURL(url));
      setCoverPreview(null); setGalleryPreview([]); setRemoved([]); setResetCover(false);
      await load(slug);
      setMessage("Changes saved successfully. Refresh the public tour page to see your photos.");
    } catch (err) { setError(err.message || "Unable to save changes."); }
    finally { setBusy(false); }
  }

  const currentGallery = (record?.gallery_images || []).filter(url => !removed.includes(url));
  const customCovers = records.filter(item => !!item.cover_url).length;
  const totalPhotos = records.reduce((sum, item) => sum + (item.gallery_images || []).length, 0);
  const shownCover = coverPreview || (!resetCover && record?.cover_url);

  return <AdminSubLayout active="Tour Photos" title="Tour Media Studio" subtitle="Manage cover photographs and galleries from one place.">
    {!supabase ? <div className={styles.error}>Supabase is not configured.</div> : checking ? <div className={styles.empty}>Checking administrator access…</div> : !session ? <div className={styles.empty}>Please <a href="/admin">sign in</a> first.</div> : !allowed ? <div className={styles.error}>Administrator access required.</div> : <>
      <div className={studio.stats}>
        <div className={studio.stat}><span>Total tours</span><strong>{tours.length}</strong><small>Available to manage</small></div>
        <div className={studio.stat}><span>Custom covers</span><strong>{customCovers}</strong><small>Uploaded main images</small></div>
        <div className={studio.stat}><span>Gallery photos</span><strong>{totalPhotos}</strong><small>Saved additional photos</small></div>
      </div>
      <div className={studio.toolbar}>
        <div><span className={studio.eyebrow}>SELECT DESTINATION</span><h2>Choose a tour</h2><p>Pick a tour to manage its cover and gallery photos.</p></div>
        <select aria-label="Choose a tour" value={slug} disabled={busy} onChange={e => changeTour(e.target.value)}>{tours.map(item => <option key={item} value={item}>{tourName(item)}</option>)}</select>
      </div>
      <form onSubmit={save} className={studio.editor} key={slug}>
        <div className={studio.editorHeader}><div><span className={studio.eyebrow}>PHOTO EDITOR</span><h2>{tourName(slug)}</h2><p>Changes are saved to your existing Supabase database.</p></div><span className={studio.status}>{loading ? "Loading…" : published ? "● Published" : "○ Hidden"}</span></div>
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
        <div className={studio.actions}><label className={studio.check}><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published on website</label><div className={studio.actionButtons}>{slug !== "airport-transfers" && <a className={studio.secondaryButton} href={`/${slug}`} target="_blank" rel="noreferrer">View tour ↗</a>}<button className={studio.saveButton} type="submit" disabled={busy || loading}>{busy ? "Uploading & saving…" : "Save changes"}</button></div></div>
      </form>
      {error && <div role="alert" className={styles.error}>{error}</div>}{message && <div role="status" className={styles.notice}>{message}</div>}
    </>}
  </AdminSubLayout>;
}

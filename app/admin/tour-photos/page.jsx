"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminSubLayout from "../AdminSubLayout";
import styles from "../subpages.module.css";

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
    setError(""); setMessage(""); setRemoved([]);
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
      form.reset();
      await load(slug);
      setMessage("Saved. Refresh the public tour page to see the changes.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <AdminSubLayout active="Tour Photos" title="Tour covers & galleries" subtitle="Manage cover images and galleries for your existing tours.">
    {!supabase ? <div className={styles.error}>Supabase is not configured.</div> : checking ? <div className={styles.empty}>Checking administrator access…</div> : !session ? <div className={styles.empty}>Please <a href="/admin">sign in</a> first.</div> : !allowed ? <div className={styles.error}>Administrator access required.</div> : <>
      <div className={styles.toolbar}><label className={styles.field} style={{flex:1}}>Choose a tour
        <select className={styles.select} value={slug} onChange={e => setSlug(e.target.value)}>{tours.map(t => <option key={t} value={t}>{t === "airport-transfers" ? "Airport Transfers" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>
      </label></div>
      <p className={styles.muted}>Original photos remain in place. Uploaded cover photos replace the tour banner and card image. Additional gallery photos appear after existing gallery images.</p>
      <form onSubmit={save} key={slug + (record?.updated_at || "new")}>
        <div className={styles.cards}>
          <section className={styles.card}><h2>Cover photo</h2>
            {record?.cover_url ? <><img className={styles.preview} src={record.cover_url} alt="Current tour cover"/><label className={styles.field} style={{marginTop:12,flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="remove_cover"/> Restore original cover photo</label></> : <div className={styles.empty}>No custom cover uploaded. Original cover is being used.</div>}
            <label className={styles.upload} style={{marginTop:14}}><strong>↑ Upload new cover</strong><span className={styles.muted}>JPG, PNG or WebP · up to 6 MB</span><input type="file" name="cover" accept="image/jpeg,image/png,image/webp"/></label>
          </section>
          <section className={styles.card}><h2>Additional gallery photos</h2>
            <label className={styles.upload}><strong>↑ Add gallery photos</strong><span className={styles.muted}>Choose multiple images · up to 6 MB each</span><input type="file" name="gallery" multiple accept="image/jpeg,image/png,image/webp"/></label>
            <p className={styles.muted}>{(record?.gallery_images||[]).length} uploaded gallery photos</p>
            <div className={styles.gallery}>{(record?.gallery_images||[]).map(url=><label key={url} className={styles.tile}><img src={url} alt="Tour gallery"/><span><input type="checkbox" checked={removed.includes(url)} onChange={e=>setRemoved(old=>e.target.checked?[...old,url]:old.filter(x=>x!==url))}/> Remove photo</span></label>)}</div>
          </section>
        </div>
        <div className={styles.card} style={{marginTop:16}}><div className={styles.actions}><label className={styles.field} style={{flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="published" defaultChecked={record?.published ?? true}/> Published</label><button type="submit" className={styles.button} disabled={busy}>{busy?"Uploading…":"Save tour photos"}</button>{slug!=="airport-transfers"&&<a className={`${styles.button} ${styles.secondary}`} href={`/${slug}`} target="_blank" rel="noreferrer">View tour ↗</a>}</div></div>
      </form>
      {error&&<div role="alert" className={styles.error}>{error}</div>}{message&&<div role="status" className={styles.notice}>{message}</div>}
    </>}
  </AdminSubLayout>;
}

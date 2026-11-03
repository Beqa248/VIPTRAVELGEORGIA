"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const tours = ["adjara", "martvili", "gomis", "svaneti", "kobuleti", "dashbashi", "vardzia", "tusheti", "beshumi", "kazbegi", "highlights"];
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

  return <main style={{ minHeight: "100vh", background: "#F3F0E9", color: "#234B40", padding: "35px 5%", fontFamily: "Arial,sans-serif" }}>
    <div style={{ maxWidth: 850, margin: "auto" }}>
      <p><a href="/admin">← Back to admin</a></p><h1>Tour Cover Photos & Galleries</h1>
      {!supabase ? <p>Supabase is not configured.</p> : checking ? <p>Checking admin access…</p> : !session ? <p>Please <a href="/admin">sign in</a> first.</p> : !allowed ? <p>Administrator access required.</p> : <>
        <label>Select existing tour<select style={field} value={slug} onChange={e => setSlug(e.target.value)}>{tours.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></label>
        <p>Original tour photos remain in place. Upload a new cover to replace the tour banner and Tours-page card image. Gallery photos are added below the existing gallery images.</p>
        <form onSubmit={save} style={{ background: "white", padding: 24, borderRadius: 12 }} key={slug + (record?.updated_at || "new")}>
          <h2>Cover photo</h2>
          {record?.cover_url && <div><img src={record.cover_url} alt="Current cover" style={{ width: 280, maxWidth: "100%", borderRadius: 8 }} /><label style={{ display: "block" }}><input type="checkbox" name="remove_cover" /> Restore original cover photo</label></div>}
          <input style={field} type="file" name="cover" accept="image/jpeg,image/png,image/webp" />
          <h2>Additional gallery photos</h2>
          <input style={field} type="file" name="gallery" multiple accept="image/jpeg,image/png,image/webp" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            {(record?.gallery_images || []).map(url => <label key={url} style={{ width: 130 }}><img src={url} alt="Tour gallery" style={{ width: 130, height: 95, objectFit: "cover" }} /><span style={{ display: "block" }}><input type="checkbox" checked={removed.includes(url)} onChange={e => setRemoved(old => e.target.checked ? [...old, url] : old.filter(x => x !== url))} /> Remove</span></label>)}
          </div>
          <label><input type="checkbox" name="published" defaultChecked={record?.published ?? true} /> Published</label>
          <div style={{ marginTop: 20 }}><button type="submit" style={button} disabled={busy}>{busy ? "Uploading…" : "Save tour photos"}</button><a href={`/${slug}`} target="_blank" rel="noreferrer">View tour</a></div>
        </form>
        {error && <p role="alert" style={{ color: "#a52418" }}>{error}</p>}{message && <p role="status">{message}</p>}
      </>}
    </div>
  </main>;
}

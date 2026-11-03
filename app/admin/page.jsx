"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase as client } from "../../lib/supabase";
import styles from "./dashboard.module.css";

const tabs = [
  { id: "vehicles", label: "Cars", icon: "🚙" },
  { id: "videos", label: "Videos", icon: "▶" },
  { id: "recent_tours", label: "Recent Tours", icon: "🏔" },
  { id: "reviews", label: "Guest Reviews", icon: "★" },
];
const allowedImages = ["image/jpeg", "image/png", "image/webp"];
const allowedVideos = ["video/mp4", "video/webm", "video/quicktime"];

function PhotoPicker({ name, multiple = false, label, help, onSelected }) {
  return (
    <label className={styles.uploadBox}>
      <span className={styles.uploadIcon}>↑</span>
      <strong>{label}</strong>
      <small>{help}</small>
      <input name={name} type="file" multiple={multiple} accept={name === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp"} onChange={(e) => onSelected(name, Array.from(e.target.files || []))} />
    </label>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("vehicles");
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [removed, setRemoved] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const formRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!client) { setChecking(false); return; }
    let alive = true;
    client.auth.getSession().then(({ data, error: authError }) => {
      if (!alive) return;
      if (authError) setError(authError.message);
      setSession(previous => previous?.user?.id === data.session?.user?.id ? previous : data.session);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((event, next) => {
      if (!alive) return;
      if (event === "SIGNED_OUT") {
        setSession(null); setAuthorized(false); setRows([]);
      } else if (["SIGNED_IN", "INITIAL_SESSION", "USER_UPDATED"].includes(event)) {
        setSession(previous => previous?.user?.id === next?.user?.id ? previous : next);
      }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let alive = true;
    setAuthorized(false);
    setChecking(true);
    if (!client || !session?.user?.id) { setChecking(false); return; }
    client.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle()
      .then(({ data, error: authError }) => {
        if (!alive) return;
        setAuthorized(Boolean(data) && !authError);
        setChecking(false);
        if (authError) setError(authError.message);
      });
    return () => { alive = false; };
  }, [session?.user?.id]);

  async function refresh(which = tab) {
    if (!client) return;
    const request = ++requestRef.current;
    setLoadingRows(true);
    let query = client.from(which).select("*");
    if (which === "vehicles") {
      query = query.order("sort_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    const { data, error: fetchError } = await query;
    if (request !== requestRef.current) return;
    if (fetchError) setError(`Could not load ${which}: ${fetchError.message}`);
    else setRows(data || []);
    setLoadingRows(false);
  }

  useEffect(() => {
    if (!authorized || !session?.user?.id || !client) return;
    setError("");
    setRows([]);
    refresh(tab);
    return () => { requestRef.current += 1; };
  }, [authorized, tab, session?.user?.id]);

  async function login(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if (!email || !password) { setError("Enter your email and password."); return; }
    setBusy(true);
    const { error: loginError } = await client.auth.signInWithPassword({ email, password });
    if (loginError) setError(loginError.message);
    setBusy(false);
  }

  async function upload(files, kind) {
    const urls = [];
    for (const file of Array.from(files || []).filter(f => f?.size)) {
      const video = kind === "video";
      const types = video ? allowedVideos : allowedImages;
      const limit = video ? 100 * 1024 * 1024 : 6 * 1024 * 1024;
      if (!types.includes(file.type) || file.size > limit) {
        throw Error(video ? "Use MP4/WebM/MOV videos up to 100 MB." : "Use JPG/PNG/WebP images up to 6 MB.");
      }
      const bucket = video ? "tour-videos" : "tour-media";
      const name = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const { error: uploadError } = await client.storage.from(bucket).upload(name, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      urls.push(client.storage.from(bucket).getPublicUrl(name).data.publicUrl);
    }
    return urls;
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      let payload;
      if (tab === "vehicles") {
        const newImages = await upload(f.getAll("images"), "image");
        payload = {
          name: String(f.get("name") || "").trim(),
          description: String(f.get("description") || ""),
          passengers: Number(f.get("passengers") || 0),
          published: f.get("published") === "on",
          images: [...(editing?.images || []).filter(url => !removed.includes(url)), ...newImages],
        };
        if (!editing) payload.sort_order = Math.max(0, ...rows.map(car => Number(car.sort_order) || 0)) + 1;
      } else if (tab === "videos") {
        const video = (await upload(f.getAll("video"), "video"))[0] || editing?.video_url;
        const cover = (await upload(f.getAll("cover"), "image"))[0] || editing?.cover_url || null;
        if (!video) throw Error("Select a video file.");
        payload = { title: String(f.get("title") || "").trim(), description: String(f.get("description") || ""), video_url: video, cover_url: cover, published: f.get("published") === "on" };
      } else {
        const images = await upload(f.getAll("images"), "image");
        payload = {
          title: String(f.get("title") || "").trim(), description: String(f.get("description") || ""),
          tour_date: f.get("tour_date") || null,
          images: [...(editing?.images || []).filter(url => !removed.includes(url)), ...images],
          published: f.get("published") === "on",
        };
        if (!payload.images.length) throw Error("Add at least one tour photograph.");
      }
      if (!payload.name && !payload.title) throw Error("A name or title is required.");
      const result = editing?.id ? await client.from(tab).update(payload).eq("id", editing.id) : await client.from(tab).insert(payload);
      if (result.error) throw result.error;
      setEditing(null); setFormOpen(false); setRemoved([]); setSelectedFiles({});
      setNotice("Saved successfully. Your changes are now in Supabase.");
      await refresh(tab);
    } catch (saveError) { setError(saveError.message || "Could not save."); }
    finally { setBusy(false); }
  }

  async function change(id, payload) {
    setBusy(true); setError(""); setNotice("");
    const { error: updateError } = await client.from(tab).update(payload).eq("id", id);
    if (updateError) setError(updateError.message);
    else { setNotice("Updated successfully."); await refresh(tab); }
    setBusy(false);
  }

  async function remove() {
    if (!deleteTarget || busy) return;
    setBusy(true); setError("");
    const { error: deleteError } = await client.from(tab).delete().eq("id", deleteTarget.id);
    if (deleteError) setError(deleteError.message);
    else { setNotice("Deleted successfully."); await refresh(tab); }
    setDeleteTarget(null); setBusy(false);
  }

  async function moveVehicle(id, direction) {
    if (busy || tab !== "vehicles") return;
    const index = rows.findIndex(row => row.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= rows.length) return;
    const current = rows[index], other = rows[target];
    setBusy(true); setError("");
    try {
      // Assign positions to the entire list to also handle null or duplicate sort_order values.
      const reordered = [...rows];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      for (let i = 0; i < reordered.length; i++) {
        const { error: updateError } = await client.from("vehicles").update({ sort_order: i + 1 }).eq("id", reordered[i].id);
        if (updateError) throw updateError;
      }
      setNotice("Vehicle order updated.");
      await refresh("vehicles");
    } catch (moveError) { setError(moveError.message || "Could not reorder vehicles."); await refresh("vehicles"); }
    finally { setBusy(false); }
  }

  function openForm(row = null) {
    setEditing(row); setRemoved([]); setSelectedFiles({}); setError(""); setNotice(""); setFormOpen(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function switchTab(next) {
    if (busy) return;
    setTab(next); setEditing(null); setFormOpen(false); setRemoved([]); setSelectedFiles({}); setError(""); setNotice(""); setSearch(""); setFilter("all");
  }

  const filteredRows = useMemo(() => rows.filter(row => {
    const content = [row.name, row.title, row.description, row.text, row.country].filter(Boolean).join(" ").toLowerCase();
    const status = tab === "reviews" ? Boolean(row.approved) : Boolean(row.published);
    return content.includes(search.trim().toLowerCase()) && (filter === "all" || (filter === "visible" ? status : !status));
  }), [rows, search, filter, tab]);
  const publishedCount = rows.filter(row => tab === "reviews" ? row.approved : row.published).length;
  const sectionTitle = tabs.find(item => item.id === tab)?.label || "Content";

  return (
    <main className={styles.shell}>
      <div className={styles.dashboard}>
        <header className={styles.topbar}>
          <div className={styles.brand}><span className={styles.brandIcon}>▲</span><div><strong>VIPTravelGeorgia</strong><small>Content management dashboard</small></div></div>
          {session && <button type="button" className={styles.signOut} onClick={() => client?.auth.signOut()}>Sign out ↗</button>}
        </header>
        {!client ? <div className={styles.centerCard}>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.</div>
        : !session ? <form onSubmit={login} className={styles.loginCard}>
          <h1>Welcome back</h1><p>Sign in to manage your travel website.</p>
          <label>Email address<input type="email" name="email" autoComplete="username" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required /></label>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <button className={styles.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        : checking ? <div className={styles.centerCard}>Checking administrator permissions…</div>
        : !authorized ? <div className={styles.centerCard}>Access restricted. Add your authenticated user ID to admin_users.</div>
        : <>
          <nav className={styles.nav} aria-label="Admin sections">
            {tabs.map(item => <button type="button" key={item.id} className={`${styles.navItem} ${tab === item.id ? styles.navActive : ""}`} onClick={() => switchTab(item.id)}><span>{item.icon}</span>{item.label}</button>)}
            <a className={styles.navItem} href="/admin/inquiries"><span>✉</span>Customer Inquiries</a>
            <a className={styles.navItem} href="/admin/tour-photos"><span>▧</span>Tour Photos</a>
          </nav>
          <div className={styles.content}>
            <div className={styles.headingRow}>
              <div><div className={styles.eyebrow}>WEBSITE MANAGEMENT</div><h1>{sectionTitle}</h1><p>Manage content, photographs and visibility from one place.</p></div>
              {tab !== "reviews" && <button type="button" className={styles.primary} onClick={() => formOpen ? (setFormOpen(false), setEditing(null), setSelectedFiles({})) : openForm()}>{formOpen ? "× Close editor" : `＋ Add ${tab === "vehicles" ? "vehicle" : tab === "videos" ? "video" : "tour"}`}</button>}
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><small>Total {sectionTitle.toLowerCase()}</small><strong>{rows.length}</strong></div>
              <div className={styles.stat}><small>{tab === "reviews" ? "Approved" : "Published"}</small><strong>{publishedCount}</strong></div>
              <div className={styles.stat}><small>{tab === "reviews" ? "Pending" : "Hidden"}</small><strong>{rows.length - publishedCount}</strong></div>
            </div>
            {error && <div role="alert" className={styles.error}>{error}</div>}
            {notice && <div role="status" className={styles.notice}>✓ {notice}</div>}
            {formOpen && tab !== "reviews" && <section ref={formRef} className={styles.editor}>
              <div className={styles.editorHeader}><div><h2>{editing ? "Edit" : "Add new"} {tab === "vehicles" ? "vehicle" : tab === "videos" ? "video" : "recent tour"}</h2><p>Changes are saved to your existing Supabase database.</p></div><button type="button" className={styles.iconButton} aria-label="Close editor" onClick={() => { setFormOpen(false); setEditing(null); }}>×</button></div>
              <form key={`${tab}-${editing?.id || "new"}`} onSubmit={save}>
                <div className={styles.formGrid}>
                  <label className={styles.formField}>{tab === "vehicles" ? "Vehicle name" : "Title"}<input type="text" name={tab === "vehicles" ? "name" : "title"} defaultValue={editing?.name || editing?.title || ""} required placeholder={tab === "vehicles" ? "e.g. Subaru Crosstrek 4x4" : "Enter a title"}/></label>
                  {tab === "vehicles" && <label className={styles.formField}>Passengers<input type="number" name="passengers" min="0" defaultValue={editing?.passengers ?? 0}/></label>}
                  {tab === "recent_tours" && <label className={styles.formField}>Tour date<input type="date" name="tour_date" defaultValue={editing?.tour_date || ""}/></label>}
                  <label className={`${styles.formField} ${styles.fullWidth}`}>Description<textarea name="description" rows="3" defaultValue={editing?.description || ""} placeholder="Add a short description…"/></label>
                </div>
                <div className={styles.uploadGrid}>
                  {tab === "videos" ? <><PhotoPicker name="video" label="Upload video" help="MP4, WebM or MOV · up to 100 MB" onSelected={(name, files) => setSelectedFiles(prev => ({ ...prev, [name]: files }))}/><PhotoPicker name="cover" label="Cover photograph" help="JPG, PNG or WebP · up to 6 MB" onSelected={(name, files) => setSelectedFiles(prev => ({ ...prev, [name]: files }))}/></>
                  : <PhotoPicker name="images" multiple label="Add photographs" help="Select multiple JPG, PNG or WebP files · 6 MB each" onSelected={(name, files) => setSelectedFiles(prev => ({ ...prev, [name]: files }))}/>}
                </div>
                {Object.values(selectedFiles).flat().length > 0 && <p className={styles.fileNote}>✓ Selected: {Object.values(selectedFiles).flat().map(f => f.name).join(", ")}</p>}
                {editing?.video_url && tab === "videos" && <video controls className={styles.videoPreview} src={editing.video_url}/>}
                {tab !== "videos" && editing?.images?.length > 0 && <><h3 className={styles.subheading}>Current photographs <small>Tick photos to remove when saving</small></h3><div className={styles.existingPhotos}>{editing.images.map((url, index) => <label key={`${url}-${index}`} className={`${styles.photoTile} ${removed.includes(url) ? styles.photoRemoved : ""}`}><img src={url} alt={`Photo ${index + 1}`} /><span><input type="checkbox" checked={removed.includes(url)} onChange={e => setRemoved(old => e.target.checked ? [...old, url] : old.filter(item => item !== url))}/> Remove</span></label>)}</div></>}
                <div className={styles.formActions}><label className={styles.publishToggle}><input type="checkbox" name="published" defaultChecked={editing?.published ?? true}/> Published on website</label><div className={styles.actionButtons}><button type="button" className={styles.secondary} onClick={() => { setFormOpen(false); setEditing(null); setRemoved([]); }}>Cancel</button><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Saving / uploading…" : editing ? "Save changes" : "Create content"}</button></div></div>
              </form>
            </section>}
            <section className={styles.listSection}>
              <div className={styles.listHeading}><div><h2>{tab === "reviews" ? "Review moderation" : "Existing content"}</h2><p>{tab === "vehicles" ? "Use the arrows to change the order displayed on your Cars page." : "Search and manage your existing entries."}</p></div></div>
              <div className={styles.toolbar}><label className={styles.searchBox}><span>⌕</span><input aria-label="Search content" placeholder={`Search ${sectionTitle.toLowerCase()}…`} value={search} onChange={e => setSearch(e.target.value)}/></label><select aria-label="Filter status" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option><option value="visible">{tab === "reviews" ? "Approved" : "Published"}</option><option value="hidden">{tab === "reviews" ? "Pending" : "Hidden"}</option></select></div>
              {loadingRows && <div className={styles.empty}>Loading content…</div>}
              {!loadingRows && !filteredRows.length && <div className={styles.empty}>{rows.length ? "No matching results. Try a different search." : "No records yet. Add your first entry above."}</div>}
              <div className={styles.cards}>{!loadingRows && filteredRows.map(row => {
                const actualIndex = rows.findIndex(item => item.id === row.id);
                const visible = tab === "reviews" ? row.approved : row.published;
                const photo = row.images?.[0] || row.cover_url;
                return <article key={row.id} className={styles.itemCard}>
                  <div className={styles.itemPhoto}>{photo ? <img src={photo} alt={row.name || row.title || "Content thumbnail"}/> : <span>{tab === "vehicles" ? "🚙" : tab === "videos" ? "▶" : tab === "reviews" ? "★" : "🏔"}</span>}</div>
                  <div className={styles.itemDetails}><div className={styles.itemTop}><h3>{row.name || row.title || "Guest review"}</h3><span className={`${styles.status} ${visible ? styles.statusOn : styles.statusOff}`}>{visible ? (tab === "reviews" ? "Approved" : "Published") : (tab === "reviews" ? "Pending" : "Hidden")}</span></div>
                    {tab === "reviews" && <p className={styles.reviewText}>{"★".repeat(Math.max(0, Math.min(5, Number(row.rating) || 0)))} · {row.country || ""} · {row.text || ""}</p>}
                    {row.description && <p className={styles.description}>{row.description}</p>}
                    {tab === "vehicles" && <small className={styles.meta}>Position {actualIndex + 1} · {row.passengers || 0} passengers · {(row.images || []).length} photos</small>}
                    <div className={styles.itemActions}>
                      {tab === "reviews" ? <button type="button" className={styles.secondary} disabled={busy} onClick={() => change(row.id, { approved: !row.approved })}>{row.approved ? "Unapprove" : "✓ Approve"}</button>
                      : <><button type="button" className={styles.secondary} disabled={busy} onClick={() => openForm(row)}>✎ Edit / Photos</button><button type="button" className={styles.secondary} disabled={busy} onClick={() => change(row.id, { published: !row.published })}>{row.published ? "◉ Hide" : "◉ Publish"}</button></>}
                      {tab === "vehicles" && <><button type="button" title="Move up" aria-label={`Move ${row.name} up`} className={styles.moveButton} disabled={busy || actualIndex === 0} onClick={() => moveVehicle(row.id, -1)}>↑</button><button type="button" title="Move down" aria-label={`Move ${row.name} down`} className={styles.moveButton} disabled={busy || actualIndex === rows.length - 1} onClick={() => moveVehicle(row.id, 1)}>↓</button></>}
                      <button type="button" className={styles.deleteButton} disabled={busy} onClick={() => setDeleteTarget(row)}>⌫ Delete</button>
                    </div>
                  </div>
                </article>;
              })}</div>
            </section>
          </div>
        </>}
      </div>
      {deleteTarget && <div className={styles.modalOverlay} role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}><div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-heading"><div className={styles.modalIcon}>!</div><h2 id="delete-heading">Delete this entry?</h2><p><strong>{deleteTarget.name || deleteTarget.title || "Guest review"}</strong> will be permanently removed from the database. This cannot be undone.</p><div className={styles.modalActions}><button type="button" className={styles.secondary} onClick={() => setDeleteTarget(null)} disabled={busy}>Cancel</button><button type="button" className={styles.dangerSolid} onClick={remove} disabled={busy}>{busy ? "Deleting…" : "Yes, delete"}</button></div></div></div>}
    </main>
  );
}

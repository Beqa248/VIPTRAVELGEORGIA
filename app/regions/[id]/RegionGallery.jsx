"use client";

import { useRef, useState } from "react";
import styles from "./region.module.css";

export default function RegionGallery({ photos, title, labels }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(null);

  function openPhoto(src) {
    setSelected(src);
    dialog.current.showModal();
  }

  return (
    <>
      <div className={styles.gallery}>
        {photos.map((src, index) => (
          <button type="button" key={src} onClick={() => openPhoto(src)} aria-label={`${labels.openPhoto} ${index + 1}`}>
            <img src={src} alt={`${title} — ${labels.gallery} ${index + 1}`}
              loading={index === 0 ? undefined : "lazy"} decoding="async" />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className={styles.overlay} aria-label={labels.gallery}
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <button type="button" aria-label={labels.closePhoto} onClick={() => dialog.current.close()}>×</button>
        {selected && <img src={selected} alt={title} />}
      </dialog>
    </>
  );
}

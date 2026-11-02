"use client";
import { useEffect, useState } from "react";

// Delegated gallery handler: works for every original gallery and route after navigation.
export default function GalleryLightbox() {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    function onClick(event) {
      const image = event.target.closest(".gal img, .gallery img, .pic img");
      const backgroundCard = !image && event.target.closest(".card .pic");
      if (backgroundCard) {
        const css = backgroundCard.style.backgroundImage || window.getComputedStyle(backgroundCard).backgroundImage;
        const match = css.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {setPhotos([{src:match[1],alt:"Tour preview"}]);setIndex(0)}
        return;
      }
      if (!image) return;
      const gallery = image.closest(".gal, .gallery") || image.parentElement;
      const sources = [...gallery.querySelectorAll("img")].map(x => ({src:x.currentSrc || x.src,alt:x.alt})).filter(x=>x.src);
      if (!sources.length) return;
      setPhotos(sources);
      setIndex(Math.max(0,[...gallery.querySelectorAll("img")].indexOf(image)));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  useEffect(() => {
    if (!photos.length) return;
    function onKey(e) {
      if(e.key === "Escape") setPhotos([]);
      if(e.key === "ArrowLeft") setIndex(i=>(i-1+photos.length)%photos.length);
      if(e.key === "ArrowRight") setIndex(i=>(i+1)%photos.length);
    }
    document.addEventListener("keydown",onKey);
    return () => document.removeEventListener("keydown",onKey);
  },[photos]);
  if (!photos.length) return null;
  return <div className="vtg-lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" onClick={()=>setPhotos([])}>
    <button className="vtg-lightbox-close" aria-label="Close photo gallery" onClick={()=>setPhotos([])}>×</button>
    <button className="vtg-lightbox-prev" aria-label="Previous photo" onClick={e=>{e.stopPropagation();setIndex(i=>(i-1+photos.length)%photos.length)}}>‹</button>
    <img src={photos[index].src} alt={photos[index].alt || "Tour photograph"} onClick={e=>e.stopPropagation()}/>
    <button className="vtg-lightbox-next" aria-label="Next photo" onClick={e=>{e.stopPropagation();setIndex(i=>(i+1)%photos.length)}}>›</button>
    <span className="vtg-lightbox-count">{index+1} / {photos.length}</span>
  </div>;
}

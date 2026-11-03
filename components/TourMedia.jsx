"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

// Keeps the existing tour layout and photos; only overlays admin-managed media.
export default function TourMedia({ slug }) {
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    async function apply() {
      const { data, error } = await supabase.from("tour_page_media")
        .select("slug,cover_url,gallery_images")
        .eq("published", true);
      if (cancelled || error || !data) return;
      const bySlug = Object.fromEntries(data.map(item => [item.slug, item]));
      if (slug === "tours") {
        document.querySelectorAll('[data-p="tours"] .card').forEach(card => {
          const link = card.querySelector('a[href^="/"]');
          const destination = link?.getAttribute("href")?.slice(1);
         const isAirportTransfer =
  link?.getAttribute("data-r") === "Airport transfer";

const cover = isAirportTransfer
  ? bySlug["airport-transfers"]?.cover_url
  : bySlug[destination]?.cover_url;
          const picture = card.querySelector(".pic");
          if (cover && picture) picture.style.backgroundImage = `url(${JSON.stringify(cover)})`;
        });
      } else {
        const item = bySlug[slug];
        if (!item) return;
        const root = document.querySelector(`[data-p="${slug}"]`);
        if (!root) return;
        const banner = root.querySelector(".banner");
        if (banner && item.cover_url) banner.style.backgroundImage = `url(${JSON.stringify(item.cover_url)})`;
        const gallery = root.querySelector(".gal");
        if (gallery) {
          gallery.querySelectorAll('[data-admin-tour-photo="true"]').forEach(el => el.remove());
          (item.gallery_images || []).forEach((url, i) => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = `${slug} additional tour photo ${i + 1}`;
            img.loading = "lazy";
            img.dataset.adminTourPhoto = "true";
            gallery.appendChild(img);
          });
        }
      }
    }
    apply();
    return () => { cancelled = true; };
  }, [slug]);
  return null;
}

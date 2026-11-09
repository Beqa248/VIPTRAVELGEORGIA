"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

// Keeps the existing tour layout and photos; only overlays admin-managed media.
export default function TourMedia({ slug }) {
  useEffect(() => {
    if (!supabase) return;
    const root = document.querySelector(`[data-p="${CSS.escape(slug)}"]`);
    if (!root) return;
    const banner = root.querySelector(".banner");
    const gallery = root.querySelector(".gal");
    if (slug !== "tours" && !banner && !gallery) return;

    const controller = new AbortController();
    async function apply() {
      if (slug === "tours") {
        const { data, error } = await supabase.from("tour_page_media")
          .select("slug,cover_url").eq("published", true).abortSignal(controller.signal);
        if (controller.signal.aborted || error || !data) return;
        const bySlug = Object.fromEntries(data.map(item => [item.slug, item.cover_url]));
        root.querySelectorAll(".card").forEach(card => {
          const link = card.querySelector('a[href^="/"]');
          const destination = link?.getAttribute("data-r") === "Airport transfer"
            ? "airport-transfers"
            : link?.getAttribute("href")?.slice(1);
          const cover = bySlug[destination];
          const picture = card.querySelector(".pic");
          if (cover && picture) picture.style.backgroundImage = `url(${JSON.stringify(cover)})`;
        });
        return;
      }

      const { data: item, error } = await supabase.from("tour_page_media")
        .select("cover_url,gallery_images").eq("slug", slug).eq("published", true)
        .abortSignal(controller.signal).maybeSingle();
      if (controller.signal.aborted || error || !item) return;

      if (banner && item.cover_url) banner.style.backgroundImage = `url(${JSON.stringify(item.cover_url)})`;
      if (gallery) {
        gallery.querySelectorAll('[data-admin-tour-photo="true"]').forEach(el => el.remove());
        (item.gallery_images || []).forEach((url, i) => {
          const img = document.createElement("img");
          img.alt = `${slug} additional tour photo ${i + 1}`;
          img.loading = "lazy";
          img.decoding = "async";
          img.dataset.adminTourPhoto = "true";
          img.src = url;
          gallery.appendChild(img);
        });
      }
    }
    apply();
    return () => controller.abort();
  }, [slug]);
  return null;
}

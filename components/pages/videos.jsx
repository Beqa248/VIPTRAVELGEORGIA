"use client";
import TranslatedText from "../TranslatedText";
import usePublished from "../usePublished";
import { useLanguage } from "../site-context";

export default function Page() {
  const { t } = useLanguage();
  const { rows, loaded } = usePublished("videos");
  const videos = [...rows].sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity));

  return <div data-p="videos"><section><div className="wrap">
    <h2>{t("nVid")}</h2>
    <div className="grid">
      {videos.map(video => <article key={video.id} className="card">
        <video
          controls
          preload="none"
          playsInline
          poster={video.cover_url || undefined}
          style={{ display: "block", width: "100%", maxHeight: 350, aspectRatio: "16 / 9", objectFit: "contain", background: "#101715" }}
          src={video.video_url}
        />
        <div className="t">
          <h3><TranslatedText text={video.title} /></h3>
          {video.description && <p><TranslatedText text={video.description} /></p>}
        </div>
      </article>)}
    </div>
    {loaded && !videos.length && <p style={{ color: "var(--mut)" }}>{t("vidSoon")}</p>}
  </div></section></div>;
}

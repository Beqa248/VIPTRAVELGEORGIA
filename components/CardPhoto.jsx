import Image from "next/image";
import { isOptimizablePhoto } from "../lib/imageSources.mjs";

const style = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

export default function CardPhoto({ src, alt = "", sizes, className, priority = false }) {
  if (typeof src !== "string" || !src.trim()) return null;
  const url = src.trim();

  if (isOptimizablePhoto(url)) {
    return <Image src={url} alt={alt} fill sizes={sizes} quality={70} className={className} priority={priority} style={style} />;
  }

  return <img src={url} alt={alt} className={className} style={style} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />;
}

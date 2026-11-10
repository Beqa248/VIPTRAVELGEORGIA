import { storageImagePatterns } from "./lib/imageSources.mjs";

// Keep image optimizations and allow browser/CDN caches to retain
// already-optimized image variants longer across repeat visits.
const nextConfig = {
  images: {
    localPatterns: [{ pathname: "/images/**", search: "" }],
    remotePatterns: storageImagePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/viptravelgeorgia-round-logo.webp",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;

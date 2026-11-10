import { storageImagePatterns } from "./lib/imageSources.mjs";

const nextConfig = {
  images: {
    localPatterns: [{ pathname: "/images/**", search: "" }],
    remotePatterns: storageImagePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
      { source: "/viptravelgeorgia-round-logo.webp", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;

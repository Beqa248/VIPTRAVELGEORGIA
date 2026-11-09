import { storageImagePatterns } from "./lib/imageSources.mjs";

const nextConfig = {
  images: {
    localPatterns: [{ pathname: "/images/**", search: "" }],
    remotePatterns: storageImagePatterns,
  },
};

export default nextConfig;

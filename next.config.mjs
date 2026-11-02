// Keep existing /images/... references (including CSS backgrounds) working.
// Next.js proxies those requests to the public Supabase Storage bucket.
// Set NEXT_PUBLIC_SUPABASE_URL in Vercel before deploying.
const projectUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/+$/, "");

const nextConfig = {
  async rewrites() {
    if (!projectUrl) return [];
    const parsed = new URL(projectUrl);
    if (parsed.protocol !== "https:") throw new Error("NEXT_PUBLIC_SUPABASE_URL must be HTTPS");
    return [{
      source: "/images/:path*",
      destination: `${projectUrl}/storage/v1/object/public/website-images/:path*`,
    }];
  },
};

export default nextConfig;

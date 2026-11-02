
const nextConfig = {
  async rewrites() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
    }

    return [
      {
        source: "/images/:filename",
        destination:
          `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/website-images/:filename`,
      },
    ];
  },
};

export default nextConfig;

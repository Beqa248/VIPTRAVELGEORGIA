
const nextConfig = {
  async rewrites() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return [];
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

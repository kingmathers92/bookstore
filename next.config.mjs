/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    contentDispositionType: "inline",
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "").split("/")[0]],
    loader: "default",
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
    };
    return config;
  },
  reactStrictMode: true,
  suppressHydrationWarning: true,
};

export default nextConfig;
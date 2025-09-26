/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    contentDispositionType: "inline",
    domains: ["i.pravatar.cc"],
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

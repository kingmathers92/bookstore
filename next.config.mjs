/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    contentDispositionType: "inline",
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
    };
    return config;
  },
};

export default nextConfig;

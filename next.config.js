/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: new URL(
          process.env.API_PATH ??
            process.env.NEXT_PUBLIC_API_PATH ??
            'http://localhost',
        ).protocol.slice(0, -1),
        hostname: new URL(
          process.env.API_PATH ??
            process.env.NEXT_PUBLIC_API_PATH ??
            'http://localhost',
        ).hostname,
      },
    ],
  },
};

module.exports = nextConfig;

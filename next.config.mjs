/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://kudos-backend-akiz.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;

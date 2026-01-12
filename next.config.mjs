/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sosay.org',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ["api.sosay.org"],
  },
};

export default nextConfig;

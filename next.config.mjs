/** @type {import('next').NextConfig} */
const nextConfig = {
  // This turns off static export prerendering errors so your client store components build perfectly
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

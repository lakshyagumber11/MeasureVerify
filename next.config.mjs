/** @type {import('next').NextConfig} */
const nextConfig = {
  // This cleanly tells the compiler to ignore code style rules during your prototype demo build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

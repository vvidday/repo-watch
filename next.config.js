/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  typescript: {
    // Need to ignore due to errors in supabase/ folder (due to deno)
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

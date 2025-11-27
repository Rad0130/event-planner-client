/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For better deployment
  images: {
    domains: ['your-domain.com', 'images.pexels.com'], // Add your image domains
    unoptimized: true, // For static exports if needed
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
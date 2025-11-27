/** @type {import('next').NextConfig} */
const nextConfig = {
 output: 'standalone',
 images: {
   remotePatterns: [
     {
       protocol: 'https',
       hostname: '**', // Allow all external images (adjust as needed)
     },
     {
       protocol: 'https',
       hostname: 'images.pexels.com',
     },
     {
       protocol: 'https',
       hostname: 'example.com',
     },
     // Add other domains you use
   ],
   // Remove the domains array as it's deprecated
 },
 env: {
   NEXTAUTH_URL: process.env.NEXTAUTH_URL,
   NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
   GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
 },
 // Remove the experimental.appDir as it's no longer experimental in Next.js 13+
}


export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // NOTE: /api/* traffic is now handled by Next.js Route Handlers under
  // src/app/api/* (the BFF layer). They forward requests to the Express
  // backend and re-issue the auth cookie on the FRONTEND domain. No rewrite
  // proxy is used, because rewrites pass the backend's Set-Cookie through
  // unchanged (setting it on the backend domain), which broke auth in prod.
}

export default nextConfig

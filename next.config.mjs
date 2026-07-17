/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Proxy /api/* to the backend so the auth cookie is set on the FRONTEND
  // domain (first-party). This lets server-side middleware read the cookie
  // and avoids the cross-site cookie problem seen in production.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NEXT_PUBLIC_SERVER_API_URL ||
          "https://rsk-backend-api.vercel.app/api/:path*",
      },
    ];
  },
}

export default nextConfig

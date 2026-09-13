import { MetadataRoute } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, NAV_LINKS } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/favicon.ico",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/favicon.ico",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

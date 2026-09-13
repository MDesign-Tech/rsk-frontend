import { MetadataRoute } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, NAV_LINKS } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/opportunities`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mentorship`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/who`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic pages from API (news articles and opportunities)
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const newsRes = await fetch(`${baseUrl}/api/news/public?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      const articles = newsData?.data?.articles || [];
      dynamicPages = articles.map((article: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/blog/news/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // API not available at build time
  }

  try {
    const oppRes = await fetch(`${baseUrl}/api/opportunities/public?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (oppRes.ok) {
      const oppData = await oppRes.json();
      const opportunities = oppData?.data?.opportunities || [];
      const oppPages = opportunities.map((opp: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/blog/opportunities/${opp.slug}`,
        lastModified: new Date(opp.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...oppPages];
    }
  } catch {
    // API not available at build time
  }

  return [...staticPages, ...dynamicPages];
}

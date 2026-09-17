import { MetadataRoute } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, NAV_LINKS } from "@/lib/seo";

// Map NAV_LINKS to sitemap entries, filtering out hash-only links
function getStaticPages(): MetadataRoute.Sitemap {
  const priorityMap: Record<string, number> = {
    "/": 1.0,
    "/contact": 0.8,
    "/blog/news": 0.9,
    "/blog/opportunities": 0.8,
    "/mentorship": 0.7,
    "/about/who": 0.7,
    "/about/team": 0.6,
    "/about/partners": 0.5,
  };
  const freqMap: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
    "/": "daily",
    "/contact": "monthly",
    "/blog/news": "weekly",
    "/blog/opportunities": "weekly",
    "/mentorship": "monthly",
    "/about/who": "monthly",
    "/about/team": "monthly",
    "/about/partners": "monthly",
  };

  return NAV_LINKS
    .filter((link) => !link.href.startsWith("#"))
    .map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified: new Date(),
      changeFrequency: freqMap[link.href] || "monthly",
      priority: priorityMap[link.href] || 0.5,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticPages = getStaticPages();

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

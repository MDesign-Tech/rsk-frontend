import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicNewsService, type PublicNewsArticle } from "@/services/public-news.service";
import {
  createArticleSchema,
  createPageMetadata,
  getCanonicalUrl,
} from "@/lib/seo";
import ArticleClient from "./ArticleClient";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  let article: PublicNewsArticle | null = null;
  try {
    const res = await publicNewsService.getBySlug(slug);
    article = res.data.article;
  } catch {
    // If the article can't be fetched, fall back to generic metadata.
  }

  if (!article) {
    return createPageMetadata(
      "Article Not Found",
      "The requested article could not be found.",
      `/blog/news/${slug}`,
    );
  }

  const title = article.title;
  const description =
    (typeof article.content === "string"
      ? article.content.replace(/<[^>]*>/g, "").slice(0, 160)
      : "") || "Read the latest from RSK Associates.";
  const image = article.coverImage || `${getCanonicalUrl("/")}/rsk-logo.svg`;

  return createPageMetadata(
    title,
    description,
    `/blog/news/${article.slug}`,
    {
      type: "article",
      image: {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: [],
    },
  );
}

export default async function NewsArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  let article: PublicNewsArticle | null = null;
  try {
    const res = await publicNewsService.getBySlug(slug);
    article = res.data.article;
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const categoryName =
    typeof article.category === "string"
      ? article.category
      : article.category?.name;

  const schema = createArticleSchema(
    article.title,
    (typeof article.content === "string"
      ? article.content.replace(/<[^>]*>/g, "").slice(0, 160)
      : "") || "Read the latest from RSK Associates.",
    article.author.name,
    article.publishedAt,
    article.updatedAt,
    article.coverImage || `${getCanonicalUrl("/")}/rsk-logo.svg`,
    getCanonicalUrl(`/blog/news/${article.slug}`),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ArticleClient slug={slug} />
    </>
  );
}

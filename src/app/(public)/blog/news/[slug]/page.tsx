"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { publicNewsService, type PublicNewsArticle } from "@/services/public-news.service";
import { toast } from "sonner";
import DOMPurify from "isomorphic-dompurify";

const RSK_LOGO = "/rsk-logo.svg";

// Skeleton loader for article page - clean minimal layout
function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Image skeleton */}
        <div className="w-full h-64 md:h-80 bg-muted rounded-lg mb-8" />
        {/* Title skeleton */}
        <div className="h-8 bg-muted rounded w-3/4 mb-4" />
        <div className="h-8 bg-muted rounded w-1/2 mb-8" />
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>
        {/* Metadata skeleton */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/60">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        {/* Back button skeleton */}
        <div className="mt-8">
          <div className="h-10 bg-muted rounded w-40" />
        </div>
      </div>
    </div>
  );
}

export default function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<PublicNewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await publicNewsService.getBySlug(slug);
      setArticle(res.data.article);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load article");
      toast.error(err instanceof Error ? err.message : "Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <ArticleSkeleton />
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog/news"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← Back to News
          </Link>
        </div>
      </main>
    );
  }

  const categoryName = typeof article.category === "string"
    ? article.category
    : article.category?.name;

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const authorRole = article.author.role;

  const articleAge = (() => {
    const now = new Date();
    const published = new Date(article.publishedAt);
    const diffMs = now.getTime() - published.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
  })();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Article Image */}
        {article.coverImage ? (
          <div className="mb-8">
            <Image
              src={article.coverImage}
              alt={article.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg object-cover"
              priority
            />
          </div>
        ) : (
          <div className="mb-8 flex items-center justify-center rounded-lg bg-muted py-12">
            <Image
              src={RSK_LOGO}
              alt="RSK Associates"
              width={120}
              height={120}
              className="opacity-60"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {article.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-foreground/90 leading-relaxed mb-10"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              typeof article.content === "string" ? article.content : ""
            ),
          }}
        />

        {/* Metadata Row */}
        <div className="flex items-center justify-between pt-6 border-t border-border/60 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {article.author.name}
            </span>
            {authorRole && (
              <span className="text-sm text-muted-foreground">
                · {authorRole}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {categoryName} · {publishedDate} · {articleAge}
          </span>
        </div>

        {/* Back Button */}
        <div>
          <Link
            href="/blog/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            ← Back to All News
          </Link>
        </div>
      </div>
    </main>
  );
}

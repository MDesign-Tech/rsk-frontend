"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { publicNewsService, type PublicNewsArticle } from "@/services/public-news.service";
import { toast } from "sonner";

const RSK_LOGO = "/rsk-logo.svg";

// Skeleton loader for article page - looks like real article layout
function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero image skeleton with centered fallback */}
      <div className="relative h-64 md:h-96 w-full bg-muted flex items-center justify-center">
        <div className="w-20 h-20 bg-muted-foreground/10 rounded-full" />
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Category and date row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        {/* Title */}
        <div className="h-8 bg-muted rounded w-3/4 mb-4" />
        <div className="h-8 bg-muted rounded w-1/2 mb-6" />
        {/* Author row */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/60">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-3 bg-muted rounded w-24" />
          </div>
        </div>
        {/* Excerpt box */}
        <div className="mb-8 p-4 bg-muted/50 rounded-xl border-l-4 border-primary/30">
          <div className="h-4 bg-muted rounded w-full mb-2" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        {/* Content paragraphs */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
        {/* Stats row */}
        <div className="mt-10 pt-6 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-6">
            <div className="h-4 bg-muted rounded w-16" />
            <div className="h-4 bg-muted rounded w-12" />
            <div className="h-4 bg-muted rounded w-14" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 w-full bg-muted">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <Image
              src={RSK_LOGO}
              alt="RSK Associates"
              width={120}
              height={120}
              className="opacity-50"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg p-6 md:p-10">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-sm text-muted-foreground">
              {article.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {article.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/60">
            <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden">
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <Image
                    src={RSK_LOGO}
                    alt="RSK"
                    width={24}
                    height={24}
                    className="opacity-50"
                  />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{article.author.name}</p>
              {article.author.role && (
                <p className="text-xs text-muted-foreground">{article.author.role}</p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-8 p-4 bg-muted/50 rounded-xl border-l-4 border-primary">
            <p className="text-lg text-foreground/90 italic">{article.excerpt}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {typeof article.content === "string" ? (
              <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {article.content}
              </div>
            ) : (
              <div className="text-foreground/90 leading-relaxed">
                {JSON.stringify(article.content, null, 2)}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-10 pt-6 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>{article.views} views</span>
              <span>{article.likes} likes</span>
              <span>{article.shares} shares</span>
              <span>{article.commentsCount} comments</span>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link
              href="/blog/news"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              ← Back to all news
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { newsService } from "@/services/news";
import type { NewsArticle } from "@/types";
import { LoadingSpinner } from "@/components/admin/loading-spinner";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    newsService
      .getBySlug(slug)
      .then((res) => {
        if (active) setArticle(res);
      })
      .catch(() => {
        if (active) setNotFoundState(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (notFoundState || !article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Hero Image */}
          <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden mb-8">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {article.category}
            </span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{article.readingTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
            {article.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/60">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{article.author.name}</p>
              <p className="text-sm text-muted-foreground">{article.author.role}</p>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Back Link */}
          <a
            href="/blog/news"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            ← Back to News
          </a>
        </div>
      </article>
    </main>
  );
}

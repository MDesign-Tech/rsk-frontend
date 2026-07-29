"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  publicNewsService,
  type PublicNewsArticle,
} from "@/services/public-news.service";
import { toast } from "sonner";

const RSK_LOGO = "/rsk-logo.svg";

const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .trim();
};

// Skeleton loader for news cards - looks like real data layout
function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card shadow-sm animate-pulse">
      <div className="h-64 md:h-56 w-full bg-muted" />
      <div className="p-3">
        <div className="h-5 bg-muted rounded w-4/5 mb-2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}

// Skeleton for sidebar - looks like real article list
function SidebarSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm animate-pulse space-y-5">
      <div className="h-6 bg-muted rounded w-1/3" />
      <div className="flex gap-2">
        <div className="h-8 bg-muted rounded-full w-20" />
        <div className="h-8 bg-muted rounded-full w-24" />
        <div className="h-8 bg-muted rounded-full w-20" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<PublicNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const [tab, setTab] = useState<"week" | "month" | "all">("all");

  useEffect(() => {
    loadArticles();
  }, [currentPage]);

  // Scroll to top of content when page changes
  useEffect(() => {
    const contentSection = document.querySelector("section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const res = await publicNewsService.getAll({
        page: currentPage,
        limit: itemsPerPage,
      });
      setArticles(res.data.articles);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles by time period based on publishedAt
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filteredArticles = articles.filter((article) => {
    const published = new Date(article.publishedAt);
    if (tab === "week") return published >= weekAgo;
    if (tab === "month") return published >= monthAgo;
    return true;
  });

  const currentArticles = articles;

  function getCategoryClasses(category: string | undefined) {
    const name = (typeof category === "string" ? category : "").toLowerCase();
    switch (name) {
      case "technology":
      case "tech":
        return "bg-purple-600 text-white";
      case "finance":
        return "bg-blue-600 text-white";
      case "business":
        return "bg-green-600 text-white";
      case "marketing":
        return "bg-pink-600 text-white";
      default:
        return "bg-sky-500 text-white";
    }
  }
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>News & updates</span>
            <svg
              width="223"
              height="12"
              viewBox="0 0 223 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-1.5 left-10 -z-1 max-lg:left-4 max-md:hidden"
            >
              <path
                d="M1.30466 10.7431C39.971 5.28788 76.0949 3.02 115.082 2.30401C143.893 1.77489 175.871 0.628649 204.399 3.63102C210.113 3.92052 215.332 4.91391 221.722 6.06058"
                stroke="url(#paint0_linear_10365_68643)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_10365_68643"
                  x1="19.0416"
                  y1="4.03539"
                  x2="42.8362"
                  y2="66.9459"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.2" stop-color="var(--color-primary)" />
                  <stop offset="1" stop-color="var(--color-primary-content)" />
                </linearGradient>
              </defs>
            </svg>
          </h1>
          <p className="text-lg text-base-content/80 max-w-3xl">
            Latest updates & stories from RSK Associates.
          </p>
        </div>
      </div>
      <br />
      <br />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8">
            <div className="space-y-6">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              ) : currentArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No articles found for this time period.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {currentArticles.map((article) => (
                      <article
                        key={article._id}
                        className="rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative overflow-hidden rounded-t-2xl h-64 md:h-56">
                          <Link
                            href={`/blog/news/${article.slug}`}
                            className="absolute inset-0 block h-full w-full"
                          >
                            {article.coverImage ? (
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Image
                                  src={RSK_LOGO}
                                  alt="RSK Associates"
                                  width={80}
                                  height={80}
                                  className="opacity-50"
                                />
                              </div>
                            )}
                          </Link>

                          <div
                            className={`absolute left-3 top-3 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryClasses(typeof article.category === "string" ? article.category : article.category?.name)}`}
                          >
                            {typeof article.category === "string"
                              ? article.category
                              : article.category?.name}
                          </div>

                          <div
                            className="absolute left-0 bottom-0 w-full h-12 bg-linear-to-t from-black/50 to-transparent"
                            aria-hidden
                          />
                          <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 text-xs text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l2 2"
                              />
                              <path
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              {article.author?.name ?? ""}
                            </span>
                            <span className="text-sm opacity-80">•</span>
                            <time className="text-sm">
                              {new Date(
                                article.publishedAt,
                              ).toLocaleDateString()}
                            </time>
                          </div>
                        </div>

                        <div className="p-3">
                          <Link href={`/blog/news/${article.slug}`}>
                            <h2 className="text-lg font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
                              {article.title}
                            </h2>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/60">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        ← Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "border border-border/60 text-foreground hover:bg-muted"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

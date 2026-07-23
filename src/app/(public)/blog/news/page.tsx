"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { publicNewsService, type PublicNewsArticle } from "@/services/public-news.service";
import { toast } from "sonner";

const RSK_LOGO = "/rsk-logo.svg";

// Skeleton loader for news cards - looks like real data layout
function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm animate-pulse">
      <div className="relative h-40 w-full bg-muted flex items-center justify-center">
        <div className="w-16 h-16 bg-muted-foreground/10 rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-12" />
        </div>
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
  }, [currentPage, tab]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const res = await publicNewsService.getAll({ page: currentPage, limit: itemsPerPage });
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

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
          <p className="text-base-content/80 max-w-3xl">
            Latest updates & stories from RSK Associates.
          </p>
        </div>
      </div>
      <br />
      <br />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              ) : currentArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found for this time period.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {currentArticles.map((article) => (
                      <article
                        key={article._id}
                        className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Link href={`/blog/news/${article.slug}`}>
                          <div className="relative h-40 w-full bg-muted">
                            {article.coverImage ? (
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-muted">
                                <Image
                                  src={RSK_LOGO}
                                  alt="RSK Associates"
                                  width={80}
                                  height={80}
                                  className="opacity-50"
                                />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/blog/news/${article.slug}`}>
                            <h2 className="text-lg font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                              {article.title}
                            </h2>
                          </Link>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{article.author.name}</span>
                            <span>•</span>
                            <time dateTime={article.publishedAt}>
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </time>
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                            {article.excerpt}
                          </p>
                          <Link
                            href={`/blog/news/${article.slug}`}
                            className="mt-3 inline-block text-primary font-medium text-xs hover:underline"
                          >
                            Read more →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filteredArticles.length > itemsPerPage && (
                    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/60">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        ← Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.ceil(filteredArticles.length / itemsPerPage) }, (_, i) => i + 1).map(
                          (page) => (
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
                          ),
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(Math.ceil(filteredArticles.length / itemsPerPage), currentPage + 1))
                        }
                        disabled={currentPage === Math.ceil(filteredArticles.length / itemsPerPage)}
                        className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="md:col-span-1">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Articles</h3>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setTab("week"); setCurrentPage(1); }}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "week" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"}`}
                  >
                    This week
                  </button>
                  <button
                    onClick={() => { setTab("month"); setCurrentPage(1); }}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "month" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"}`}
                  >
                    This month
                  </button>
                  <button
                    onClick={() => { setTab("all"); setCurrentPage(1); }}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "all" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"}`}
                  >
                    All the time
                  </button>
                </div>

                <ul className="mt-4 space-y-3">
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="h-4 bg-muted rounded animate-pulse" />
                    ))
                  ) : (
                    filteredArticles.slice(0, 10).map((article) => (
                      <li
                        key={article._id}
                        className="text-sm text-foreground/90 hover:text-primary transition-colors"
                      >
                        <Link href={`/blog/news/${article.slug}`} className="line-clamp-2">
                          {article.title}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

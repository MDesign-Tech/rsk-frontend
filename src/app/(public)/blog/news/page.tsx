"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState } from "react";

const sampleNews = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    title: "RSK expands into new markets",
    writer: "By Jane Doe",
    date: "2026-06-12",
    excerpt:
      "RSK Associates announced today a strategic expansion into new regional markets, focusing on advisory services for growing SMEs...",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    title: "New insight report: funding trends",
    writer: "By John Smith",
    date: "2026-05-02",
    excerpt:
      "A new report highlights evolving funding trends and how companies can prepare their capital structure for the next cycle...",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    title: "Digital transformation strategies",
    writer: "By Sarah Johnson",
    date: "2026-04-15",
    excerpt:
      "Explore how companies are leveraging digital tools to streamline operations and improve customer engagement...",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    title: "Sustainability in business",
    writer: "By Michael Brown",
    date: "2026-03-20",
    excerpt:
      "Learn about the latest sustainability initiatives and how businesses can reduce their environmental impact...",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    title: "Scaling your startup efficiently",
    writer: "By Emily Davis",
    date: "2026-02-28",
    excerpt:
      "Key strategies for startups to scale operations without compromising quality or culture...",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    title: "Market analysis: Q2 trends",
    writer: "By David Wilson",
    date: "2026-02-10",
    excerpt:
      "A comprehensive analysis of market trends and what they mean for your business strategy...",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    title: "Building effective leadership teams",
    writer: "By Lisa Anderson",
    date: "2026-01-25",
    excerpt:
      "Discover the components of successful leadership teams and how to develop them...",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    title: "Investment strategies for growth",
    writer: "By Robert Taylor",
    date: "2026-01-10",
    excerpt:
      "Understanding different investment approaches to accelerate your business growth...",
  },
];

const sampleArticles = {
  week: [
    "How to build resilient cash flow",
    "Negotiation tactics for founders",
  ],
  month: ["Managing tax in uncertain times", "Hiring for scale"],
  all: [
    "Financial planning 101",
    "Governance best practices",
    "Investor readiness",
  ],
};

export default function NewsPage() {
  const [tab, setTab] = useState<"week" | "month" | "all">("week");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(sampleNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = sampleNews.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          {/* <div className="bg-base-200 border-base-content/20 flex w-fit items-center gap-2.5 rounded-full border px-3 py-2">
            <span className="badge badge-primary shrink-0 rounded-full">Our team</span>
          </div> */}
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
            Latest updates & stories .
          </p>
        </div>
      </div>
      <br />
      <br />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {/* <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-semibold">News</h1>
            <p className="text-sm text-muted-foreground">
              Latest updates & stories
            </p>
          </div> */}

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {/* News Grid - 2 Columns */}
              <div className="grid gap-6 md:grid-cols-2">
                {currentNews.map((n) => (
                  <article
                    key={n.id}
                    className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={n.image}
                        alt={n.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                        {n.title}
                      </h2>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{n.writer}</span>
                        <span>•</span>
                        <time dateTime={n.date}>
                          {new Date(n.date).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {n.excerpt}
                      </p>
                      <a
                        className="mt-3 inline-block text-primary font-medium text-xs"
                        href={`/blog/news/${n.id}`}
                      >
                        Read more →
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/60">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            <aside className="md:col-span-1">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Articles</h3>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setTab("week")}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "week" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}
                  >
                    This week
                  </button>
                  <button
                    onClick={() => setTab("month")}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "month" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}
                  >
                    This month
                  </button>
                  <button
                    onClick={() => setTab("all")}
                    className={`rounded-full px-3 py-1 text-sm ${tab === "all" ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}
                  >
                    All the time
                  </button>
                </div>

                <ul className="mt-4 space-y-3">
                  {(sampleArticles as any)[tab].map((a: string) => (
                    <li
                      key={a}
                      className="text-sm text-foreground/90 hover:text-primary transition-colors"
                    >
                      <a href="#">{a}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

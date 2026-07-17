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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-semibold">News</h1>
            <p className="text-sm text-muted-foreground">
              Latest updates & stories
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {sampleNews.map((n) => (
                <article
                  key={n.id}
                  className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm"
                >
                  <div className="relative h-56 w-full">
                    <Image
                      src={n.image}
                      alt={n.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      {n.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{n.writer}</span>
                      <span>•</span>
                      <time dateTime={n.date}>
                        {new Date(n.date).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {n.excerpt.slice(0, 160)}...
                      <a
                        className="ml-2 text-primary font-medium"
                        href={`/blog/news/${n.id}`}
                      >
                        Read more
                      </a>
                    </p>
                  </div>
                </article>
              ))}
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

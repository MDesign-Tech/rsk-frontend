import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,156,219,0.16),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/images/7.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-lg backdrop-blur">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Media • Blog
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Latest insights and updates
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Explore practical articles, market updates, and thought leadership
              from the RSK Associates team.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Financial planning for growth",
                  description:
                    "How structured advisory helps founders prepare for scale.",
                },
                {
                  title: "Tax efficiency in changing markets",
                  description:
                    "Practical steps to strengthen cash flow and resilience.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-card p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

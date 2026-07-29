"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";
import { publicOpportunityService } from "@/services/public-opportunity.service";
import type { Opportunity } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RSK_LOGO = "/rsk-logo.svg";

export default function OpportunitiesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    loadData();
  }, [currentPage]);

  // Scroll to top of content when page changes
  useEffect(() => {
    const contentSection = document.querySelector('section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const oppRes = await publicOpportunityService.getAll({ page: currentPage, limit: itemsPerPage });
      setOpportunities(oppRes.data.opportunities);
      setTotalPages(oppRes.data.totalPages);
      setTotal(oppRes.data.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeName = (type: Opportunity["type"]): string => {
    if (typeof type === "string") return type;
    return type.name;
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>Opportunities</span>
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
            Find jobs, internships, tenders, and training with RSK. Discover
            curated opportunities designed for professionals and businesses
            ready to grow, learn, and partner with industry leaders.
          </p>
        </div>
      </div>
      <br />
      <br />

      {/* <SectionDivider variant="wave" /> */}

      {isLoading ? (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mb-8 h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="rounded-3xl border border-border/60 bg-card animate-pulse">
                  <div className="relative h-56 w-full bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-20" />
                    <div className="h-6 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : opportunities.length === 0 ? (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">No opportunities found.</p>
          </div>
        </section>
      ) : (
        <>
          <section className="py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              
              <div className="grid gap-6 md:grid-cols-2">
                {opportunities.map((item) => (
                  <motion.article
                    key={item._id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg shadow-slate-950/10"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
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
                    <div className="p-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                        {getTypeName(item.type)}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.org} •{" "}
                        <time>{new Date(item.date).toLocaleDateString()}</time>
                      </p>
                      {item.description && (
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <Link
                        href={`/contact`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-100"
                      >
                        Apply now
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
            {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-evenly gap-4 mt-8 pt-6">
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
          )}
          </section>
        </>
      )}
    </main>
  );
}

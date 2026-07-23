"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";
import { useState, useEffect } from "react";
import { publicOpportunityService, type PublicOpportunity } from "@/services/public-opportunity.service";
import { toast } from "sonner";

const RSK_LOGO = "/rsk-logo.svg";

// Skeleton loader for opportunity cards
function OpportunityCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg shadow-slate-950/10"
    >
      <div className="relative h-56 w-full bg-muted animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
      </div>
    </motion.div>
  );
}

const typeColors: Record<string, string> = {
  Tender: "bg-blue-500/10 text-blue-300",
  Job: "bg-green-500/10 text-green-300",
  Internship: "bg-purple-500/10 text-purple-300",
  Consultancy: "bg-orange-500/10 text-orange-300",
  Training: "bg-teal-500/10 text-teal-300",
  Event: "bg-pink-500/10 text-pink-300",
  RFP: "bg-cyan-500/10 text-cyan-300",
  RFQ: "bg-yellow-500/10 text-yellow-300",
  EOI: "bg-indigo-500/10 text-indigo-300",
};

export default function OpportunitiesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [opportunities, setOpportunities] = useState<PublicOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const res = await publicOpportunityService.getAll();
      setOpportunities(res.data.opportunities);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load opportunities");
    } finally {
      setIsLoading(false);
    }
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

      <SectionDivider variant="wave" />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No opportunities available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {opportunities.map((opportunity, index) => (
                <motion.article
                  key={opportunity._id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg shadow-slate-950/10"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    {opportunity.image ? (
                      <Image
                        src={opportunity.image}
                        alt={opportunity.title}
                        fill
                        className="object-cover"
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
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${typeColors[opportunity.type] || "bg-muted text-muted-foreground"}`}>
                      {opportunity.type}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">
                      {opportunity.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {opportunity.organization.name} •{" "}
                      <time>{new Date(opportunity.deadline).toLocaleDateString()}</time>
                    </p>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground line-clamp-2">
                      {opportunity.shortDescription}
                    </p>
                    <Link
                      href="/contact"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-100"
                    >
                      Apply now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
      <SectionDivider variant="diagonal" />

      <section className="bg-sky-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-4xl border border-sky-500/20 bg-sky-950/95 p-10 shadow-[0_40px_120px_-50px_rgba(14,116,232,0.65)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <h2 className="text-4xl font-semibold">
                  Ready to apply for your next opportunity?
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-200">
                  Submit your interest today and let our team connect you with
                  relevant jobs, internships, tenders, or training programs.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Apply now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

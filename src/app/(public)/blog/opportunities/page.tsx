"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";

const opportunities = [
  {
    id: 1,
    category: "Jobs",
    type: "Job",
    title: "Senior Financial Analyst",
    org: "RSK Associates",
    date: "2026-06-20",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    category: "Tenders",
    type: "Tender",
    title: "Supply of audit services",
    org: "Ministry of Finance",
    date: "2026-07-01",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
];

const internships = [
  {
    id: 3,
    type: "Internship",
    title: "Corporate Advisory Intern",
    org: "RSK Associates",
    date: "2026-07-12",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
  },
];

const training = [
  {
    id: 4,
    type: "Training",
    title: "Financial Leadership Workshop",
    org: "RSK Academy",
    date: "2026-08-05",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function OpportunitiesPage() {
  const shouldReduceMotion = useReducedMotion();

  const sectionCards = [
    {
      title: "Jobs",
      items: opportunities.filter((item) => item.type === "Job"),
    },
    { title: "Internships", items: internships },
    {
      title: "Tenders",
      items: opportunities.filter((item) => item.type === "Tender"),
    },
    { title: "Training Opportunities", items: training },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          {/* <div className="bg-base-200 border-base-content/20 flex w-fit items-center gap-2.5 rounded-full border px-3 py-2">
            <span className="badge badge-primary shrink-0 rounded-full">Our team</span>
          </div> */}
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
        <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16">
          {sectionCards.map((section) => (
            <div key={section.title}>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold">{section.title}</h2>
                  <p className="mt-2 text-muted-foreground">
                    Carefully selected openings and programs that match our
                    corporate audience.
                  </p>
                </div>
                <div className="rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
                  {section.items.length} listings
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {section.items.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg shadow-slate-950/10"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                        {item.type}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.org} •{" "}
                        <time>{new Date(item.date).toLocaleDateString()}</time>
                      </p>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        A premium opportunity for professionals seeking impact,
                        growth, and valuable experience.
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
            </div>
          ))}
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

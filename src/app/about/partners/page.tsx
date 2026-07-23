"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { useWebsiteStore } from "@/stores/website.store";
import { Building, Handshake, Sparkles } from "lucide-react";
import { SectionDivider } from "@/components/section-divider";

export default function PartnersPage() {
  const hero = useWebsiteStore((state) => state.data?.hero);
  const about = useWebsiteStore((state) => state.data?.about);
  const partners = useWebsiteStore((state) => state.data?.partners) ?? [];
  const shouldReduceMotion = useReducedMotion();

  const coverImage = hero?.image || "/images/8.jpg";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>Partner overview</span>
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
            Strategic partnerships focused on growth. We partner with businesses
            that value transparent collaboration, market expansion, and reliable
            advisory support. Together, we unlock new tender opportunities,
            strengthen operations, and scale with confidence.
          </p>
        </div>
      </section>
      <SectionDivider variant="wave" />

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
              Partners logos
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
              Organisations that trust RSK.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {partners
              .filter((p) => p.visible !== false)
              .map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card/70 p-6"
                >
                  {p.image ? (
                    <div className="h-20 w-full overflow-hidden rounded-2xl bg-white/5">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={200}
                        height={80}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : null}
                  <span className="text-sm font-semibold text-foreground text-center">
                    {p.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-sky-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center rounded-4xl border border-sky-500/20 bg-sky-950/95 p-10 shadow-[0_40px_120px_-50px_rgba(14,116,232,0.65)]">
            <div>
              <h2 className="text-4xl font-semibold">
                Become a partner and expand your reach.
              </h2>
              <p className="mt-4 text-lg text-slate-200 leading-8">
                Engage with a corporate network that amplifies your services,
                uncovers joint tenders, and provides a premium support
                ecosystem.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:items-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Partner with us
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Request partnership details
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="curve" />
    </main>
  );
}

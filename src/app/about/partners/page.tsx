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

      <section className="relative overflow-hidden pt-28 pb-24">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950/70 via-sky-950/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_0.85fr] items-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <span className="text-sm uppercase tracking-[0.35em] text-sky-400">
                Our partners
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Built together with enterprise-level partners.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {about?.description ??
                  "We create value through strategic collaboration, mutual trust, and shared market expertise."}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Become a partner
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center rounded-full border border-sky-300/40 bg-white/5 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-200/60"
                >
                  Partner benefits
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="rounded-4xl overflow-hidden border border-white/10 bg-white/10 shadow-[0_30px_80px_-40px_rgba(14,116,232,0.6)]"
            >
              <div className="relative h-96 w-full">
                <Image
                  src={coverImage}
                  alt="Partners hero"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" />

      <section className="border-t border-border/70 bg-slate-950/5 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-4xl border border-white/10 bg-white/10 p-10 backdrop-blur-xl"
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/10 px-4 py-2 text-sky-300 text-sm font-semibold">
                <Handshake className="h-4 w-4" />
                Partner overview
              </div>
              <h2 className="mt-6 text-3xl font-semibold">
                Strategic partnerships focused on growth.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                We partner with businesses that value transparent collaboration,
                market expansion, and reliable advisory support. Together, we
                unlock new tender opportunities, strengthen operations, and
                scale with confidence.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-4xl border border-white/10 bg-slate-950/90 p-10"
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/10 px-4 py-2 text-sky-300 text-sm font-semibold">
                <Building className="h-4 w-4" />
                What you gain
              </div>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  Access curated introductions to high-value contracts and
                  cross-sector collaboration.
                </p>
                <p className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  Strengthen your reputation through aligned partner offerings
                  and shared business intelligence.
                </p>
                <p className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  Share resources, capabilities, and training opportunities
                  within our trusted member network.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <SectionDivider variant="dotted" />

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

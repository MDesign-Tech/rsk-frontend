"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Target, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";
import { useWebsiteStore } from "@/stores/website.store";

export default function WhoPage() {
  const about = useWebsiteStore((state) => state.data?.about);
  const mv = useWebsiteStore((state) => state.data?.missionVision);
  const hero = useWebsiteStore((state) => state.data?.hero);
  const shouldReduceMotion = useReducedMotion();

  const coverImage = hero?.image || "/images/5.jpeg";
  const coreValues = [
    "Integrity in every engagement",
    "Client-first strategic thinking",
    "Data-driven decision support",
    "Collaborative execution for growth",
  ];

  const objectives = [
    "Deliver measurable business impact with every partnership.",
    "Expand access to tenders, funding, and training for members.",
    "Make complex financial strategy clear and actionable.",
    "Build trusted, long-term corporate relationships.",
  ];

  const impactStats = about?.stats
    ?.filter((item) => item.visible !== false)
    .slice(0, 4)
    .map((stat) => ({
      label: stat.label,
      value: stat.number || stat.value || "—",
    })) ?? [
    { value: "150+", label: "Companies served" },
    { value: "95%", label: "Client satisfaction" },
    { value: "8+", label: "Years of experience" },
    { value: "25+", label: "Global partners" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div class="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div class="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          {/* <div class="bg-base-200 border-base-content/20 flex w-fit items-center gap-2.5 rounded-full border px-3 py-2">
            <span class="badge badge-primary shrink-0 rounded-full">Our team</span>
          </div> */}
          <h1 class="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>Who we are</span>
            <svg
              width="223"
              height="12"
              viewBox="0 0 223 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute -bottom-1.5 left-10 -z-1 max-lg:left-4 max-md:hidden"
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
          <p class="text-base-content/80 max-w-3xl">
            Our team blends corporate advisory experience, financial discipline,
            and practical execution to deliver solutions that help businesses
            move forward with confidence.
          </p>
        </div>
      </div>
      <br />
      <br />

      <section className="relative overflow-hidden pt-28 pb-24">
        <div className="absolute inset-0 bg-linear-to-br bg-sky-50 bg-sky-50 to-transparent" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(14,116,232,0.18),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <span className="text-sm uppercase tracking-[0.35em] text-sky-400">
                Who we are
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {about?.title ?? "RSK Associates"}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {about?.description ??
                  "RSK Associates is a corporate advisory collective that helps businesses navigate growth, finance, and strategy with confidence."}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Talk to our team
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
                  alt="Who we are"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <SectionDivider variant="wave" /> */}
      <section className="relative overflow-hidden border-t border-border/70 bg-sky-50 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-4xl border border-white/10 bg-sky-50 p-10 backdrop-blur-xl"
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-50 px-4 py-2 text-sky-300 text-sm font-semibold">
                <Globe className="h-4 w-4" />
                Our Story
              </div>
              <h2 className="mt-6 text-3xl font-semibold">
                A corporate advisory firm built for modern growth.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Our story began with a single mission: to make professional
                financial strategy accessible, effective, and practical for
                businesses of every size. We bring data, diligence, and
                experience together to deliver clarity and confidence.
              </p>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="rounded-4xl border border-white/10 bg-white/10 p-10 backdrop-blur-xl"
              >
                <span className="inline-flex items-center gap-2 text-sky-300 text-sm font-semibold uppercase tracking-[0.35em] mb-4">
                  <Target className="h-4 w-4" />
                  Vision & Mission
                </span>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">Vision</h3>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {mv?.visionDescription ??
                        "Create a thriving corporate ecosystem where strategy, resources, and opportunity align for every client."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Mission</h3>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {mv?.missionDescription ??
                        "Empower businesses with tailored financial guidance, modern advisory tools, and trusted strategic partnerships."}
                    </p>
                  </div>
                </div>
              </motion.div>

              
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="gradient" />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-1">

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-4xl border border-white/10 bg-slate-950/5 p-10"
            >
              <h2 className="text-3xl font-semibold">Impact Statistics</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {impactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
                  >
                    <p className="text-4xl font-bold text-sky-400">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-sky-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-center rounded-4xl border border-sky-500/20 bg-sky-950/95 p-10 shadow-[0_40px_120px_-50px_rgba(14,116,232,0.65)]">
            <div>
              <h2 className="text-4xl font-semibold">
                Partner with RSK for business-ready results.
              </h2>
              <p className="mt-4 text-lg text-slate-200 leading-8">
                Our advisory approach combines corporate strategy, funding
                access, and operational support to help your business move
                securely toward its next milestone.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:items-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Contact us
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Become a member
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

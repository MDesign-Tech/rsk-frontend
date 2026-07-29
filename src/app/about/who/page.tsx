"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, Target } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";
import { useWebsiteStore } from "@/stores/website.store";

export default function WhoPage() {
  const about = useWebsiteStore((state) => state.data?.about);
  const mv = useWebsiteStore((state) => state.data?.missionVision);
  const hero = useWebsiteStore((state) => state.data?.hero);
  const shouldReduceMotion = useReducedMotion();

  const coverImage = hero?.image || "/images/5.jpeg";

  const impactStats = about?.stats
    ?.filter((item) => item.visible !== false)
    .slice(0, 4)
    .map((stat) => ({
      label: stat.label,
      value: stat.number || "—",
    })) ?? [
    { value: "150+", label: "Companies served" },
    { value: "95%", label: "Client satisfaction" },
    { value: "8+", label: "Years of experience" },
    { value: "25+", label: "Global partners" },
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
            <span>Who we are</span>
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
            Our team blends corporate advisory experience, financial discipline,
            and practical execution to deliver solutions that help businesses
            move forward with confidence.
          </p>
        </div>
      </div>
      <br />
      <br />

      <section className="relative overflow-hidden pt-28 pb-24 bg-muted/70 dark:bg-muted/40">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent dark:from-primary/20" />
        <div className="absolute inset-0 opacity-45 dark:opacity-30 bg-[radial-gradient(circle_at_top_left,var(--color-primary)/0.12,transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,var(--color-primary)/0.18,transparent_50%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <span className="text-sm uppercase tracking-[0.35em] text-primary">
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
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Talk to our team
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="rounded-4xl overflow-hidden border border-border/60 bg-card/95 dark:bg-card/90 shadow-2xl"
            >
              <div className="relative h-96 w-full">
                <Image
                  src={coverImage}
                  alt="Who we are"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent dark:from-background/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <SectionDivider variant="wave" /> */}
      <section className="relative overflow-hidden border-t border-border/70 bg-background py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-4xl border border-border/60 bg-card/95 dark:bg-card/90 p-10 backdrop-blur-xl shadow-sm"
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm font-semibold">
                <Globe className="h-4 w-4" />
                Our Story
              </div>
              <h2 className="mt-6 text-3xl font-semibold">
                {about?.ourStory?.title ??
                  "A corporate advisory firm built for modern growth."}
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {about?.ourStory?.description ??
                  "Our story began with a single mission: to make professional financial strategy accessible, effective, and practical for businesses of every size. We bring data, diligence, and experience together to deliver clarity and confidence."}
              </p>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="rounded-4xl border border-border/60 bg-card/95 dark:bg-card/90 p-10 backdrop-blur-xl shadow-sm"
              >
                <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-[0.35em] mb-4">
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
              className="rounded-4xl border border-border bg-muted p-10 dark:bg-muted/60"
            >
              <h2 className="text-3xl font-semibold">Impact Statistics</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {impactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-border/60 bg-card/95 dark:bg-card/85 p-6 text-center shadow-sm transform transition-transform hover:scale-[1.02]"
                  >
                    <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary-content dark:from-primary/80">
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
    </main>
  );
}

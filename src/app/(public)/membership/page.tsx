"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Users,
  Award,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/faq";
import { Testimonials } from "@/components/testimonials";
import { SectionDivider } from "@/components/section-divider";

const reasons = [
  "Access tailored advisory support for corporate strategy and business growth.",
  "Receive curated opportunities for tenders, training, and funding introductions.",
  "Connect with a premium network of professionals and industry leaders.",
];

const benefits = [
  {
    title: "Networking",
    detail: "High-value introductions and member-only networking events.",
  },
  {
    title: "Training",
    detail: "Workshops, certifications, and executive learning support.",
  },
  {
    title: "Business Support",
    detail:
      "Dedicated advisory resources for strategic decisions and implementation.",
  },
  {
    title: "Funding Opportunities",
    detail: "Priority access to tenders, grants, and funding pathways.",
  },
  {
    title: "Certifications",
    detail: "Professional recognition through member qualification programs.",
  },
  {
    title: "Mentorship",
    detail:
      "Personal guidance from experienced advisors and corporate leaders.",
  },
];

const requirements = [
  "A business or individual with a clear growth objective.",
  "Commitment to professional development and transparent partnership.",
  "Readiness to engage in member-led resources and events.",
];

const plans = [
  {
    title: "Associate",
    price: "$299",
    period: "/year",
    features: [
      "Access to member events",
      "Tender alerts",
      "Mentorship sessions",
    ],
  },
  {
    title: "Corporate",
    price: "$599",
    period: "/year",
    featured: true,
    features: [
      "Dedicated advisory support",
      "Priority funding introductions",
      "Executive training",
    ],
  },
  {
    title: "Enterprise",
    price: "$1,099",
    period: "/year",
    features: [
      "Custom corporate onboarding",
      "Premium partner matching",
      "Enhanced certification support",
    ],
  },
];

export default function MembershipPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative overflow-hidden pt-28 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,116,232,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-30 bg-[url('/images/8.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-4xl border border-white/10 bg-slate-950/95 p-10 shadow-[0_35px_90px_-40px_rgba(14,116,232,0.75)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
                  Membership
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">
                  Join RSK and grow with confidence.
                </h1>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </div>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Become part of a corporate network that combines strategy, funding
              access, and operational support for sustainable growth.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-sm text-muted-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* <SectionDivider variant="wave" /> */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
              Why become a member
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
              Member benefits designed for modern businesses.
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = [
                Users,
                BookOpen,
                ShieldCheck,
                Award,
                Sparkles,
                MessageCircle,
              ][index];
              return (
                <motion.div
                  key={benefit.title}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 * index }}
                  className="rounded-4xl border border-border/70 bg-card/70 p-6 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(14,116,232,0.5)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-400">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {benefit.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider variant="curve" />
      <FAQ />
      <SectionDivider variant="gradient" />
      <Testimonials />

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-4xl border border-sky-500/20 bg-sky-950/95 p-10 text-white shadow-[0_40px_120px_-50px_rgba(14,116,232,0.65)]"
          >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <h2 className="text-4xl font-semibold">
                  Apply now to join the next intake.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-200">
                  Secure your membership and receive priority access to RSK's
                  corporate programs, partner introductions, and advisory
                  resources.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                rounded="full"
                className="min-w-55 bg-white text-slate-950 hover:bg-slate-100"
              >
                <Link href="/contact">Apply now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

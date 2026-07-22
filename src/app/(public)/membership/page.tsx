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

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          <div className="bg-base-200 border-base-content/20 flex w-fit items-center gap-2.5 rounded-full border px-3 py-2">
            <span className="badge badge-primary shrink-0 rounded-full">
              Join RSK and grow with confidence.
            </span>
          </div>
          <h1 className="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>Membership</span>
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
            Become part of a corporate network that combines strategy, funding
            access, and operational support for sustainable growth.
          </p>
        </div>
      </div>
      <br />
      <br />

      <SectionDivider variant="wave" />
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

      {/* <SectionDivider variant="curve" /> */}
      <FAQ />
      {/* <SectionDivider variant="gradient" /> */}
      {/* <Testimonials /> */}


      



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

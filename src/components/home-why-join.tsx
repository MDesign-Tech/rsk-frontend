"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Users, Briefcase, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  {
    title: "Trusted corporate network",
    description:
      "Connect with established businesses, decision-makers, and strategic partners across industries.",
    icon: Users,
  },
  {
    title: "Business-ready solutions",
    description:
      "Access practical advisory services, tailored training, and funding guidance designed for growth.",
    icon: Briefcase,
  },
  {
    title: "Strategic credibility",
    description:
      "Boost your company profile through a respected membership that opens doors and builds trust.",
    icon: ShieldCheck,
  },
  {
    title: "Global opportunity pipeline",
    description:
      "Receive curated tender alerts, internship matches, and training opportunities for your team.",
    icon: Globe,
  },
];

export function HomeWhyJoin() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-join-rsk"
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-sky-900/20 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-12 text-center"
        >
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Why Join RSK
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Join a premium corporate community designed for growth. Move faster
            with trusted partners, business support, and member-only
            opportunities for teams and leaders.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group rounded-4xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_30px_80px_-50px_rgba(14,116,232,0.55)] transition-all hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/20"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-950/10 text-sky-400 transition-colors group-hover:bg-sky-400/10">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" rounded="full" className="min-w-45">
            <Link href="/membership">Explore membership</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

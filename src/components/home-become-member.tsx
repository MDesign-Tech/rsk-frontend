"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Users,
  BookOpen,
  Award,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    title: "Networking",
    description:
      "Build lasting business relationships with senior decision makers.",
    icon: Users,
  },
  {
    title: "Training",
    description:
      "Exclusive workshops and executive learning sessions for members.",
    icon: BookOpen,
  },
  {
    title: "Business Support",
    description:
      "Access advisory guidance and operational support when you need it most.",
    icon: HeartHandshake,
  },
  {
    title: "Funding Opportunities",
    description:
      "Be first to know about grants, tenders, and capital introductions.",
    icon: Award,
  },
  {
    title: "Certifications",
    description:
      "Gain credibility through member-focused professional certifications.",
    icon: Sparkles,
  },
  {
    title: "Mentorship",
    description:
      "Receive one-to-one mentorship from industry leaders and advisors.",
    icon: CheckCircle2,
  },
];

export function BecomeMember() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="become-a-member"
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Become a member
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Membership built to accelerate your business ambition. Enjoy premium
            support, access to curated opportunities, and performance-driven
            resources created for corporate leadership.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-4xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/20"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-950/10 text-sky-400 transition-colors group-hover:bg-sky-400/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {benefit.description}
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
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" rounded="full" className="min-w-45">
            <Link href="/membership">See membership fees</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

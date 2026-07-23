"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWebsiteStore } from "@/stores/website.store";


export function HomeWhyJoin() {
  const shouldReduceMotion = useReducedMotion();
  const whyJoinUs = useWebsiteStore((state) => state.data?.whyJoinUs);
  const visiblePoints = whyJoinUs?.points ?? [];
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
            {whyJoinUs?.title || "Why Join RSK"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {whyJoinUs?.description || "Join a premium corporate community designed for growth. Move faster with trusted partners, business support, and member-only opportunities for teams and leaders."}
          </p>
        </motion.div>

        {visiblePoints.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePoints.map((point, index) => {
              return (
                <motion.div
                  key={point.title + index}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group rounded-4xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_30px_80px_-50px_rgba(14,116,232,0.55)] transition-all hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/20"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-950/10 text-sky-400 transition-colors group-hover:bg-sky-400/10">
                    {point.image ? (
                      <Image src={point.image} alt={point.title} width={28} height={28} className="rounded-full object-cover" />
                    ) : (
                      <CheckCircle className="h-7 w-7" />
                    )}
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
        )}

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

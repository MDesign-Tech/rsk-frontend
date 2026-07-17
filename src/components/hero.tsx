"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useWebsiteStore } from "@/stores/website.store";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const hero = useWebsiteStore((state) => state.data?.hero);

  if (!hero) return null;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center pt-28 lg:pt-32 pb-40 sm:pb-32">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-display text-balance mb-6 leading-[1.1]"
          >
            <span className="text-gradient-lime">{hero.title}</span>
            {hero.subtitleVisible !== false && (
              <>
                <br />
                <span className="text-foreground">{hero.subtitle}</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed px-2"
          >
            At RSK Associates, we are more than accountants; we are trusted
            partners on the path to financial success.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground/40 mb-6 pointer-events-none select-none"
            aria-hidden="true"
          >
            <span>✕</span>
            <span>◇</span>
            <span>✕</span>
            <span>◇</span>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6"
          >
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              <span className="text-gradient-lime">{hero.description}</span>
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              asChild
              size="xl"
              rounded="full"
              className="gap-2 w-full sm:w-auto"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
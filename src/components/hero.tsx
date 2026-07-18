"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useWebsiteStore } from "@/stores/website.store";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const hero = useWebsiteStore((state) => state.data?.hero);
  const bgImage = hero?.image;

  if (!hero) return null;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(2,6,23,0.82),rgba(30,64,175,0.45)_45%,transparent_78%)]" />
         {
          bgImage && (
            <div
          className="absolute inset-0 opacity-85"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.85) contrast(0.9)",
          }}
        />
          )
         }
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/55 via-blue-800/30 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center pt-28 lg:pt-32 pb-40 sm:pb-32">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-display text-balance mb-6 leading-[1.1]"
          >
            <motion.span
              whileHover={{
                scale: 1.04,
                y: -4,
                rotate: -1,
                textShadow: "0 0 20px rgba(255,255,255,0.35)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="block text-white"
            >
              {hero.title}
            </motion.span>
            {hero.subtitleVisible !== false && (
              <motion.span
                animate={
                  shouldReduceMotion ? {} : { y: [0, -6, 0], scale: [1, 1.01, 1] }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="block text-sky-300"
              >
                {hero.subtitle}
              </motion.span>
            )}
          </motion.h1>

          {/* <motion.p
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed px-2"
          >
            At RSK Associates, we are more than accountants; we are trusted
            partners on the path to financial success.
          </motion.p> */}

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

          {hero.trustVisible !== false && hero.trust && (
            <motion.div
              initial={shouldReduceMotion ? {} : fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                <span className="text-gradient-lime">{hero.trust}</span>
              </p>
            </motion.div>
          )}

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

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useWebsiteStore } from "@/stores/website.store";

export function LogoCloud() {
  const shouldReduceMotion = useReducedMotion();

  const partners = useWebsiteStore((state) => state.data?.partners);

  // Filter only visible partners
  const visiblePartners = partners?.filter((p) => p.visible !== false) ?? [];

  if (!visiblePartners || visiblePartners.length === 0) return null;

  return (
    <section
      className="relative py-12 lg:py-16 border-t border-border"
      aria-label="Our Partners"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Our Partners
          </h2>

          <p className="text-sm text-muted-foreground">
            Trusted by innovative businesses worldwide
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {visiblePartners.map((partner, index) => (
            <motion.div
              key={partner._id || index}
              initial={
                shouldReduceMotion
                  ? {}
                  : { opacity: 0, y: 10 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors flex flex-col items-center gap-2"
            >
              {partner.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-lg font-semibold tracking-tight">
                  {partner.name}
                </span>
              )}
              <span className="text-sm font-medium text-foreground/80">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

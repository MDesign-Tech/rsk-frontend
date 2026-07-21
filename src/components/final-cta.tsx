"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-sky-950 text-slate-100">
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden py-16 lg:py-24 px-6 sm:px-12 bg-sky-900/95 shadow-[0_40px_120px_-45px_rgba(14,116,232,0.9)] border border-sky-500/30">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-display mb-6 text-white">
              Ready to work with Us?
            </h2>
            <p className="text-lg text-slate-200 mb-10 max-w-xl mx-auto">
              Transform your financial strategy with expert audit, tax advisory,
              and business management services tailored to your success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="xl"
                rounded="full"
                className="gap-2 min-w-50 bg-white text-slate-950 hover:bg-slate-100"
              >
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteStore } from "@/stores/website.store";

const CONTACT_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Email: Mail,
  Phone: Phone,
  Message: MapPin,
};

export function HomeContactUs() {
  const shouldReduceMotion = useReducedMotion();

  const about = useWebsiteStore((state) => state.data?.about);
  const contactMethods =
    about?.contactMethods?.filter((method) => method.visible !== false) ?? [];

  if (contactMethods.length === 0) return null;

  return (
    <section
      id="contact-us"
      className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-32 sm:h-48 bg-linear-to-b from-sky-300/20 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-8 text-center transition-all hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/20"
        >
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Contact us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Ready to explore membership or business support? Our team is
            available to answer questions, provide proposals, and help you take
            the next step.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contactMethods.map((item, index) => {
            const Icon = CONTACT_ICONS[item.label] || MapPin;
            return (
              <motion.div
                key={item.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-4xl border border-sky-300/30 bg-white/10 p-6 backdrop-blur-xl shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1  hover:border-sky-300/30 hover:bg-white/20"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-950/10 text-sky-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-semibold text-foreground">
                  {item.label}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs sm:text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-xs sm:text-sm leading-6 text-muted-foreground">
                    {item.value}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" rounded="full" className="min-w-50">
            <Link href="/contact">Send us a message</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

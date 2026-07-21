"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  {
    label: "Email",
    value: "contact@rskassociates.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+1 (800) 123-4567",
    icon: Phone,
  },
  {
    label: "Message",
    value: "Request membership materials or schedule a consultation.",
    icon: MessageSquare,
  },
];

export function HomeContactUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact-us"
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-sky-950/20 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-12 text-center"
        >
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Contact us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Ready to explore membership or business support? Our team is
            available to answer questions, provide proposals, and help you take
            the next step.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_40px_-24px_rgba(14,116,232,0.65)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-950/10 text-sky-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" rounded="full" className="min-w-50">
            <Link href="/contact">Send us a message</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

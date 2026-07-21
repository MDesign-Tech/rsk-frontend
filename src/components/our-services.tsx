"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  Calculator,
  Briefcase,
  Shield,
  Zap,
} from "lucide-react";

import { useWebsiteStore } from "@/stores/website.store";

const SERVICE_ICONS = [
  CheckCircle,
  TrendingUp,
  Calculator,
  Briefcase,
  Shield,
  Zap,
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export function OurServices() {
  const services = useWebsiteStore((state) => state.data?.services);

  // Filter only visible services
  const visibleServices = services;

  if (!visibleServices || visibleServices.length === 0) {
    return null;
  }

  return (
    <section
      id="our-services"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 1.03, y: 24 }}
        whileInView={{ opacity: 1, scale: 1.05, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.14), transparent 28%), linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="tracking-display mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Our Services
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {visibleServices.map((service, index) => {
            const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

            return (
              <motion.div
                key={service._id}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                  boxShadow: "0 20px 45px -20px rgba(37, 99, 235, 0.28)",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 backdrop-blur transition-colors duration-300 hover:bg-card/90"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <Icon
                    className="mb-4 h-12 w-12 text-primary transition-colors duration-300 group-hover:text-blue-600"
                    aria-hidden="true"
                  />

                  <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

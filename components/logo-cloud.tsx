"use client"

import { motion, useReducedMotion } from "framer-motion"

const logos = [
  { name: "Partner 1", text: "BK" },
  { name: "Partner 2", text: "MTN" },
  { name: "Partner 3", text: "UMUGI WA KIGALI" },
  { name: "Partner 4", text: "Airtel" },
  { name: "Partner 5", text: "Sensitive" },
]

export function LogoCloud() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative py-12 lg:py-16 border-t border-border" aria-label="Our Partners">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Our Partners</h2>
          <p className="text-sm text-muted-foreground">
            Trusted by innovative businesses worldwide
          </p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <span className="text-lg font-semibold tracking-tight">{logo.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

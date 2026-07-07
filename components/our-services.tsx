"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  TrendingUp,
  Calculator,
  Briefcase,
  Shield,
  Zap,
} from "lucide-react"

const services = [
  {
    icon: CheckCircle,
    title: "Audit",
    description: "Comprehensive audit services ensuring financial accuracy, transparency, and regulatory compliance for your organization.",
  },
  {
    icon: TrendingUp,
    title: "Tax Advisory",
    description: "Strategic tax planning and optimization to minimize your tax burden while maximizing financial efficiency.",
  },
  {
    icon: Calculator,
    title: "Financial Consulting",
    description: "Expert financial guidance to improve profitability, cash flow management, and long-term financial planning.",
  },
  {
    icon: Briefcase,
    title: "Business Management",
    description: "Comprehensive business management solutions to streamline operations and drive sustainable growth.",
  },
  {
    icon: Shield,
    title: "Compliance & Financial Product Development",
    description: "Develop compliant financial products and ensure regulatory adherence across all business operations.",
  },
  {
    icon: Zap,
    title: "Supporting Business Growth",
    description: "Strategic initiatives and support to accelerate your business growth and achieve your objectives.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function OurServices() {
  return (
    <section id="our-services" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:bg-card/80 transition-colors"
              >
                <Icon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

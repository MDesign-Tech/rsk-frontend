"use client";

import { motion } from "framer-motion";
import { Users, Award, Target, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50+",
    label: "Team Members",
  },
  {
    icon: Award,
    number: "15+",
    label: "Years Experience",
  },
  {
    icon: Target,
    number: "200+",
    label: "Successful Projects",
  },
  {
    icon: Globe,
    number: "30+",
    label: "Countries Served",
  },
];

export function AboutUs() {
  return (
    <section id="about-us" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-6">
              About RSK Associates
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              At RSK Associates, we are more than accountants; we are trusted
              partners on the path to financial success.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our team of Certified Public Accountants (CPAs) provides a
              comprehensive range of professional services, including Audit &
              Assurance, Tax & Legal, Consulting, and Financial Advisory. We
              work closely with our clients to deliver practical, compliant, and
              value-driven solutions.
            </p>
            {/* <p className="text-lg text-muted-foreground">
              We are committed to exceeding expectations, building long-term
              client relationships, and supporting businesses of all sizes in
              achieving their financial objectives.
            </p> */}
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur text-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    className="w-8 h-8 text-primary mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

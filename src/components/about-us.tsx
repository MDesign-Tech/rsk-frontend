"use client";

import { motion } from "framer-motion";
import {
  Users,
  Award,
  Target,
  Globe,
  Briefcase,
  TrendingUp,
} from "lucide-react";

import { useWebsiteStore } from "@/stores/website.store";
import type { AboutStat } from "@/types";

const STAT_ICONS = [Users, Award, Target, Globe, Briefcase, TrendingUp];

export function AboutUs() {
  const about = useWebsiteStore((state) => state.data?.about);

  if (!about) {
    return null;
  }

  const stats: AboutStat[] = about.stats ?? [];

  return (
    <section id="about-us" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-6">
              {about.title}
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              {about.description}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >
            {stats.map((stat, index) => {
              const Icon = STAT_ICONS[index % STAT_ICONS.length];

              return (
                <motion.div
                  key={stat._id || index}
                  className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur text-center"
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
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

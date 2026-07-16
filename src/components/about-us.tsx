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

  // Filter only visible stats
  const stats: AboutStat[] = about.stats?.filter((s) => s.visible !== false) ?? [];

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      id="about-us"
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/5.jpeg")',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />

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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-6 text-white">
              {about.title}
            </h2>

            <p className="text-lg text-slate-200 mb-6">{about.description}</p>
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
                  className="p-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur text-center shadow-lg shadow-slate-950/20"
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Icon
                    className="w-8 h-8 text-blue-300 mx-auto mb-3"
                    aria-hidden="true"
                  />

                  <div className="text-3xl font-bold mb-1 text-white">
                    {stat.number}
                  </div>

                  <div className="text-sm text-slate-200">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

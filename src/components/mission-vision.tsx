"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useWebsiteStore } from "@/stores/website.store";

export function MissionVision() {
  const mv = useWebsiteStore((state) => state.data?.missionVision);

  if (!mv || mv.visible === false) return null;

  return (
    <section
      id="mission-vision"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-4">
            Our Mission & Vision
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guiding our commitment to excellence and client success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur rounded-xl border border-border p-8 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-2xl font-bold">
                {mv.missionTitle}
              </h3>
            </div>

            <p className="text-foreground leading-relaxed">
              {mv.missionDescription}
            </p>
          </motion.div>


          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur rounded-xl border border-border p-8 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Eye
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-2xl font-bold">
                {mv.visionTitle}
              </h3>
            </div>

            <p className="text-foreground leading-relaxed">
              {mv.visionDescription}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

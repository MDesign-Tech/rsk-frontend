"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import { getImageUrl } from "@/lib/image";
import { useWebsiteStore } from "@/stores/website.store";
import { useEffect, useState } from "react";


export function OurTeam() {
  const teamMembers = useWebsiteStore(
    (state) => state.data?.teamMembers
  );

  const { theme = "system" } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<string>("dark");
  const [mounted, setMounted] = useState(false);

  // Filter only visible team members
  const visibleMembers = teamMembers?.filter((m) => m.visible !== false) ?? [];

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setResolvedTheme(isDark ? "dark" : "light");
  }, [theme]);

  if (!visibleMembers || visibleMembers.length === 0) {
    return null;
  }

  // Determine icon color based on theme
  const iconColor = resolvedTheme === "dark" ? "text-white" : "text-gray-800";
  const iconBgColor = resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-200";

  return (
    <section
      id="our-team"
      className="relative py-20 px-4 sm:px-6 lg:px-8 flex justify-center"
    >
      <div className="max-w-6xl w-full">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-4">
            Our Team
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the experienced professionals who deliver exceptional results for our clients.
          </p>

        </motion.div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">

          {visibleMembers.map((member, index) => {

            const hasImage = member.image && getImageUrl(member.image);

            return (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
                className="group"
              >

                <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4] w-full max-w-[300px]">

                  {hasImage ? (
                    <Image
                      src={hasImage}
                      alt={member.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${iconBgColor}`}>
                      <User className={`w-16 h-16 ${iconColor}`} strokeWidth={1.5} />
                    </div>
                  )}

                </div>


                <div className="text-center">

                  <h3 className="text-lg font-semibold mb-1">
                    {member.name}
                  </h3>

                  <p className="text-sm text-primary font-medium mb-2">
                    {member.title}
                  </p>

                </div>

              </motion.div>
            );

          })}

        </div>

      </div>
    </section>
  );
}

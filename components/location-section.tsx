"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LocationSectionProps = {
  title?: string;
  description?: string;
  mapsUrl?: string;
  embedUrl?: string;
  address?: string;
};

export function LocationSection({
  title = "Visit Our Office",
  description = "Find our office easily using the map below. We look forward to welcoming you.",
  mapsUrl = "https://maps.app.goo.gl/E8vWT2a6sAd56dNF6",
  embedUrl = "https://www.google.com/maps?q=-1.9448082,30.1290542&z=16&output=embed",
}: LocationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <div className="rounded-[32px] border border-border/70 bg-card/70 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Our Location
            </div> */}
            <div className="space-y-1">
             {/*  <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h3> */}
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          {/* <Button asChild size="lg" rounded="full" className="gap-2 self-start">
            <a href={mapsUrl} target="_blank" rel="noreferrer noopener">
              Open in Google Maps
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button> */}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border/60 bg-muted/30 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <iframe
            src={embedUrl}
            title="RSK Associates office location on Google Maps"
            aria-label="Google Maps showing the location of RSK Associates"
            className="min-h-[450px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </motion.div>
  );
}

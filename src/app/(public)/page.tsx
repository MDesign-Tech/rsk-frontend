"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { OurServices } from "@/components/our-services";
import { AboutUs } from "@/components/about-us";
import { OurTeam } from "@/components/our-team";
import { MissionVision } from "@/components/mission-vision";
import { LogoCloud } from "@/components/logo-cloud";
import { VideoGallery } from "@/components/video-gallery";
import { HowItWorks } from "@/components/how-it-works";
import { UseCases } from "@/components/use-cases";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { useWebsiteStore } from "@/stores/website.store";

export default function Home() {

  return (
    <main
      id="home"
      className="relative z-0 min-h-screen bg-background overflow-x-hidden"
    >

      <Navbar />

      <Hero />
      <OurServices />
      <AboutUs />
      <OurTeam />
      <MissionVision />
      <LogoCloud />
      {/* <VideoGallery />
      {/* <HowItWorks /> */}
      {/* <UseCases /> */}
      {/* <Stats /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <FAQ />
      <FinalCTA />
    </main>
  );
}

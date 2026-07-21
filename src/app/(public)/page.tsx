"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { OurServices } from "@/components/our-services";
import { AboutUs } from "@/components/about-us";
import { MissionVision } from "@/components/mission-vision";
import { LogoCloud } from "@/components/logo-cloud";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { HomeWhyJoin } from "@/components/home-why-join";
import { BecomeMember } from "@/components/home-become-member";
import { HomeContactUs } from "@/components/home-contact-us";
import { SectionDivider } from "@/components/section-divider";

export default function Home() {
  return (
    <main
      id="home"
      className="relative z-0 min-h-screen bg-background overflow-x-hidden"
    >
      <Navbar />

      <Hero />
      {/* <SectionDivider variant="wave" /> */}
      <HomeWhyJoin />
      {/* <SectionDivider variant="diagonal" /> */}
      <AboutUs />
      {/* <SectionDivider variant="dotted" /> */}
      <OurServices />
      <SectionDivider variant="gradient" />
      <BecomeMember />
      <SectionDivider variant="curve" />
      <MissionVision />
      <SectionDivider variant="wave" />
      {/* <LogoCloud /> */}
      <FAQ />
      {/* <SectionDivider variant="diagonal" /> */}
      <HomeContactUs />
      {/* <FinalCTA /> */}
    </main>
  );
}

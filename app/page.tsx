import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { OurServices } from "@/components/our-services"
import { AboutUs } from "@/components/about-us"
import { OurTeam } from "@/components/our-team"
import { MissionVision } from "@/components/mission-vision"
import { LogoCloud } from "@/components/logo-cloud"
import { VideoGallery } from "@/components/video-gallery"
import { HowItWorks } from "@/components/how-it-works"
import { UseCases } from "@/components/use-cases"
import { Stats } from "@/components/stats"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen bg-background overflow-x-hidden">
      <div
        className="absolute top-0 right-0 w-[1500px] h-[1500px] -z-10 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 50% 50% at 100% 0%, rgb(0 0 0 / 0.75), transparent)",
          backgroundImage: "url('/hero-corner.png')",
          backgroundSize: "cover",
          backgroundPosition: "right top",
        }}
      />
    

      <Navbar />

      <Hero />
      <OurServices />
      <AboutUs />
      <OurTeam />
      <MissionVision />
      <LogoCloud />
      {/* <VideoGallery /> */}
      {/* <HowItWorks /> */}
      {/* <UseCases /> */}
      {/* <Stats /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}

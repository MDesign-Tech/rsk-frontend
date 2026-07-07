import { ContactUs } from "@/components/contact-us"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Contact Us - RSK Associates",
  description: "Get in touch with RSK Associates for professional services and consulting.",
}

export default function ContactPage() {
  return (
    <main className="relative z-0 min-h-screen bg-background overflow-x-hidden">
      <div
        className="absolute top-0 right-0 w-[1500px] h-[1500px] -z-10 bg-primary pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 50% 50% at 100% 0%, rgb(0 0 0 / 0.75), transparent)",
        }}
      >
        <div className="absolute inset-0 bg-cover bg-right-top" style={{ backgroundImage: "url('/grade.png')" }} />
      </div>

      <Navbar />

      <div className="pt-28 pb-16">
        <ContactUs />
      </div>

      <Footer />
    </main>
  )
}

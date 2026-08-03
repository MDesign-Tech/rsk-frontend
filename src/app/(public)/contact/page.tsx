import { ContactUs } from "@/components/contact-us";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Contact Us - RSK Associates",
  description:
    "Get in touch with RSK Associates for professional services and consulting.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className="absolute top-0 right-0 w-[1500px] h-[1500px] -z-10 bg-primary pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 50% 50% at 100% 0%, rgb(0 0 0 / 0.75), transparent)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-right-top"
          style={{ backgroundImage: "url('/grade.png')" }}
        />
      </div>

      <Navbar />
      <ContactUs />
    </main>
  );
}

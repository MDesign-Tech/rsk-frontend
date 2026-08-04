import { ContactUs } from "@/components/contact-us";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Contact Us - RSK Associates",
  description:
    "Get in touch with RSK Associates for professional services and consulting.",
};

export default function ContactPage() {
  return (
    <main className="relative z-0 h-max bg-background overflow-x-hidden">
     
        

      <Navbar />

      <div className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
         <ContactUs />
       </div>
    </main>
  );
}

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
      <Navbar />

      <div className="flex h-full flex-col justify-between overflow-x-hidden pt-40 md:pt-45 lg:pt-47.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          <ContactUs />
        </div>
      </div>
    </main>
  );
}

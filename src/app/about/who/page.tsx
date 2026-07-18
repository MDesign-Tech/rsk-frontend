import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function WhoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-semibold">About Us</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                RSK Associates is a boutique advisory firm providing tailored
                financial and strategic services to businesses and institutions.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-card">
              <div className="relative h-72 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1497951759394-4cc3f1382a0e?auto=format&fit=crop&w=1200&q=80"
                  alt="About RSK Associates"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                To empower clients with clear, practical advice that drives
                sustainable growth and resilience.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A thriving ecosystem where businesses and communities flourish
                through transparent and strategic financial stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

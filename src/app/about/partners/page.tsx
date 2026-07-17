import { Navbar } from "@/components/navbar";
import Image from "next/image";

const partners = [
  "partner1.png",
  "partner2.png",
  "partner3.png",
  "partner4.png",
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h1 className="text-3xl font-semibold">Our partners</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We work with trusted partners
          </p>

          <div className="mt-8 rounded-2xl overflow-hidden border border-border/60 bg-card">
            <div className="relative h-72 w-full">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
                alt="Partner collaboration"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {partners.map((p) => (
              <div
                key={p}
                className="flex items-center justify-center rounded-2xl border border-border/60 bg-card p-6"
              >
                <Image
                  src={`/images/${p}`}
                  alt={p}
                  width={160}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

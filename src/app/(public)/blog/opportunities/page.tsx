import { Navbar } from "@/components/navbar";
import Image from "next/image";

const items = [
  {
    id: 1,
    type: "Tender",
    title: "Supply of audit services",
    org: "Ministry of Finance",
    date: "2026-07-01",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    type: "Job",
    title: "Senior Financial Analyst",
    org: "RSK Associates",
    date: "2026-06-20",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function OpportunitiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-semibold">Opportunities</h1>
            <p className="text-sm text-muted-foreground">
              Calls for tenders & job offers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {items.map((it) => (
              <article
                key={it.id}
                className="rounded-2xl overflow-hidden border border-border/60 bg-card hover:scale-[1.01] transition-transform"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={it.image}
                    alt={it.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary font-semibold">
                    {it.type}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold">{it.title}</h2>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {it.org} •{" "}
                    <time>{new Date(it.date).toLocaleDateString()}</time>
                  </div>
                  <div className="mt-4">
                    <a href="#" className="text-primary font-medium">
                      View details
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

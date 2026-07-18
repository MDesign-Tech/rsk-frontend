"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useWebsiteStore } from "@/stores/website.store";

export default function TeamPage() {
  const teamMembers = useWebsiteStore((state) => state.data?.teamMembers) ?? [];
  const members = teamMembers.filter((m) => m.visible !== false);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-10">
          <div>
            <h1 className="text-3xl font-semibold">Our team</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Experts who deliver impact
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m._id}
                className="rounded-2xl border border-border/60 bg-card"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {m.title}
                  </div>
                  {m.bio ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {m.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

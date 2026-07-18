import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { Globe, Linkedin } from "lucide-react";

const teams = [
  {
    section: "Board of Directors",
    members: [
      {
        id: 1,
        name: "Amina Ali",
        role: "Chair",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
        desc: "Experienced corporate advisor.",
      },
      {
        id: 2,
        name: "Peter Okoye",
        role: "Member",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
        desc: "Finance specialist.",
      },
    ],
  },
  {
    section: "Accountants",
    members: [
      {
        id: 3,
        name: "Sara Khan",
        role: "Senior Accountant",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
        desc: "Tax and compliance.",
      },
    ],
  },
];

export default function TeamPage() {
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

          {teams.map((grp) => (
            <div key={grp.section}>
              <h2 className="text-xl font-semibold">{grp.section}</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grp.members.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-border/60 bg-card p-6"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {m.role}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {m.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                      <a
                        href="#"
                        aria-label="LinkedIn"
                        className="hover:text-primary"
                      >
                        <Linkedin />
                      </a>
                      <a
                        href="#"
                        aria-label="Website"
                        className="hover:text-primary"
                      >
                        <Globe />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

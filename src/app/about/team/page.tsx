"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Facebook, Instagram, Linkedin, Youtube, Globe, MessageCircle, User } from "lucide-react";
import type { TeamSectionGroup, SocialMedia } from "@/types";

const PLATFORM_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  x: Globe,
};

function SocialLinks({ social }: { social?: SocialMedia }) {
  if (!social) return null;
  const entries = (Object.entries(social) as [string, { href?: string | null; visible?: boolean }][])
    .filter(([, v]) => v?.visible !== false && v?.href);
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 flex items-center gap-3 text-muted-foreground">
      {entries.map(([key, v]) => {
        const Icon = PLATFORM_ICONS[key] ?? Globe;
        return (
          <a
            key={key}
            href={v.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            className="hover:text-primary"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}

export default function TeamPage() {
  const [groups, setGroups] = useState<TeamSectionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/team/public");
        const body = res.data;
        const payload = body?.data;
        let data: TeamSectionGroup[] = [];
        if (Array.isArray(payload)) {
          data = payload;
        } else if (payload && typeof payload === "object") {
          const p = payload as Record<string, unknown>;
          if (Array.isArray(p.groups)) data = p.groups as TeamSectionGroup[];
          else if (Array.isArray(p.team)) data = p.team as TeamSectionGroup[];
        } else if (Array.isArray(body)) {
          data = body;
        }
        if (active) setGroups(data);
      } catch {
        if (active) setGroups([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading team…</p>
          ) : groups.filter((g) => g.members.length > 0).length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members to show.</p>
          ) : (
            groups
              .filter((g) => g.members.length > 0)
              .map((grp) => (
              <div key={grp.section._id}>
                <h2 className="text-xl font-semibold">{grp.section.name}</h2>
                {grp.section.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {grp.section.description}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grp.members.map((m) => (
                    <div
                      key={m._id}
                      className="rounded-2xl border border-border/60 bg-card p-4"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                        {m.image ? (
                          <Image
                            src={m.image}
                            alt={m.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-muted text-muted-foreground">
                            <User className="w-3/4 h-3/4 max-w-[200px] max-h-[200px]" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {m.title}
                      </div>
                      {m.bio ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {m.bio}
                        </p>
                      ) : null}
                      <SocialLinks social={m.socialMedia} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

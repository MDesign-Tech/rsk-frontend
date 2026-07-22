"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Navbar } from "@/components/navbar";
import { SectionDivider } from "@/components/section-divider";
import { motion, useReducedMotion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  MessageCircle,
  User,
  Briefcase,
  Sparkles,
  ArrowRight,
} from "lucide-react";
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
  const entries = (
    Object.entries(social) as [
      string,
      { href?: string | null; visible?: boolean },
    ][]
  ).filter(([, v]) => v?.visible !== false && v?.href);
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
  const shouldReduceMotion = useReducedMotion();

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
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div class="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
        <div class="mx-auto flex max-w-7xl flex-col items-center gap-8 justify-self-center px-4 text-center sm:px-6 lg:px-8">
          {/* <div class="bg-base-200 border-base-content/20 flex w-fit items-center gap-2.5 rounded-full border px-3 py-2">
            <span class="badge badge-primary shrink-0 rounded-full">Our team</span>
          </div> */}
          <h1 class="text-base-content relative z-1 text-5xl leading-[1.15] font-bold max-md:text-2xl md:max-w-3xl md:text-balance">
            <span>Our team</span>
            <svg
              width="223"
              height="12"
              viewBox="0 0 223 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute -bottom-1.5 left-10 -z-1 max-lg:left-4 max-md:hidden"
            >
              <path
                d="M1.30466 10.7431C39.971 5.28788 76.0949 3.02 115.082 2.30401C143.893 1.77489 175.871 0.628649 204.399 3.63102C210.113 3.92052 215.332 4.91391 221.722 6.06058"
                stroke="url(#paint0_linear_10365_68643)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_10365_68643"
                  x1="19.0416"
                  y1="4.03539"
                  x2="42.8362"
                  y2="66.9459"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.2" stop-color="var(--color-primary)" />
                  <stop offset="1" stop-color="var(--color-primary-content)" />
                </linearGradient>
              </defs>
            </svg>
          </h1>
          <p class="text-base-content/80 max-w-3xl">
            Our team blends corporate advisory experience, financial discipline,
            and practical execution to deliver solutions that help businesses
            move forward with confidence.
          </p>
        </div>
      </div><br /><br /> 

      <SectionDivider variant="wave" />

      <section className="py-20 " >
        <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-10 ">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading team…</p>
          ) : groups.filter((g) => g.members.length > 0).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No team members to show.
            </p>
          ) : (
            groups
              .filter((g) => g.members.length > 0)
              .map((grp) => (
                <div key={grp.section._id} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {grp.section.name}
                    </h2>
                    {grp.section.description ? (
                      <p className="mt-2 text-muted-foreground">
                        {grp.section.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {grp.members.map((m) => (
                      <motion.div
                        key={m._id}
                        initial={
                          shouldReduceMotion ? {} : { opacity: 0, y: 16 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-lg shadow-slate-950/10"
                      >
                        <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-muted">
                          {m.image ? (
                            <Image
                              src={m.image}
                              alt={m.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-muted text-muted-foreground">
                              <User
                                className="w-3/4 h-3/4 max-w-40 max-h-40"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {m.title}
                        </p>
                        {m.bio ? (
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {m.bio}
                          </p>
                        ) : null}
                        <SocialLinks social={m.socialMedia} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
      <SectionDivider variant="diagonal" />

      <section className="bg-slate-950/5 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-4xl border border-white/10 bg-sky-950/95 p-10 shadow-[0_40px_120px_-50px_rgba(14,116,232,0.55)]"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
                  Join our team
                </p>
                <h2 className="mt-4 text-4xl font-semibold">
                  Build your career with corporate advisory experts.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                  If you're passionate about strategy, finance, and client
                  success, RSK Associates offers a collaborative environment and
                  an opportunity to work on high-impact corporate engagements.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:items-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Apply now
                </Link>
                <Link
                  href="/about/who"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Learn more about us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <SectionDivider variant="curve" />
    </main>
  );
}

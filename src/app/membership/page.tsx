import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";

const benefits = [
  "Priority access to advisory updates",
  "Invitations to member-only events",
  "Quarterly insights and reports",
  "Direct support for professional growth",
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,156,219,0.18),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/images/8.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-lg backdrop-blur">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Membership
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Join the RSK community
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Unlock tailored resources and deeper access to our professional
              network through an annual membership.
            </p>
            <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Why become a member?
              </h2>
              <ul className="mt-6 space-y-4">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

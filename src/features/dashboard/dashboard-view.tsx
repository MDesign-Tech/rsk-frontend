"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, HelpCircle, Mail, type LucideIcon } from "lucide-react";
import { serviceService } from "@/services/service.service";
import { teamService } from "@/services/team.service";
import { faqService } from "@/services/faq.service";
import { contactService } from "@/services/contact.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/admin/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import { toast } from "sonner";

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function DashboardView() {
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, t, f, c] = await Promise.all([
        serviceService.getAll(),
        teamService.getAll(),
        faqService.getAll(),
        contactService.getAll(),
      ]);
      setStats([
        { title: "Total Services", value: s.data.services.length, icon: Briefcase },
        { title: "Total Team Members", value: t.data.teamMembers.length, icon: Users },
        { title: "Total FAQs", value: f.data.faqs.length, icon: HelpCircle },
        { title: "Total Contact Messages", value: c.data.messages.length, icon: Mail },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error)
    return (
      <EmptyState
        title="Something went wrong"
        description={error}
        action={<Button onClick={load}>Retry</Button>}
      />
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats!.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

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
import { SectionHeader } from "@/components/admin/section-header";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
  module: string;
}

export function DashboardView() {
  const { hasPermission } = useAuthStore();
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Only fetch data for modules the user has read permission for
      const fetchPromises: Promise<any>[] = [];
      const statMap: { [key: string]: Stat } = {};

      if (hasPermission("Service", "read")) {
        fetchPromises.push(serviceService.getAll().then((res) => {
          statMap["Service"] = { title: "Total Services", value: res.data.services.length, icon: Briefcase, module: "Service" };
        }));
      }
      if (hasPermission("Team Member", "read")) {
        fetchPromises.push(teamService.getAll().then((res) => {
          statMap["Team Member"] = { title: "Total Team Members", value: res.data.teamMembers.length, icon: Users, module: "Team Member" };
        }));
      }
      if (hasPermission("FAQ", "read")) {
        fetchPromises.push(faqService.getAll().then((res) => {
          statMap["FAQ"] = { title: "Total FAQs", value: res.data.faqs.length, icon: HelpCircle, module: "FAQ" };
        }));
      }
      if (hasPermission("Contact", "read")) {
        fetchPromises.push(contactService.getConversations().then((res) => {
          statMap["Contact"] = { title: "Total Conversations", value: res.data.conversations.length, icon: Mail, module: "Contact" };
        }));
      }

      await Promise.all(fetchPromises);
      setStats(Object.values(statMap));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      toast.error("Failed to load dashboard data");
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
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
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
      </section>
    </div>
  );
}

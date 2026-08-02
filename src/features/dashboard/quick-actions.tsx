"use client";

import { useRouter } from "next/navigation";
import {
  UserPlus,
  Users,
  Briefcase,
  HelpCircle,
  Newspaper,
  Briefcase as OpportunityIcon,
  Image,
  Settings,
  ArrowRight,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

export function QuickActions() {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      title: "Add User",
      description: "Create a new admin or member account",
      icon: UserPlus,
      href: "/admin/users",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Add Team Member",
      description: "Add a new member to your team",
      icon: Users,
      href: "/admin/team",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Briefcase,
      href: "/admin/services",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Add FAQ",
      description: "Add a new frequently asked question",
      icon: HelpCircle,
      href: "/admin/faqs",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Media Library",
      description: "Manage images and media files",
      icon: Image,
      href: "/admin/media-library",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      title: "Contact Messages",
      description: "View and respond to inquiries",
      icon: Settings,
      href: "/admin/contact",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      title: "News & Articles",
      description: "Manage blog posts and news",
      icon: Newspaper,
      href: "/admin/news",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      title: "Opportunities",
      description: "Manage jobs, tenders, and opportunities",
      icon: OpportunityIcon,
      href: "/admin/opportunities",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.title}
            onClick={() => router.push(action.href)}
            className="group relative flex flex-col items-start gap-3 rounded-xl border border-border/60 bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 active:scale-[0.98]"
          >
            <div className={`flex size-10 items-center justify-center rounded-lg ${action.bgColor} transition-transform group-hover:scale-110`}>
              <Icon className={`size-5 ${action.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{action.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
            </div>
            <ArrowRight className="absolute top-4 right-4 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
}

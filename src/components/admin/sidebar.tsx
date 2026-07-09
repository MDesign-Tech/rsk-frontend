"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Briefcase,
  Info,
  Target,
  Handshake,
  HelpCircle,
  Users,
  Mail,
  UserCog,
  User,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useSidebarStore } from "@/stores/sidebar.store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Image,
  Briefcase,
  Info,
  Target,
  Handshake,
  HelpCircle,
  Users,
  Mail,
  UserCog,
  User,
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-semibold tracking-tight">RSK Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetHeader className="h-16 justify-center border-b">
            <SheetTitle>RSK Admin</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

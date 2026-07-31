"use client";

import { useState } from "react";
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
  Award,
  BookOpen,
  Newspaper,
  Shield,
  Boxes,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/lib/constants";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
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
  Award,
  BookOpen,
  Newspaper,
  Shield,
  Boxes,
};

// Map nav item titles to module names for permission checking
const NAV_ITEM_MODULE_MAP: Record<string, string> = {
  "Hero": "Hero",
  "Services": "Service",
  "About Us": "About Us",
  "Mission & Vision": "Mission & Vision",
  // "Partners": "Partner",
  "FAQs": "FAQ",
  "Team Members": "Team Member",
  "Contact Messages": "Contact",
  "Why Join Us": "Why Join Us",
  "Why Become Member": "Why Become Member",
  "News": "News",
  "Opportunities": "Opportunity",
  "Users": "User",
  "Media Library": "Media Library",
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
   const pathname = usePathname();
   const { user, hasPermission } = useAuthStore();

   // Show all nav items to all users; protect routes on the frontend only
   const visibleItems = NAV_ITEMS.filter((item) => {
     // Admin sees everything
     if (user?.role === "admin") return true;

     // Check permission for this module
     const moduleName = NAV_ITEM_MODULE_MAP[item.title];
     if (moduleName) {
       if (!hasPermission(moduleName, "read")) return false;
     }

     // For items with children, check if any child is accessible
     if (item.children) {
       const hasAccessibleChild = item.children.some((child) => {
         const childModuleName = NAV_ITEM_MODULE_MAP[child.title];
         if (childModuleName) {
           return hasPermission(childModuleName, "read");
         }
         return true;
       });
       if (!hasAccessibleChild) return false;
     }

     return true;
   });

   return (
     <nav className="flex flex-col gap-1 px-3">
       {visibleItems.map((item) => {
         const Icon = iconMap[item.icon] ?? LayoutDashboard;
         const active =
           item.href === "/admin"
             ? pathname === "/admin"
             : pathname.startsWith(item.href);

         if (item.children) {
           // Filter children based on permissions
           const visibleChildren = item.children.filter((child) => {
             if (user?.role === "admin") return true;

             const childModuleName = NAV_ITEM_MODULE_MAP[child.title];
             if (childModuleName) {
               return hasPermission(childModuleName, "read");
             }
             return true;
           });

           if (visibleChildren.length === 0) return null;

           return (
             <NavDropdown
               key={item.href}
               item={{ ...item, children: visibleChildren }}
               pathname={pathname}
               onNavigate={onNavigate}
             />
           );
         }

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

function NavDropdown({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const active = item.children?.some((child) => pathname.startsWith(child.href));

  const ParentIcon = iconMap[item.icon] ?? LayoutDashboard;
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <ParentIcon className="size-4" />
        {item.title}
        <ChevronDown className={cn("ml-auto size-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-3">
          {item.children?.map((child) => {
            const ChildIcon = iconMap[child.icon] ?? LayoutDashboard;
            const childActive = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  childActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <ChildIcon className="size-4" />
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
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

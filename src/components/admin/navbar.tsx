"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { setMobileOpen } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

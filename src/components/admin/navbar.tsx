"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import type { TeamMember } from "@/types";

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

  const memberInfo = user?.member && typeof user.member === "object" ? (user.member as TeamMember) : null;
  const avatarSrc = memberInfo?.image || null;

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {avatarSrc ? (
                  <AvatarImage src={avatarSrc} alt={user?.name || "User"} />
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {memberInfo && (
                  <p className="text-xs text-muted-foreground">
                    {memberInfo.department} {memberInfo.position ? `• ${memberInfo.position}` : ""}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              Go to Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Badge variant="secondary" className="capitalize">
          {user?.role}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ExternalLink className="h-4 w-4" />
            Go to client
          </Link>
        </Button>
      </div>
    </header>
  );
}

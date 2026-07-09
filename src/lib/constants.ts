
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Navigation items for the admin sidebar.
export interface NavItem {
  title: string;
  href: string;
  icon: string; // lucide icon name resolved in the sidebar
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { title: "Hero", href: "/admin/hero", icon: "Image" },
  { title: "Services", href: "/admin/services", icon: "Briefcase" },
  { title: "About Us", href: "/admin/about", icon: "Info" },
  { title: "Mission & Vision", href: "/admin/mission-vision", icon: "Target" },
  { title: "Partners", href: "/admin/partners", icon: "Handshake" },
  { title: "FAQs", href: "/admin/faqs", icon: "HelpCircle" },
  { title: "Team Members", href: "/admin/team", icon: "Users" },
  { title: "Contact Messages", href: "/admin/contact", icon: "Mail" },
  { title: "Users", href: "/admin/users", icon: "UserCog" },
  { title: "Profile", href: "/admin/profile", icon: "User" },
];

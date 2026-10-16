import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardCheck,
  Gauge,
  History,
  BriefcaseBusiness,
  Settings,
  Target,
  Upload,
  User,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/jobs", label: "Job Matcher", icon: BriefcaseBusiness },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/compare", label: "Compare", icon: ClipboardCheck },
  { href: "/dashboard/skills", label: "Skills", icon: BookOpen },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

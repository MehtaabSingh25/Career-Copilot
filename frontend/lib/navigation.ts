import {
  BarChart3,
  MessageCircle,
  BookOpen,
  ClipboardCheck,
  Gauge,
  History,
  BriefcaseBusiness,
  Sparkles,
  Settings,
  Target,
  Upload,
  User,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/jobs", label: "Job Matcher", icon: BriefcaseBusiness },
  { href: "/dashboard/tailor", label: "Tailor Resume", icon: Sparkles },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/compare", label: "Compare", icon: ClipboardCheck },
  { href: "/dashboard/skills", label: "Skills", icon: BookOpen },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/chat", label: "Career Copilot Chat", icon: MessageCircle },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

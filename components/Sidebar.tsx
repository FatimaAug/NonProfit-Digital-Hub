"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  Calendar,
  FileText,
  Lightbulb,
  Users,
  Home,
  BookOpen,
  Settings,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useApp();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/audit", icon: FileText, label: "Audit" },
    { href: "/audience", icon: Users, label: "Audience" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { href: "/templates", icon: BookOpen, label: "Templates" },
    { href: "/impact-story", icon: Brain, label: "Story Builder" },
    { href: "/kpi", icon: BarChart3, label: "KPI Dashboard" },
    { href: "/recommendations", icon: Lightbulb, label: "Recommendations" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="hidden lg:flex flex-col w-68 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      {/* Header */}
      <div className="px-2 pt-12 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Digital Empowerment Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/settings")
              ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/20"
          }`}
        >
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
}

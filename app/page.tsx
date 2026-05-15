"use client";

import Link from "next/link";
import {
  Activity,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  BarChart3,
  Lightbulb,
  Edit2,
} from "lucide-react";
import { useApp } from "@/lib/context";
import {
  calculateAuditScore,
  calculateCommunicationHealthScore,
} from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { state, setOrganizationName } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [orgName, setOrgName] = useState(state.organization.name);

  const auditScore = calculateAuditScore(state.audit);
  const allPosts = state.calendar.flatMap((c) => c.posts) || [];
  const postsThisWeek = allPosts.length; // Simplified - would need better date logic in production
  const healthScore = calculateCommunicationHealthScore(
    auditScore,
    state.kpi,
    50,
  );

  const navCards = [
    {
      href: "/audit",
      icon: Activity,
      title: "Digital Audit",
      description: "Assess your communication practices",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      href: "/audience",
      icon: Users,
      title: "Audience Map",
      description: "Define your supporter personas",
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      href: "/calendar",
      icon: Calendar,
      title: "30-Day Calendar",
      description: "Plan your content schedule",
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      href: "/templates",
      icon: BookOpen,
      title: "Templates Library",
      description: "Pre-built message templates",
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      href: "/impact-story",
      icon: Brain,
      title: "Story Builder",
      description: "Craft compelling impact stories",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    },
    {
      href: "/kpi",
      icon: BarChart3,
      title: "KPI Dashboard",
      description: "Track communication performance",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
    },
    {
      href: "/recommendations",
      icon: Lightbulb,
      title: "Recommendations",
      description: "Actionable next steps",
      color:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
  ];

  const handleSaveName = () => {
    setOrganizationName(orgName);
    setIsEditingName(false);
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            {isEditingName ? (
              <div className="flex gap-2">
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Organization name"
                  className="max-w-sm"
                />
                <Button size="sm" onClick={handleSaveName}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingName(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {" "}
                  Digital Empowerment Hub
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Edit organization name"
                ></button>
              </div>
            )}
            <p className="text-muted-foreground mt-2">
              Welcome to your Digital Communication Strategy Hub
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Communication Health Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-primary">
                    {healthScore}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall communication
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp size={24} className="text-secondary mx-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Scheduled */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scheduled Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">
                {allPosts.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total in calendar
              </p>
            </CardContent>
          </Card>

          {/* Audit Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Audit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{auditScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Communication gaps
              </p>
            </CardContent>
          </Card>

          {/* Audience Personas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Audience Personas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {state.personas.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.color}`}
                      >
                        <Icon size={24} />
                      </div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Getting Started Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Follow these steps to maximize your toolkit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Complete your Digital Audit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Assess your current communication practices to identify gaps
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Define Audience Personas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create detailed personas for your key supporter segments
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Plan Your Content Calendar
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Schedule balanced, strategic content across all channels
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Create Impact Stories
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share compelling narratives that demonstrate your
                    organization&apos;s impact
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                  5
                </span>
                <div>
                  <p className="font-medium text-foreground">Track Your KPIs</p>
                  <p className="text-sm text-muted-foreground">
                    Measure communication performance and adjust your strategy
                    based on data
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

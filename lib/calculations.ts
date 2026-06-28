import { AuditData, KPIData, Recommendation } from "./types";

export function calculateAuditScore(audit: AuditData): number {
  if (audit.items.length === 0) return 0;

  let totalWeight = 0;
  let scorePoints = 0;

  audit.items.forEach((item) => {
    totalWeight += item.weight;
    if (item.status === "yes") {
      scorePoints += item.weight;
    } else if (item.status === "partial") {
      scorePoints += item.weight * 0.5;
    }
  });

  return Math.round((scorePoints / totalWeight) * 100);
}

export function calculateCommunicationHealthScore(
  auditScore: number,
  kpiData: KPIData,
  calendarCompletionPercent: number,
): number {
  const auditWeight = 0.4;
  const kpiWeight = 0.35;
  const calendarWeight = 0.25;

  let kpiScore = 50;
  if (kpiData.entries.length > 0) {
    const latestEntry = kpiData.entries[kpiData.entries.length - 1];
    const targets = kpiData.monthlyTargets;
    let targetsMet = 0;
    let totalTargets = 0;

    if (targets?.followers && latestEntry.followers) {
      totalTargets++;
      if (latestEntry.followers >= targets.followers) targetsMet++;
    }
    if (targets?.engagement && latestEntry.engagement) {
      totalTargets++;
      if (latestEntry.engagement >= targets.engagement) targetsMet++;
    }
    if (targets?.donationsReceived && latestEntry.donationsReceived) {
      totalTargets++;
      if (latestEntry.donationsReceived >= targets.donationsReceived)
        targetsMet++;
    }

    if (totalTargets > 0) {
      kpiScore = Math.round((targetsMet / totalTargets) * 100);
    }
  }

  const healthScore = Math.round(
    auditScore * auditWeight +
      kpiScore * kpiWeight +
      calendarCompletionPercent * calendarWeight,
  );

  return Math.max(0, Math.min(100, healthScore));
}

export function generateRecommendations(
  auditData: AuditData,
  kpiData: KPIData,
  postsScheduledThisWeek: number,
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Check audit items for gaps
  const gapItems = auditData.items.filter((item) => item.status !== "yes");

  // High priority: Social channels
  const socialChannelItem = gapItems.find(
    (item) => item.id === "social-channels",
  );
  if (socialChannelItem) {
    recommendations.push({
      id: "multi-channel",
      title: "Expand to Multiple Social Media Channels",
      description:
        "Your organization currently uses limited social channels. Expanding to Facebook, Instagram, Twitter, and LinkedIn can help you reach diverse audiences.",
      priority: "high",
      category: "Social Media",
      actionItems: [
        "Audit current channel usage",
        "Set up profiles on 2-3 new platforms",
        "Create channel-specific content strategy",
      ],
    });
  }

  // High priority: Posting frequency
  if (postsScheduledThisWeek < 3) {
    recommendations.push({
      id: "posting-frequency",
      title: "Increase Posting Frequency",
      description: `You're currently scheduling ${postsScheduledThisWeek} posts/week. Aim for at least 3 posts per week to maintain audience engagement.`,
      priority: "high",
      category: "Content Calendar",
      actionItems: [
        "Use the 30-Day Calendar to plan content",
        "Leverage templates to speed up content creation",
        "Schedule posts at optimal times",
      ],
    });
  }

  // High priority: Audience personas
  const audienceItem = gapItems.find(
    (item) => item.id === "audience-targeting",
  );
  if (audienceItem) {
    recommendations.push({
      id: "audience-personas",
      title: "Define Audience Personas",
      description:
        "Without clear audience personas, your messaging may not resonate. Create 3-5 detailed personas representing your key supporter segments.",
      priority: "high",
      category: "Audience Strategy",
      actionItems: [
        "Visit Audience Persona Map to create personas",
        "Include demographics, interests, and communication preferences",
        "Tag calendar posts to specific personas",
      ],
    });
  }

  // Medium priority: Impact storytelling
  const impactItem = gapItems.find((item) => item.id === "impact-storytelling");
  if (impactItem) {
    recommendations.push({
      id: "impact-stories",
      title: "Develop Impact Stories",
      description:
        "Impact stories are crucial for non-profits. They show donors and volunteers the real-world difference your organization makes.",
      priority: "medium",
      category: "Content Strategy",
      actionItems: [
        "Use Impact Story Builder to create compelling narratives",
        "Share one impact story per month minimum",
        "Feature stories across all communication channels",
      ],
    });
  }

  // Medium priority: Email newsletter
  const emailItem = gapItems.find((item) => item.id === "email-newsletter");
  if (emailItem) {
    recommendations.push({
      id: "email-marketing",
      title: "Launch Email Newsletter",
      description:
        "Email remains one of the most effective channels for non-profits. Build your email list and send regular updates.",
      priority: "medium",
      category: "Email Communication",
      actionItems: [
        "Set up email marketing platform (Mailchimp, ConvertKit, etc.)",
        "Create signup forms on website",
        "Schedule monthly or bi-weekly newsletters",
      ],
    });
  }

  // Medium priority: Message clarity
  const messageItem = gapItems.find((item) => item.id === "message-clarity");
  if (messageItem) {
    recommendations.push({
      id: "message-clarity",
      title: "Clarify Core Message",
      description:
        "A clear, consistent message helps supporters understand your mission and impact. Define your core message and messaging pillars.",
      priority: "medium",
      category: "Brand Strategy",
      actionItems: [
        "Document your core mission statement",
        "Define 3-5 messaging pillars",
        "Create messaging guidelines for team",
      ],
    });
  }

  // Low priority: Brand consistency
  const brandItem = gapItems.find((item) => item.id === "branding-consistency");
  if (brandItem) {
    recommendations.push({
      id: "brand-consistency",
      title: "Ensure Brand Consistency",
      description:
        "Consistent branding builds trust and recognition. Audit all channels for visual and verbal consistency.",
      priority: "low",
      category: "Brand Strategy",
      actionItems: [
        "Create brand guidelines document",
        "Audit all channel profiles for consistency",
        "Update outdated branding elements",
      ],
    });
  }

  // Low priority: CTAs
  const ctaItem = gapItems.find((item) => item.id === "call-to-action");
  if (ctaItem) {
    recommendations.push({
      id: "clear-ctas",
      title: "Add Clear Calls-to-Action",
      description:
        "Every post should guide supporters toward a specific action. Add compelling CTAs to your content.",
      priority: "low",
      category: "Content Strategy",
      actionItems: [
        "Review recent posts for weak CTAs",
        "Define action types (donate, volunteer, learn more, etc.)",
        "Update templates with stronger CTAs",
      ],
    });
  }

  const fallbackRecommendations: Recommendation[] = [
    {
      id: "content-variety",
      title: "Increase Content Variety",
      description:
        "A varied mix of posts keeps supporters engaged. Add stories, events, volunteer highlights, and educational content to your calendar.",
      priority: "low",
      category: "Content Strategy",
      actionItems: [
        "Map out a content mix for the next 4 weeks",
        "Experiment with visuals, videos, and carousel posts",
      ],
    },
    {
      id: "profile-optimization",
      title: "Optimize Channel Profiles",
      description:
        "Strong profile bios and visuals help visitors understand your mission quickly. Make sure profiles are complete and consistent across platforms.",
      priority: "low",
      category: "Brand Strategy",
      actionItems: [
        "Review all profile bios and cover images",
        "Link to your website or donation page",
        "Update profile descriptions with clear impact messaging",
      ],
    },
    {
      id: "kpi-tracking",
      title: "Track and Review KPIs Regularly",
      description:
        "Regular KPI reviews help you adjust strategy faster.",
      priority: "medium",
      category: "Performance",
      actionItems: [
        "Schedule monthly KPI review sessions",
        "Compare current data to your targets",
        "Adjust campaigns based on performance trends",
      ],
    },
    {
      id: "nurture-supporters",
      title: "Nurture Supporter Relationships",
      description:
        "Consistent communication builds trust and donor loyalty. Use email and social to keep supporters informed and appreciated.",
      priority: "medium",
      category: "Supporter Engagement",
      actionItems: [
        "Send personalized thank-you messages",
        "Share supporter stories and volunteer spotlights",
        "Create a regular update cadence for donors and volunteers",
      ],
    },
    {
      id: "content-calendar",
      title: "Plan a 30-Day Content Calendar",
      description:
        "Having a full month of planned content makes execution easier and ensures consistent messaging.",
      priority: "medium",
      category: "Content Calendar",
      actionItems: [
        "Block time to plan content for the next 30 days",
        "Use your audit and personas to guide topics",
        "Review and adjust the calendar weekly",
      ],
    },
  ];

  const existingIds = new Set(recommendations.map((rec) => rec.id));
  for (const fallback of fallbackRecommendations) {
    if (recommendations.length >= 8) break;
    if (!existingIds.has(fallback.id)) {
      recommendations.push(fallback);
    }
  }

  return recommendations.slice(0, 8);
}

export function calculateCompletionPercentage(
  auditItems: number,
  personas: number,
  scheduledPosts: number,
  stories: number,
  hasKPIData: boolean,
): number {
  let completedSections = 0;
  let totalSections = 5;

  if (auditItems > 0) completedSections++;
  if (personas > 0) completedSections++;
  if (scheduledPosts > 0) completedSections++;
  if (stories > 0) completedSections++;
  if (hasKPIData) completedSections++;

  return Math.round((completedSections / totalSections) * 100);
}

export function getAuditGaps(
  auditData: AuditData,
): Array<{ category: string; count: number }> {
  const gapsByCategory: Record<string, number> = {};

  auditData.items.forEach((item) => {
    if (item.status !== "yes") {
      gapsByCategory[item.category] = (gapsByCategory[item.category] || 0) + 1;
    }
  });

  return Object.entries(gapsByCategory)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRoadmapMilestones(): Array<{
  week: number;
  milestone: string;
  description: string;
}> {
  return [
    {
      week: 1,
      milestone: "Complete Digital Audit",
      description:
        "Assess your current communication practices and identify gaps.",
    },
    {
      week: 2,
      milestone: "Define Audience Personas",
      description:
        "Create 3-5 detailed personas representing your key audiences.",
    },
    {
      week: 3,
      milestone: "Plan 30-Day Content Calendar",
      description: "Schedule balanced, strategic content across all channels.",
    },
    {
      week: 4,
      milestone: "Launch Posting Schedule",
      description:
        "Start executing your content calendar with consistent posting.",
    },
    {
      week: 6,
      milestone: "Create Impact Stories",
      description: "Develop and share 2-3 compelling impact narratives.",
    },
    {
      week: 8,
      milestone: "Review First KPIs",
      description: "Measure early results and adjust strategy based on data.",
    },
    {
      week: 10,
      milestone: "Optimize Based on Data",
      description: "Double down on what works, refine underperforming areas.",
    },
    {
      week: 12,
      milestone: "Celebrate Progress",
      description: "Review impact achieved and plan next quarter's strategy.",
    },
  ];
}

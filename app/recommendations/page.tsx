'use client';

import { useApp } from '@/lib/context';
import { generateRecommendations, getRoadmapMilestones } from '@/lib/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function RecommendationsPage() {
  const { state } = useApp();

  const allPosts = state.calendar.flatMap((c) => c.posts) || [];
  const postsScheduledThisWeek = allPosts.length; // Simplified

  const recommendations = generateRecommendations(state.audit, state.kpi, postsScheduledThisWeek);
  const roadmap = getRoadmapMilestones();

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const getPriorityColor = (
    priority: 'high' | 'medium' | 'low'
  ): { bg: string; text: string; icon: typeof AlertCircle } => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-700 dark:text-red-300',
          icon: AlertCircle,
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: AlertTriangle,
        };
      case 'low':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-700 dark:text-blue-300',
          icon: Lightbulb,
        };
    }
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Recommendations & Roadmap</h1>
        <p className="text-muted-foreground mt-2">
          Actionable next steps based on your audit and performance data
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {recommendations.filter((r) => r.priority === 'high').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {recommendations.filter((r) => r.priority === 'medium').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {recommendations.filter((r) => r.priority === 'low').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Actionable Recommendations</h2>
          <div className="space-y-4">
            {sortedRecommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
                  <p className="text-foreground font-semibold">Excellent work!</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    You&apos;re meeting all the recommended communication practices.
                  </p>
                </CardContent>
              </Card>
            ) : (
              sortedRecommendations.map((rec) => {
                const priorityColor = getPriorityColor(rec.priority);
                const Icon = priorityColor.icon;

                return (
                  <Card key={rec.id}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${priorityColor.bg} flex-shrink-0`}
                        >
                          <Icon className={`${priorityColor.text}`} size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle>{rec.title}</CardTitle>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor.bg} ${priorityColor.text}`}
                            >
                              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                            </span>
                          </div>
                          <CardDescription className="mt-2">
                            {rec.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    {rec.actionItems && rec.actionItems.length > 0 && (
                      <CardContent>
                        <p className="text-sm font-medium text-foreground mb-3">Action Items:</p>
                        <ul className="space-y-2">
                          {rec.actionItems.map((item, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="flex-shrink-0">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* 90-Day Roadmap */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">90-Day Roadmap</h2>
          <div className="space-y-4">
            {roadmap.map((milestone, idx) => (
              <Card key={milestone.week}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      W{milestone.week}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{milestone.milestone}</CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>How to Measure Success</CardTitle>
            <CardDescription>
              Focus on these metrics to track improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-foreground mb-2">Engagement Metrics</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Follower growth rate</li>
                  <li>• Post engagement rate (likes, comments, shares)</li>
                  <li>• Email open rate</li>
                  <li>• Website click-through rate</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Impact Metrics</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Donations received</li>
                  <li>• Volunteer signups</li>
                  <li>• Event attendance</li>
                  <li>• Newsletter subscriptions</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Strategy Metrics</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Content calendar completion</li>
                  <li>• Posting frequency</li>
                  <li>• Message consistency</li>
                  <li>• Brand sentiment</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Best Practices</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Post 3+ times per week</li>
                  <li>• Share monthly impact stories</li>
                  <li>• Maintain brand consistency</li>
                  <li>• Segment audience targeting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pro Tips for Success</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-foreground">Start with the Audit</p>
              <p className="text-sm text-muted-foreground">
                Your audit score reveals your biggest gaps. Focus on these first for the most impact.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Build Slowly and Sustainably</p>
              <p className="text-sm text-muted-foreground">
                Don&apos;t try to fix everything at once. Pick 2-3 recommendations and master them
                before moving on.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Measure Everything</p>
              <p className="text-sm text-muted-foreground">
                Use the KPI Dashboard to track progress. Data-driven decisions lead to better results.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Tell Your Story</p>
              <p className="text-sm text-muted-foreground">
                Impact stories are your most powerful marketing tool. Create them regularly and share
                widely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

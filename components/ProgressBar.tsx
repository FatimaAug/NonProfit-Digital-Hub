'use client';

import { useApp } from '@/lib/context';
import { calculateCompletionPercentage } from '@/lib/calculations';

export function ProgressBar() {
  const { state } = useApp();

  const allPosts = state.calendar.flatMap((c) => c.posts) || [];
  const hasKPIData = state.kpi.entries.length > 0;

  const percentage = calculateCompletionPercentage(
    state.audit.items.length,
    state.personas.length,
    allPosts.length,
    state.impactStories.length,
    hasKPIData
  );

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

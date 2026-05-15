'use client';

import { useApp } from '@/lib/context';
import { calculateAuditScore, getAuditGaps } from '@/lib/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertCircle, Download } from 'lucide-react';
import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';

export default function AuditPage() {
  const { state, updateState } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const auditScore = calculateAuditScore(state.audit);
  const gaps = getAuditGaps(state.audit);

  const handleStatusChange = (itemId: string, newStatus: 'yes' | 'no' | 'partial') => {
    const updatedItems = state.audit.items.map((item) =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    updateState({
      audit: { ...state.audit, items: updatedItems },
    });
  };

  const handleDownloadReport = () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `audit-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const groupedItems = state.audit.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof state.audit.items>
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Digital Communication Audit</h1>
        <p className="text-muted-foreground mt-2">
          Assess your current communication practices and identify improvement areas
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Audit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(auditScore)}`}>{auditScore}%</div>
              <p className="text-sm text-muted-foreground mt-2">
                {auditScore >= 80
                  ? 'Excellent communication practices'
                  : auditScore >= 60
                    ? 'Good foundation, room for improvement'
                    : auditScore >= 40
                      ? 'Significant gaps to address'
                      : 'Requires comprehensive strategy'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Items Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {state.audit.items.filter((i) => i.status === 'yes').length}/
                {state.audit.items.length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Audit items verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gap Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{gaps.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Categories needing attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Download Report */}
        <div className="flex justify-end">
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download size={18} />
            Download Report
          </Button>
        </div>

        {/* Audit Items by Category */}
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category}>
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category ? null : category)
                }
                className="w-full text-left"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{category}</CardTitle>
                      <CardDescription>
                        {items.filter((i) => i.status === 'yes').length} of {items.length} items
                        verified
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${getScoreBgColor(
                          Math.round(
                            (items.filter((i) => i.status === 'yes').length / items.length) * 100
                          )
                        )}`}
                      >
                        <span className={getScoreColor(
                          Math.round(
                            (items.filter((i) => i.status === 'yes').length / items.length) * 100
                          )
                        )}>
                          {Math.round(
                            (items.filter((i) => i.status === 'yes').length / items.length) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </button>

              {expandedCategory === category && (
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Weight: {item.weight}x
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(item.id, 'yes')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.status === 'yes'
                                ? 'bg-green-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'partial')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.status === 'partial'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            Partial
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'no')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.status === 'no'
                                ? 'bg-red-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Hidden report for PDF */}
        <div ref={reportRef} className="hidden">
          <div style={{ padding: '20px', fontSize: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              Digital Communication Audit Report
            </h1>
            <p style={{ marginBottom: '20px' }}>
              Generated: {new Date().toLocaleDateString()} | Organization:{' '}
              {state.organization.name}
            </p>

            <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                Audit Score Summary
              </h2>
              <p>
                Overall Score: <strong>{auditScore}%</strong>
              </p>
              <p>
                Items Completed:{' '}
                <strong>
                  {state.audit.items.filter((i) => i.status === 'yes').length}/
                  {state.audit.items.length}
                </strong>
              </p>
              <p>Gap Areas: {gaps.length}</p>
            </div>

            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {category}
                </h3>
                <ul style={{ marginLeft: '20px' }}>
                  {items.map((item) => (
                    <li key={item.id} style={{ marginBottom: '5px' }}>
                      {item.question} -{' '}
                      <strong>
                        {item.status === 'yes'
                          ? '✓ Yes'
                          : item.status === 'partial'
                            ? '◐ Partial'
                            : '✗ No'}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {gaps.length > 0 && (
              <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  Priority Gap Areas
                </h2>
                <ol style={{ marginLeft: '20px' }}>
                  {gaps.map((gap, idx) => (
                    <li key={gap.category} style={{ marginBottom: '5px' }}>
                      {gap.category} ({gap.count} items)
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

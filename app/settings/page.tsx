'use client';

import { useApp } from '@/lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { clearAppState, defaultAppState } from '@/lib/storage';
import { AlertCircle, Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { state, setOrganizationName } = useApp();
  const { theme, setTheme } = useTheme();
  const [orgName, setOrgName] = useState(state.organization.name);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveOrganization = () => {
    setOrganizationName(orgName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetAllData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      clearAppState();
      window.location.reload();
    }
  };

  const handleDownloadAllData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nonprofit-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!mounted) return null;

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your organization and app preferences</p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8 max-w-2xl">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>Update your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Organization Name</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Your organization name"
                />
                <Button onClick={handleSaveOrganization}>Save</Button>
              </div>
              {isSaved && (
                <p className="text-sm text-green-600 mt-2">✓ Changes saved</p>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                About This App
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">NonProfit Digital Hub</span> helps
                  your organization develop a strategic digital communication approach.
                </p>
                <p>
                  All your data is stored locally on your device. No information is sent to servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Theme</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Sun size={18} />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Moon size={18} />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'system'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    🖥️ System
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or reset your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  All your data is stored locally in your browser. Regular backups are recommended.
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Export Your Data</p>
              <p className="text-sm text-muted-foreground mb-3">
                Download a backup of all your data as a JSON file. You can use this to restore
                your data later.
              </p>
              <Button onClick={handleDownloadAllData} variant="outline" className="w-full">
                📥 Download Backup
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Reset All Data</p>
              <p className="text-sm text-muted-foreground mb-3">
                Clear all data and start fresh. This action cannot be undone.
              </p>
              <Button onClick={handleResetAllData} variant="destructive" className="w-full">
                🗑️ Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Name:</span>
              <span className="font-medium">NonProfit Digital Hub</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Location:</span>
              <span className="font-medium">Browser Local Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Built with:</span>
              <span className="font-medium">Next.js, React, TypeScript</span>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Getting Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Have questions? Check out these resources:
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Feature Guide:\n\n• Dashboard: Overview of your communication health\n• Audit: Assess current practices\n• Audience: Define supporter personas\n• Calendar: Plan content schedule\n• Templates: Pre-built message templates\n• Story Builder: Create impact narratives\n• KPI Dashboard: Track performance metrics\n• Recommendations: Get actionable next steps'
                    );
                  }}
                >
                  Feature Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Best Practices:\n\n1. Start with the Audit to identify gaps\n2. Create 3-5 audience personas\n3. Schedule content 2-4 weeks in advance\n4. Post consistently (3+ times per week)\n5. Share impact stories monthly\n6. Track KPIs and measure progress\n7. Adjust strategy based on data'
                    );
                  }}
                >
                  Best Practices
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Keyboard Shortcuts:\n\nThis version does not include keyboard shortcuts yet.\n\nFeature Coming Soon! 🚀'
                    );
                  }}
                >
                  Keyboard Shortcuts
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

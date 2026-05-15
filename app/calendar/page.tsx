'use client';

import { useApp } from '@/lib/context';
import { CalendarPost, ContentType, Platform, PostStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import Papa from 'papaparse';

export default function CalendarPage() {
  const { state, updateState } = useApp();
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().substring(0, 7) // YYYY-MM format
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'facebook' as Platform,
    contentType: 'awareness' as ContentType,
    messageDraft: '',
    targetPersonaId: '',
    status: 'draft' as PostStatus,
  });

  const contentTypeColors: Record<ContentType, string> = {
    awareness: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    donation: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    volunteer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    event: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    'thank-you': 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
    story: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  };

  const platformLabels = {
    facebook: 'FB',
    instagram: 'IG',
    twitter: 'X',
    linkedin: 'LI',
    email: '✉️',
  };

  // Get calendar data for current month
  let monthData = state.calendar.find((c) => c.month === currentMonth);
  if (!monthData) {
    monthData = { month: currentMonth, posts: [] };
  }

  const daysInMonth = new Date(currentMonth + '-01').getMonth() === 11
    ? 31
    : new Date(parseInt(currentMonth) + 1, 0, 0).getDate();

  const handlePrevMonth = () => {
    const date = new Date(currentMonth + '-01');
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().substring(0, 7));
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + '-01');
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString().substring(0, 7));
  };

  const handleSavePost = () => {
    if (!selectedDate || !formData.messageDraft) return;

    const newPost: CalendarPost = {
      id: editingPostId || `post-${Date.now()}`,
      date: selectedDate,
      platform: formData.platform,
      contentType: formData.contentType,
      messageDraft: formData.messageDraft,
      targetPersonaId: formData.targetPersonaId,
      status: formData.status,
    };

    let updated = [...(monthData?.posts || [])];
    if (editingPostId) {
      updated = updated.map((p) => (p.id === editingPostId ? newPost : p));
      setEditingPostId(null);
    } else {
      updated.push(newPost);
    }

    // Update or add calendar entry
    const calendarData = state.calendar.filter((c) => c.month !== currentMonth);
    if (updated.length > 0) {
      calendarData.push({ month: currentMonth, posts: updated });
    }

    updateState({ calendar: calendarData });
    setShowForm(false);
    setSelectedDate(null);
    setFormData({
      platform: 'facebook',
      contentType: 'awareness',
      messageDraft: '',
      targetPersonaId: '',
      status: 'draft',
    });
  };

  const handleDeletePost = (postId: string) => {
    const updated = (monthData?.posts || []).filter((p) => p.id !== postId);
    const calendarData = state.calendar.filter((c) => c.month !== currentMonth);
    if (updated.length > 0) {
      calendarData.push({ month: currentMonth, posts: updated });
    }
    updateState({ calendar: calendarData });
  };

  const handleEditPost = (post: CalendarPost) => {
    setSelectedDate(post.date);
    setFormData({
      platform: post.platform,
      contentType: post.contentType,
      messageDraft: post.messageDraft,
      targetPersonaId: post.targetPersonaId || '',
      status: post.status,
    });
    setEditingPostId(post.id);
    setShowForm(true);
  };

  const handleQuickFill = () => {
    const contentTypes: ContentType[] = [
      'awareness',
      'donation',
      'volunteer',
      'event',
      'thank-you',
      'story',
    ];
    const platforms: Platform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'email'];

    const newPosts: CalendarPost[] = [];
    for (let day = 1; day <= Math.min(30, daysInMonth); day++) {
      const dayStr = day.toString().padStart(2, '0');
      const date = `${currentMonth}-${dayStr}`;

      // Create 2-3 posts per week for balanced schedule
      const dayOfWeek = new Date(date).getDay();
      if ([1, 3, 5].includes(dayOfWeek)) {
        // Mon, Wed, Fri
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

        newPosts.push({
          id: `post-${date}-${Math.random()}`,
          date,
          platform,
          contentType,
          messageDraft: `[${contentType.toUpperCase()}] Share your ${contentType} message here`,
          status: 'draft',
        });
      }
    }

    const calendarData = state.calendar.filter((c) => c.month !== currentMonth);
    calendarData.push({ month: currentMonth, posts: newPosts });
    updateState({ calendar: calendarData });
  };

  const handleDownloadCSV = () => {
    const csvData = (monthData?.posts || []).map((post) => ({
      Date: post.date,
      Platform: post.platform,
      'Content Type': post.contentType,
      Message: post.messageDraft.substring(0, 50) + '...',
      Status: post.status,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-${currentMonth}.csv`;
    a.click();
  };

  const getPostsForDate = (day: number) => {
    const dayStr = day.toString().padStart(2, '0');
    const date = `${currentMonth}-${dayStr}`;
    return (monthData?.posts || []).filter((p) => p.date === date);
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">30-Day Content Calendar</h1>
        <p className="text-muted-foreground mt-2">Plan and schedule your strategic content</p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-foreground min-w-40">
              {new Date(currentMonth + '-01').toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleQuickFill} variant="outline">
              Quick Fill (2-3/week)
            </Button>
            <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
              <Download size={18} />
              Export CSV
            </Button>
            <Button onClick={() => {
              setSelectedDate(new Date().toISOString().substring(0, 10));
              setShowForm(true);
            }} className="gap-2">
              <Plus size={18} />
              Add Post
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{monthData?.posts.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">
                {(monthData?.posts || []).filter((p) => p.status === 'scheduled').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {(monthData?.posts || []).filter((p) => p.status === 'draft').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {(monthData?.posts || []).filter((p) => p.status === 'posted').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-semibold text-muted-foreground bg-muted/50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: 42 }).map((_, idx) => {
                const firstDayOfMonth = new Date(currentMonth + '-01').getDay();
                const dayNumber = idx - firstDayOfMonth + 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                const dayStr = dayNumber.toString().padStart(2, '0');
                const date = `${currentMonth}-${dayStr}`;
                const posts = isCurrentMonth ? getPostsForDate(dayNumber) : [];

                return (
                  <div
                    key={idx}
                    className={`min-h-32 border-b border-r border-border p-2 ${
                      !isCurrentMonth ? 'bg-muted/30' : 'hover:bg-muted/20 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (isCurrentMonth) {
                        setSelectedDate(date);
                        setShowForm(true);
                      }
                    }}
                  >
                    {isCurrentMonth && (
                      <>
                        <div className="font-semibold text-sm mb-2 text-foreground">
                          {dayNumber}
                        </div>
                        <div className="space-y-1">
                          {posts.map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs p-1 rounded ${contentTypeColors[post.contentType]} cursor-default`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(post);
                              }}
                            >
                              <span className="font-medium">{platformLabels[post.platform]}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showForm && selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPostId ? 'Edit Post' : 'Add Post'} - {selectedDate}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value as Platform })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Content Type</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) =>
                      setFormData({ ...formData, contentType: e.target.value as ContentType })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="awareness">Awareness</option>
                    <option value="donation">Donation Ask</option>
                    <option value="volunteer">Volunteer Recruitment</option>
                    <option value="event">Event</option>
                    <option value="thank-you">Thank You</option>
                    <option value="story">Impact Story</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Target Persona (optional)</label>
                <select
                  value={formData.targetPersonaId}
                  onChange={(e) =>
                    setFormData({ ...formData, targetPersonaId: e.target.value })
                  }
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select a persona...</option>
                  {state.personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Message Draft</label>
                <textarea
                  value={formData.messageDraft}
                  onChange={(e) =>
                    setFormData({ ...formData, messageDraft: e.target.value })
                  }
                  placeholder="Write your post message..."
                  className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground min-h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.messageDraft.length} characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as PostStatus })
                  }
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="posted">Posted</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedDate(null);
                    setEditingPostId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePost}>
                  {editingPostId ? 'Update Post' : 'Add Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List View */}
        {(monthData?.posts || []).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Posts for {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <div className="space-y-3">
              {(monthData?.posts || [])
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex gap-2 items-center mb-2">
                            <span className="text-sm font-semibold text-muted-foreground">
                              {post.date}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${contentTypeColors[post.contentType]}`}>
                              {post.contentType}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {platformLabels[post.platform]}
                            </span>
                          </div>
                          <p className="text-foreground">{post.messageDraft}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

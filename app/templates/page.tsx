'use client';

import { useApp } from '@/lib/context';
import { MessageTemplate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Copy, Plus, Check } from 'lucide-react';
import { useState } from 'react';

export default function TemplatesPage() {
  const { state, updateState } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'donation_appeal' as const,
    content: '',
  });

  const categories = [
    { id: 'donation_appeal', label: 'Donation Appeal', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
    { id: 'volunteer_recruitment', label: 'Volunteer Recruitment', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
    { id: 'event_announcement', label: 'Event Announcement', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' },
    { id: 'thank_you', label: 'Thank You', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300' },
    { id: 'impact_story', label: 'Impact Story', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? state.templates
    : state.templates.filter((t) => t.category === selectedCategory);

  const handleCreateTemplate = () => {
    if (!formData.name || !formData.content) return;

    const newTemplate: MessageTemplate = {
      id: editingId || `template-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      content: formData.content,
      isCustom: true,
    };

    if (editingId) {
      const updated = state.templates.map((t) => (t.id === editingId ? newTemplate : t));
      updateState({ templates: updated });
      setEditingId(null);
    } else {
      updateState({ templates: [...state.templates, newTemplate] });
    }

    setFormData({ name: '', category: 'donation_appeal', content: '' });
    setShowCreateForm(false);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
    });
    setEditingId(template.id);
    setShowCreateForm(true);
  };

  const handleDeleteTemplate = (id: string) => {
    updateState({ templates: state.templates.filter((t) => t.id !== id) });
  };

  const handleCopyTemplate = (content: string, templateId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(templateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || '';
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label || '';
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Templates Library</h1>
        <p className="text-muted-foreground mt-2">
          Pre-built message templates organized by communication type
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Create Template Button */}
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus size={18} />
            Create Custom Template
          </Button>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Template' : 'Create Custom Template'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Template Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Year-End Fundraising Appeal"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Template Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your template content here. Use [PLACEHOLDERS] for customizable fields."
                  className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground min-h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Use [PLACEHOLDER] for fields users can customize
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingId(null);
                    setFormData({ name: '', category: 'donation_appeal', content: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>
                  {editingId ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({state.templates.length})
          </button>
          {categories.map((cat) => {
            const count = state.templates.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No templates found in this category.</p>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedCategory === 'all'
                  ? 'Create your first custom template to get started.'
                  : 'Switch to another category or create a custom template.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                          {getCategoryLabel(template.category)}
                        </span>
                      </CardDescription>
                    </div>
                    {template.isCustom && (
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{template.content}</p>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleCopyTemplate(template.content, template.id)}
                      variant="outline"
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </Button>

                    {template.isCustom && (
                      <>
                        <Button
                          onClick={() => handleEditTemplate(template)}
                          variant="outline"
                          size="sm"
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-foreground">Use Placeholders for Flexibility</p>
              <p className="text-sm text-muted-foreground">
                Include [PLACEHOLDERS] in your templates so users can customize them for their specific needs. For example: [PERSON_NAME], [AMOUNT], [DATE]
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Adapt for Different Channels</p>
              <p className="text-sm text-muted-foreground">
                Create variations of the same template for different platforms. A LinkedIn donor appeal looks different from a Facebook one.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Test Before Using</p>
              <p className="text-sm text-muted-foreground">
                Copy a template and test it with a small segment first. Measure engagement and refine based on results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

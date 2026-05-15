'use client';

import { useApp } from '@/lib/context';
import { ImpactStory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Copy, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ImpactStoryPage() {
  const { state, updateState } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    problem: '',
    action: '',
    result: '',
    humanElement: '',
    callToAction: '',
  });

  const steps = [
    {
      number: 1,
      title: 'The Problem',
      description: 'What challenge or issue did you address?',
      key: 'problem' as const,
      placeholder: 'Maria struggled to find affordable healthcare for her family. She worked full-time but still couldn\'t afford the costs...',
    },
    {
      number: 2,
      title: 'The Action',
      description: 'What did your organization do?',
      key: 'action' as const,
      placeholder: 'Through our community health initiative, we provided Maria and her family with access to free health screenings and affordable medication...',
    },
    {
      number: 3,
      title: 'The Result',
      description: 'What changed? Include numbers if possible.',
      key: 'result' as const,
      placeholder: 'Within 6 months, Maria\'s family received 4 health checks, preventing what could have been serious complications. Maria now volunteers to help others like herself.',
    },
    {
      number: 4,
      title: 'The Human Element',
      description: 'Add a quote or personal insight.',
      key: 'humanElement' as const,
      placeholder: '"I never thought I\'d get the healthcare my family deserves. Now my children are healthy and thriving. I\'m grateful and I want to give back." - Maria',
    },
    {
      number: 5,
      title: 'The Call to Action',
      description: 'What should the reader do next?',
      key: 'callToAction' as const,
      placeholder: 'Help us provide healthcare to more families like Maria\'s. Your $25 provides a health screening. Donate today to change a life.',
    },
  ];

  const handleSaveStory = () => {
    if (!formData.problem || !formData.action || !formData.result) return;

    const newStory: ImpactStory = {
      id: editingId || `story-${Date.now()}`,
      problem: formData.problem,
      action: formData.action,
      result: formData.result,
      humanElement: formData.humanElement,
      callToAction: formData.callToAction,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      const updated = state.impactStories.map((s) => (s.id === editingId ? newStory : s));
      updateState({ impactStories: updated });
      setEditingId(null);
    } else {
      updateState({ impactStories: [...state.impactStories, newStory] });
    }

    setFormData({
      problem: '',
      action: '',
      result: '',
      humanElement: '',
      callToAction: '',
    });
    setShowBuilder(false);
  };

  const handleEditStory = (story: ImpactStory) => {
    setFormData({
      problem: story.problem,
      action: story.action,
      result: story.result,
      humanElement: story.humanElement,
      callToAction: story.callToAction,
    });
    setEditingId(story.id);
    setShowBuilder(true);
    setExpandedStep(1);
  };

  const handleDeleteStory = (id: string) => {
    updateState({ impactStories: state.impactStories.filter((s) => s.id !== id) });
  };

  const handleCopyStory = (story: ImpactStory, storyId: string) => {
    const fullStory = `${story.problem}\n\n${story.action}\n\n${story.result}\n\n${story.humanElement}\n\n${story.callToAction}`;
    navigator.clipboard.writeText(fullStory);
    setCopiedId(storyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const builtStory = `${formData.problem}${formData.problem && formData.action ? '\n\n' : ''}${formData.action}${formData.action && formData.result ? '\n\n' : ''}${formData.result}${formData.result && formData.humanElement ? '\n\n' : ''}${formData.humanElement}${formData.humanElement && formData.callToAction ? '\n\n' : ''}${formData.callToAction}`;

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Impact Story Builder</h1>
        <p className="text-muted-foreground mt-2">
          Craft compelling narratives that demonstrate your organization&apos;s impact
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Create Story Button */}
        {!showBuilder && (
          <Button onClick={() => setShowBuilder(true)} className="gap-2">
            <Plus size={18} />
            Create New Story
          </Button>
        )}

        {/* Story Builder */}
        {showBuilder && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Story Builder</CardTitle>
                  <CardDescription>
                    {editingId ? 'Edit your impact story' : 'Follow these 5 steps to create a compelling story'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedStep(expandedStep === step.number ? -1 : step.number)
                        }
                        className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors"
                      >
                        <div className="text-left">
                          <p className="font-semibold text-foreground">
                            Step {step.number}: {step.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        {expandedStep === step.number ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>

                      {expandedStep === step.number && (
                        <div className="p-4 border-t border-border bg-muted/30">
                          <textarea
                            value={formData[step.key]}
                            onChange={(e) =>
                              setFormData({ ...formData, [step.key]: e.target.value })
                            }
                            placeholder={step.placeholder}
                            className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-32"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            {formData[step.key].length} characters
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowBuilder(false);
                    setEditingId(null);
                    setFormData({
                      problem: '',
                      action: '',
                      result: '',
                      humanElement: '',
                      callToAction: '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveStory} className="flex-1">
                  {editingId ? 'Update Story' : 'Save Story'}
                </Button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See your story as you build it</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 min-h-96 max-h-96 overflow-y-auto">
                    {builtStory ? (
                      <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                        {builtStory}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        Start filling in the steps to see your story preview here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <div key={step.number} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            formData[step.key] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {formData[step.key] ? '✓' : step.number}
                        </div>
                        <span
                          className={
                            formData[step.key]
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    {Object.values(formData).filter((v) => v).length}/5 steps completed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Saved Stories */}
        {!showBuilder && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Your Stories ({state.impactStories.length})
            </h2>

            {state.impactStories.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">No impact stories created yet.</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create at least one story to demonstrate your organization&apos;s impact.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {state.impactStories.map((story) => (
                  <Card key={story.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(story.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopyStory(story, story.id)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            {copiedId === story.id ? (
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
                          <Button
                            onClick={() => handleEditStory(story)}
                            variant="outline"
                            size="sm"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteStory(story.id)}
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {story.problem && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">
                              The Problem
                            </p>
                            <p className="text-foreground text-sm">{story.problem}</p>
                          </div>
                        )}
                        {story.action && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">
                              The Action
                            </p>
                            <p className="text-foreground text-sm">{story.action}</p>
                          </div>
                        )}
                        {story.result && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">
                              The Result
                            </p>
                            <p className="text-foreground text-sm">{story.result}</p>
                          </div>
                        )}
                        {story.humanElement && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">
                              Human Element
                            </p>
                            <p className="text-foreground text-sm italic">{story.humanElement}</p>
                          </div>
                        )}
                        {story.callToAction && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-1">
                              Call to Action
                            </p>
                            <p className="text-foreground text-sm">{story.callToAction}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {!showBuilder && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storytelling Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground">Make it Personal</p>
                <p className="text-sm text-muted-foreground">
                  Use real names and specific details. People connect with stories about real people.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Show, Don&apos;t Just Tell</p>
                <p className="text-sm text-muted-foreground">
                  Include concrete details and outcomes. Instead of &quot;helped improve health,&quot; say &quot;reduced
                  emergency room visits by 40%.&quot;
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">End with Action</p>
                <p className="text-sm text-muted-foreground">
                  Always include a clear call to action. What do you want the reader to do after
                  reading this story?
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Keep it Concise</p>
                <p className="text-sm text-muted-foreground">
                  Aim for 200-400 words total. People have short attention spans, so make every word count.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

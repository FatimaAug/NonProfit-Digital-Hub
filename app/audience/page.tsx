'use client';

import { useApp } from '@/lib/context';
import { AudiencePersona } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AudiencePage() {
  const { state, updateState } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AudiencePersona>>({
    name: '',
    ageRange: '',
    interests: [],
    preferredPlatform: 'facebook',
    communicationGoal: 'donor',
  });
  const [interestInput, setInterestInput] = useState('');

  const handleAddPersona = () => {
    if (!formData.name || !formData.ageRange) return;

    const newPersona: AudiencePersona = {
      id: editingId || `persona-${Date.now()}`,
      name: formData.name,
      ageRange: formData.ageRange,
      interests: formData.interests || [],
      preferredPlatform: formData.preferredPlatform || 'facebook',
      communicationGoal: formData.communicationGoal || 'donor',
      description: formData.description,
    };

    if (editingId) {
      const updated = state.personas.map((p) => (p.id === editingId ? newPersona : p));
      updateState({ personas: updated });
      setEditingId(null);
    } else {
      updateState({ personas: [...state.personas, newPersona] });
    }

    setFormData({
      name: '',
      ageRange: '',
      interests: [],
      preferredPlatform: 'facebook',
      communicationGoal: 'donor',
    });
    setShowForm(false);
  };

  const handleEditPersona = (persona: AudiencePersona) => {
    setFormData(persona);
    setEditingId(persona.id);
    setShowForm(true);
  };

  const handleDeletePersona = (id: string) => {
    updateState({ personas: state.personas.filter((p) => p.id !== id) });
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      setFormData({
        ...formData,
        interests: [...(formData.interests || []), interestInput.trim()],
      });
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData({
      ...formData,
      interests: (formData.interests || []).filter((_, i) => i !== index),
    });
  };

  const platformLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    email: 'Email',
  };

  const goalLabels = {
    donor: 'Donor',
    volunteer: 'Volunteer',
    community_member: 'Community Member',
    partner: 'Partner',
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">Audience Persona Map</h1>
        <p className="text-muted-foreground mt-2">
          Define and understand your key supporter segments
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Add New Persona Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={18} />
            Add New Persona
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Persona' : 'Create New Persona'}</CardTitle>
              <CardDescription>
                Define a persona representing a key segment of your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Persona Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Active Donor, Young Volunteer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Age Range</label>
                  <Input
                    value={formData.ageRange || ''}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    placeholder="e.g., 25-35, 55+"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this persona..."
                  className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground min-h-24"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Interests</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="Add an interest and press Enter"
                  />
                  <Button onClick={handleAddInterest} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.interests || []).map((interest, idx) => (
                    <div
                      key={idx}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(idx)}
                        className="hover:opacity-70"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Preferred Platform</label>
                  <select
                    value={formData.preferredPlatform || 'facebook'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredPlatform: e.target.value as any,
                      })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    {Object.entries(platformLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Communication Goal</label>
                  <select
                    value={formData.communicationGoal || 'donor'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationGoal: e.target.value as any,
                      })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    {Object.entries(goalLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      ageRange: '',
                      interests: [],
                      preferredPlatform: 'facebook',
                      communicationGoal: 'donor',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPersona}>
                  {editingId ? 'Update Persona' : 'Create Persona'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personas Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Personas ({state.personas.length})</h2>
          {state.personas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No personas created yet.</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Create 3-5 personas to represent your key audience segments.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.personas.map((persona) => (
                <Card key={persona.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{persona.name}</CardTitle>
                        <CardDescription>{persona.ageRange}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPersona(persona)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePersona(persona.id)}
                          className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    {persona.description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm text-foreground">{persona.description}</p>
                      </div>
                    )}

                    {persona.interests.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {persona.interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform</span>
                        <span className="font-medium">
                          {platformLabels[persona.preferredPlatform]}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Goal</span>
                        <span className="font-medium">{goalLabels[persona.communicationGoal]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

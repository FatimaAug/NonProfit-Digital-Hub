// Core types for NonProfit Digital Hub

export interface Organization {
  name: string;
  logo?: string;
}

export interface AuditItem {
  id: string;
  category: string;
  question: string;
  status: 'yes' | 'no' | 'partial';
  weight: number;
}

export interface AuditData {
  items: AuditItem[];
  completedAt?: string;
}

export interface AudiencePersona {
  id: string;
  name: string;
  ageRange: string;
  interests: string[];
  preferredPlatform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email';
  communicationGoal: 'donor' | 'volunteer' | 'community_member' | 'partner';
  description?: string;
}

export type ContentType = 'awareness' | 'donation' | 'volunteer' | 'event' | 'thank-you' | 'story';
export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email';
export type PostStatus = 'draft' | 'scheduled' | 'posted';

export interface CalendarPost {
  id: string;
  date: string;
  platform: Platform;
  contentType: ContentType;
  messageDraft: string;
  targetPersonaId?: string;
  status: PostStatus;
}

export interface CalendarData {
  month: string; // YYYY-MM format
  posts: CalendarPost[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'donation_appeal' | 'volunteer_recruitment' | 'event_announcement' | 'thank_you' | 'impact_story';
  content: string;
  isCustom?: boolean;
}

export interface ImpactStory {
  id: string;
  problem: string;
  action: string;
  result: string;
  humanElement: string;
  callToAction: string;
  createdAt: string;
}

export interface KPIEntry {
  date: string;
  followers?: number;
  postReach?: number;
  engagement?: number; // likes + comments + shares
  emailOpenRate?: number;
  websiteVisits?: number;
  donationsReceived?: number;
  volunteerSignups?: number;
}

export interface KPIData {
  entries: KPIEntry[];
  monthlyTargets?: {
    followers?: number;
    postReach?: number;
    engagement?: number;
    emailOpenRate?: number;
    websiteVisits?: number;
    donationsReceived?: number;
    volunteerSignups?: number;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionItems?: string[];
}

export interface AppState {
  organization: Organization;
  audit: AuditData;
  personas: AudiencePersona[];
  calendar: CalendarData[];
  templates: MessageTemplate[];
  impactStories: ImpactStory[];
  kpi: KPIData;
  recommendations: Recommendation[];
  darkMode: boolean;
}

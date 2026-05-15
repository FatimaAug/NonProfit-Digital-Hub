import { AppState } from './types';

const STORAGE_KEY = 'nonprofit-hub-app-state';

export const defaultAppState: AppState = {
  organization: {
    name: 'Your Organization',
  },
  audit: {
    items: [
      {
        id: 'social-channels',
        category: 'Social Media Presence',
        question: 'Do you have a presence on multiple social media channels?',
        status: 'no',
        weight: 2,
      },
      {
        id: 'posting-frequency',
        category: 'Posting Frequency',
        question: 'Do you post at least 3 times per week?',
        status: 'no',
        weight: 2,
      },
      {
        id: 'message-clarity',
        category: 'Message Clarity',
        question: 'Is your core message clear and consistent?',
        status: 'no',
        weight: 1.5,
      },
      {
        id: 'audience-targeting',
        category: 'Audience Targeting',
        question: 'Do you have defined audience personas?',
        status: 'no',
        weight: 2,
      },
      {
        id: 'impact-storytelling',
        category: 'Impact Communication',
        question: 'Do you regularly share impact stories?',
        status: 'no',
        weight: 2,
      },
      {
        id: 'branding-consistency',
        category: 'Brand Consistency',
        question: 'Is your branding consistent across channels?',
        status: 'no',
        weight: 1.5,
      },
      {
        id: 'email-newsletter',
        category: 'Email Communication',
        question: 'Do you have an active email newsletter?',
        status: 'no',
        weight: 2,
      },
      {
        id: 'call-to-action',
        category: 'Engagement',
        question: 'Do your posts have clear calls-to-action?',
        status: 'no',
        weight: 1.5,
      },
    ],
  },
  personas: [],
  calendar: [],
  templates: [
    {
      id: 'donation-appeal-1',
      name: 'General Donation Ask',
      category: 'donation_appeal',
      content: 'Help us make a difference! Your donation will directly support [PROGRAM/CAUSE]. Every contribution, big or small, brings us closer to our goal of [MISSION]. Will you donate today?',
      isCustom: false,
    },
    {
      id: 'donation-appeal-2',
      name: 'Urgent Donation Appeal',
      category: 'donation_appeal',
      content: 'TIME-SENSITIVE: We urgently need [AMOUNT] to [SPECIFIC_GOAL]. [IMPACT_STATEMENT]. Your immediate support can [OUTCOME]. Donate now: [LINK]',
      isCustom: false,
    },
    {
      id: 'volunteer-1',
      name: 'Volunteer Recruitment - General',
      category: 'volunteer_recruitment',
      content: 'Join our team! We&apos;re looking for passionate volunteers to support [CAUSE]. No experience necessary—just bring enthusiasm and compassion. Apply here: [LINK]',
      isCustom: false,
    },
    {
      id: 'volunteer-2',
      name: 'Volunteer Recruitment - Specific Role',
      category: 'volunteer_recruitment',
      content: 'Volunteer Needed: [ROLE] - [COMMITMENT_LEVEL]. Help us [MISSION] by [RESPONSIBILITIES]. Skills needed: [SKILLS]. Learn more: [LINK]',
      isCustom: false,
    },
    {
      id: 'event-1',
      name: 'Event Announcement',
      category: 'event_announcement',
      content: 'Join us for [EVENT_NAME] on [DATE] at [TIME/LOCATION]! We&apos;re hosting [DESCRIPTION]. Register: [LINK]. Can&apos;t attend? Donate: [LINK]',
      isCustom: false,
    },
    {
      id: 'thank-you-1',
      name: 'Thank You - General',
      category: 'thank_you',
      content: 'Thank you for believing in our mission! Your [donation/volunteer time/support] made a real difference. Here&apos;s how your support helped: [IMPACT]. Together, we&apos;re creating change.',
      isCustom: false,
    },
    {
      id: 'thank-you-2',
      name: 'Thank You - Donor',
      category: 'thank_you',
      content: 'We&apos;re deeply grateful for your $[AMOUNT] donation! Your generosity directly supported [PROJECT]. Because of you, [OUTCOME]. Thank you for being part of our community.',
      isCustom: false,
    },
    {
      id: 'impact-1',
      name: 'Impact Story Template',
      category: 'impact_story',
      content: '[PERSON_NAME] faced [PROBLEM]. When they heard about [YOUR_PROGRAM], everything changed. [DESCRIBE_SOLUTION]. Today, [CURRENT_SITUATION]. Their story proves that [MISSION]. Will you help more people like [PERSON_NAME]?',
      isCustom: false,
    },
  ],
  impactStories: [],
  kpi: {
    entries: [
      {
        date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: 1200,
        postReach: 3400,
        engagement: 250,
        emailOpenRate: 28,
        websiteVisits: 450,
        donationsReceived: 3500,
        volunteerSignups: 8,
      },
      {
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: 1320,
        postReach: 4100,
        engagement: 310,
        emailOpenRate: 32,
        websiteVisits: 520,
        donationsReceived: 5200,
        volunteerSignups: 12,
      },
      {
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: 1450,
        postReach: 4800,
        engagement: 380,
        emailOpenRate: 35,
        websiteVisits: 680,
        donationsReceived: 4800,
        volunteerSignups: 15,
      },
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: 1580,
        postReach: 5200,
        engagement: 420,
        emailOpenRate: 33,
        websiteVisits: 750,
        donationsReceived: 6100,
        volunteerSignups: 18,
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: 1720,
        postReach: 5800,
        engagement: 480,
        emailOpenRate: 37,
        websiteVisits: 820,
        donationsReceived: 7200,
        volunteerSignups: 22,
      },
    ],
    monthlyTargets: {
      followers: 2000,
      postReach: 7000,
      engagement: 600,
      emailOpenRate: 40,
      websiteVisits: 1000,
      donationsReceived: 10000,
      volunteerSignups: 40,
    },
  },
  recommendations: [],
  darkMode: false,
};

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return defaultAppState;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load app state:', error);
  }

  return defaultAppState;
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
}

export function clearAppState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear app state:', error);
  }
}

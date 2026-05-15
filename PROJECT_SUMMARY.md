# NonProfit Digital Hub - Project Summary

## Overview
A comprehensive web application helping small non-profit organizations move from unplanned, inconsistent digital communication to a structured, measurable, and impact-focused communication strategy.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Persistence**: Browser localStorage (no backend required)
- **Exports**: html2pdf for PDF generation, papaparse for CSV export

## Architecture

### Core Structure
```
/lib
  ├── types.ts          # TypeScript interfaces for all data models
  ├── storage.ts        # localStorage persistence utilities
  ├── context.tsx       # React Context for app-wide state
  ├── calculations.ts   # Scoring, recommendations, and analytics logic

/components
  ├── Sidebar.tsx       # Navigation sidebar
  ├── ProgressBar.tsx   # Global progress bar

/app
  ├── layout.tsx        # Root layout with providers
  ├── page.tsx          # Dashboard (/)
  ├── audit/page.tsx    # Digital Audit
  ├── audience/page.tsx # Audience Personas
  ├── calendar/page.tsx # 30-Day Content Calendar
  ├── templates/page.tsx # Templates Library
  ├── impact-story/page.tsx # Impact Story Builder
  ├── kpi/page.tsx      # KPI Dashboard
  ├── recommendations/page.tsx # Recommendations & Roadmap
  └── settings/page.tsx # Settings
```

## Key Features

### 1. Dashboard (Home Page)
- Welcome banner with editable organization name
- Quick stats: health score (0-100%), scheduled posts, templates used, audit completion
- Navigation cards linking to all major sections
- Getting started guide with 5 key steps

### 2. Digital Communication Audit
- Interactive checklist with 8 audit items across 6 categories
- Each item has Yes/No/Partial status options with weighted scoring
- Auto-calculates gap score (0-100%)
- Expands by category to show detailed items
- PDF download functionality for audit report
- Identifies priority gap areas

### 3. Audience Persona Map
- Create and manage up to unlimited audience personas
- Each persona includes: name, age range, interests, preferred platform, communication goal
- Add/Edit/Delete functionality
- Card-based visual interface
- Personas are used as targets in content calendar

### 4. 30-Day Content Calendar
- Monthly grid calendar view with day-by-day visualization
- Color-coded by content type (awareness, donation, volunteer, event, thank-you, story)
- Add posts with: platform, content type, message draft, target persona, status
- Quick fill button auto-generates 2-3 balanced posts per week
- CSV export for external planning
- List view shows all posts for the month with edit/delete options
- Status tracking (draft, scheduled, posted)

### 5. Templates Library
- 8 pre-built templates across 5 categories:
  - Donation Appeal (2 templates)
  - Volunteer Recruitment (2 templates)
  - Event Announcement (1 template)
  - Thank You (2 templates)
  - Impact Story (1 template)
- Create and save custom templates
- Copy to clipboard functionality
- Category filtering
- Template tips and best practices

### 6. Impact Story Builder
- 5-step guided form:
  1. The Problem (issue addressed)
  2. The Action (what org did)
  3. The Result (outcomes with numbers)
  4. The Human Element (quote/personal story)
  5. The Call to Action (next steps)
- Live preview panel showing story as it's built
- Step completion tracking
- Copy and delete functionality
- Storytelling tips included

### 7. KPI Dashboard
- Manual data entry for weekly/monthly metrics
- Tracks: followers, post reach, engagement, email open rate, website visits, donations, volunteer signups
- Charts powered by Recharts:
  - Line chart for growth trends
  - Bar chart for engagement metrics
  - Comparison with targets
- Data table view of all entries
- Change indicators showing % growth/decline
- PDF report download

### 8. Recommendations & Roadmap
- Auto-generated recommendations based on audit gaps and KPI performance
- Priority levels (High/Medium/Low) with visual indicators
- Action items for each recommendation
- 90-day roadmap with weekly milestones
- Success metrics and best practices guide
- Pro tips for implementation

### 9. Settings
- Organization name management
- Theme toggle (Light/Dark/System)
- Data backup download (JSON export)
- Reset all data option
- App information
- Help resources and feature guide

### Global Features
- Professional design with teal primary, green secondary, orange accent colors
- Responsive mobile-first layout
- Dark/light mode toggle
- Progress bar showing overall toolkit completion
- Persistent data via localStorage
- No data leaves the user's browser

## Calculation Engines

### Audit Score
- Weighted scoring based on 8 audit items
- Each item has a weight (1.5x - 2x)
- Formula: (weighted yes answers / total weighted) × 100

### Communication Health Score
- Composite score from three components:
  - Audit Score (40%)
  - KPI Performance (35%)
  - Calendar Completion (25%)
- Range: 0-100%

### Recommendations Logic
- Rule-based system analyzing:
  - Audit gaps by category
  - Posting frequency vs. targets
  - KPI performance vs. monthly targets
- 8 potential recommendations with auto-prioritization

### Completion Percentage
- Tracks completion of 5 major sections:
  1. Audit items filled
  2. Personas created
  3. Posts scheduled
  4. Impact stories created
  5. KPI data entered

## Data Model

All data is stored in a single AppState object with sections for:
- Organization (name, logo placeholder)
- Audit responses
- Audience personas
- Content calendar posts
- Message templates
- Impact stories
- KPI entries
- Generated recommendations
- Theme preference

## Design System

### Color Palette
- **Primary (Teal)**: oklch(0.38 0.15 195) - Trustworthy, growth-oriented
- **Secondary (Green)**: oklch(0.55 0.13 145) - Sustainability, impact
- **Accent (Orange)**: oklch(0.6 0.18 50) - Call-to-action, energy
- **Neutrals**: White, grays, blacks with oklch values
- **Charts**: 5 distinct data colors for visualization

### Typography
- Font: Geist (sans-serif) throughout
- Hierarchy via size and weight (600, 700)
- Line height: 1.4-1.6 for readability

### Layout
- Mobile-first responsive design
- Flexbox for most layouts
- Sidebar fixed on desktop, hidden on mobile
- Max-content width on main area
- Consistent 6-8px padding scale

## Export Capabilities

### PDF Exports
- Audit Report: Full checklist with scores and gaps
- KPI Report: Summary metrics and date generated

### CSV Exports
- Content Calendar: Date, platform, content type, message preview, status

### JSON Export
- Full data backup for external use or restoration

## User Experience Features

1. **Inline Editing**: Edit organization name directly from dashboard
2. **Smart Defaults**: Pre-populated audit items and templates
3. **Progress Tracking**: Visual indicators of completion across sections
4. **Data Validation**: Form validation before saving
5. **Feedback**: Toast notifications for copy actions, success messages
6. **Intuitive Navigation**: Clear sidebar with 8 main sections
7. **Empty States**: Helpful messages when no data exists
8. **Expandable Content**: Accordion-style sections to manage visual clutter

## Testing Data

The app comes pre-loaded with:
- 8 audit items across 6 categories
- 5 KPI entries showing mock growth data
- 8 pre-built message templates
- Monthly KPI targets for goal tracking
- Default organization name ("Your Organization")

## Browser Compatibility
- Modern browsers with ES2020+ support
- localStorage support required
- Works best on Chrome, Safari, Firefox (latest versions)

## Performance Considerations
- All data stored locally - no network latency
- Recharts optimized for responsive rendering
- PDF generation happens client-side
- No large external dependencies beyond UI framework

## Future Enhancement Opportunities
1. Dark mode theme variations
2. User accounts and cloud sync
3. Team collaboration features
4. API integrations for auto-fetching KPI data
5. Advanced analytics and predictive insights
6. Template marketplace
7. Mobile app version
8. Automated email scheduling
9. Social media scheduler integration
10. AI-powered content suggestions

## Getting Started

1. **First Time Setup**:
   - Edit organization name in settings
   - Complete the Digital Audit to understand your baseline
   - Create 3-5 audience personas

2. **Content Planning**:
   - Navigate to 30-Day Calendar
   - Use "Quick Fill" or manually schedule posts
   - Leverage templates for faster content creation

3. **Tracking Impact**:
   - Add KPI entries weekly or monthly
   - Review recommendations for improvement areas
   - Follow the 90-day roadmap for strategic implementation

4. **Ongoing Management**:
   - Update calendar weekly
   - Add impact stories monthly
   - Review KPIs and adjust strategy based on data
   - Back up data regularly via settings

## Files Created

Total: 18 files
- 9 page components (8 routes + 1 home)
- 2 UI component (sidebar, progress bar)
- 3 utility/context files (types, storage, context, calculations)
- 1 layout file
- 3 config files (globals.css, package.json updates)

Lines of code: ~3,500+ across all files

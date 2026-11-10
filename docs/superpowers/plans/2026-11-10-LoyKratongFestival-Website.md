# Loy Kratong Festival Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Goal
Build a Loy Kratong Festival website that provides festival information (dates, locations, how to make lanterns, maps, events) with an interactive lantern-floating animation. Deploy to Vercel for free hosting.

## Architecture
- **Framework:** Next.js 14 (App Router) — modern, SEO-friendly, great for static sites
- **Styling:** Tailwind CSS — utility-first, fast to iterate
- **UI Components:** shadcn/ui — accessible, customizable React components
- **Language:** TypeScript — type safety, better DX
- **Deployment:** Vercel (free tier, HTTPS, automatic builds)
- **Interactive Element:** Canvas-based lantern float animation (small decorative, not core)
- **Data:** Research festival dates/locations (Bangkok, Chiang Mai, etc.) and populate as static content

## Spec
- **Files to create:**
  - `src/pages/index.tsx` — Home page with festival overview
  - `src/pages/about.tsx` — About the festival, history, significance
  - `src/pages/events.tsx` — Event calendar, locations, how to participate
  - `src/pages/lantern.tsx` — Interactive lantern float animation
  - `src/pages/contact.tsx` — Contact info, map, social links
  - `src/components/` — Reusable UI components (cards, buttons, forms, lantern canvas)
  - `src/lib/` — Data files (festival dates, locations, lantern images)
- **Interfaces:**
  - `lantern.tsx` consumes: none (self-contained animation)
  - `index.tsx` consumes: `about.tsx`, `events.tsx`, `contact.tsx` (routing)
  - `about.tsx` consumes: `events.tsx` (for related info)
- **Steps:**
  - [ ] Write failing tests for each page
  - [ ] Implement page components (index, about, events, lantern, contact)
  - [ ] Add interactive lantern animation
  - [ ] Research and add festival data (dates, locations)
  - [ ] Deploy to Vercel

## Global Constraints
- Must be deployable on Vercel (no server-side code)
- Must be responsive (mobile-first)
- Must be accessible (WCAG 2.1 AA)
- Must include Thai + English content
- Must have interactive lantern animation (small, decorative)
- Must be built with Next.js App Router + Tailwind + shadcn/ui

## Review Focus
- **Content completeness:** Are all festival dates/locations covered?
- **Page functionality:** Can users navigate between pages?
- **Lantern animation:** Does it work on mobile and desktop?
- **SEO:** Meta tags, headings, alt text present
- **Accessibility:** ARIA labels, color contrast, keyboard navigation
- **Performance:** Fast load times, optimized images

## Tasks

### Task 1: Set up project structure
- [ ] Initialize Next.js project with App Router
- [ ] Install Tailwind CSS and shadcn/ui
- [ ] Configure TypeScript
- [ ] Create project structure (pages, components, lib, styles)

### Task 2: Research festival data
- [ ] Gather Loy Kratong Festival dates (mid-November, 2026)
- [ ] List major locations (Bangkok, Chiang Mai, Phuket, etc.)
- [ ] Note key events (lantern release, river processions, fireworks)
- [ ] Save data to `src/lib/festival-data.ts`

### Task 3: Create base page components
- [ ] `src/pages/index.tsx` — Home page with festival overview
- [ ] `src/pages/about.tsx` — About the festival
- [ ] `src/pages/events.tsx` — Events and locations
- [ ] `src/pages/contact.tsx` — Contact info and map
- [ ] `src/components/` — Reusable cards, buttons, forms

### Task 4: Implement interactive lantern animation
- [ ] `src/components/Lantern.tsx` — Canvas-based lantern float
- [ ] Add animation controls (play/pause, speed)
- [ ] Make it responsive (mobile-friendly)
- [ ] Add Thai/English text overlay

### Task 5: Connect pages and routing
- [ ] Set up Next.js routing (page routes)
- [ ] Add navigation bar with links
- [ ] Implement lazy loading for pages

### Task 6: Add festival data
- [ ] Populate `src/lib/festival-data.ts` with dates, locations, events
- [ ] Use data in `index.tsx`, `events.tsx`, `about.tsx`
- [ ] Add map integration (static map image or placeholder)

### Task 7: Deploy to Vercel
- [ ] Push to GitHub (or use Vercel CLI)
- [ ] Configure Vercel build settings (Next.js)
- [ ] Deploy and verify live URL

### Task 8: Testing and polish
- [ ] Write tests for each page (React Testing Library)
- [ ] Fix any bugs
- [ ] Verify accessibility (axe, Lighthouse)
- [ ] Optimize performance

## Step-by-Step Implementation

### Step 1: Write failing test for index page
```python
# tests/pages/index.test.ts
import { test, renderPage } from '@testing-library/react'
import indexPage from '../pages/index'

test('index page loads and shows festival overview', () => {
  renderPage(indexPage)
  expect(screen.getByText('Loy Kratong Festival')).toBeInTheDocument()
  expect(screen.getByText('Bangkok')).toBeInTheDocument()
})
```

### Step 2: Implement index page
- Create `src/pages/index.tsx` with festival overview
- Add navigation to other pages
- Include Thai/English content

### Step 3: Implement about page
- Create `src/pages/about.tsx` with history and significance
- Link to events page

### Step 4: Implement events page
- Create `src/pages/events.tsx` with location list, dates, how to participate
- Use festival data from `src/lib/festival-data.ts`

### Step 5: Implement lantern animation
- Create `src/components/Lantern.tsx` with canvas animation
- Add play/pause controls
- Make it responsive

### Step 6: Implement contact page
- Create `src/pages/contact.tsx` with contact info, map, social links

### Step 7: Deploy
- Push to GitHub
- Deploy to Vercel

## Execution Handoff
Plan saved to `docs/superpowers/plans/2026-11-10-LoyKratongFestival-Website.md`.

**Recommended execution approach:** Native — I will implement each task myself in this session, then do a final review.

Does this plan capture what you want? If yes, I'll start implementing Task 1 (project setup).
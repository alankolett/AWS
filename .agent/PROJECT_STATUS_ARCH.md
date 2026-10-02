# Project Overview & Architecture: AWS SBG @ SSPU Portal

> **Document Type:** Project Architecture & Status Document ("Till-Now")  
> **Repository:** `alankolett/AWS`  
> **App Name:** `aws-sbg-sspu`  
> **Target Audience:** Core Maintainers, Contributors, and Chapter Leadership  

---

## 1. Executive Summary & Gist

The **AWS Student Builder Group (SBG) @ SSPU** web application is the official digital portal for the student developer chapter at **Symbiosis Skills and Professional University (SSPU)**, Kiwale Campus, Pune. Led by AWS Student Captain **Disha Pure**, the platform serves as an interactive community hub, event management system, credential studio, and cloud learning portal.

The application is inspired by the design language of **AWS re:Invent** and **AWS Builder Center** (combining obsidian dark surfaces `#080b10`, AWS Smile Orange `#ff9900`, re:Invent neon purple/cyan, and retro 8-bit aesthetic touches).

### Key Objectives
1. **Event & Workshop Management:** Track lab events (Computer Lab 3), manage seat capacity, chronological RSVP, and attendance check-in.
2. **Interactive Builder Studio:** Generate dynamic client-side digital builder ID passes, personalized 1080×1080 social media "I'm Attending" banners, and verify certificates with zero external backend dependencies.
3. **AI Guidance (Ask SBG):** Floating Amazon Q-style assistant answering student questions on AWS certifications, Lab 3 schedules, and cloud architecture patterns.
4. **Curriculum & Career Pathways:** 3-step interactive learning path generator and curated AWS study roadmaps (CLF-C02, SAA-C03, Security Specialty).

---

## 2. Technical Stack

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | `14.2.20` | Server/Client components, asset optimization, static rendering |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.7.2` | Strong typing, shared domain contracts (`types.ts`) |
| **UI Library** | [React](https://react.dev/) | `18.3.1` | Component-based UI composition |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + PostCSS | `3.4.17` | Utility-first styling with custom palette and dark surfaces |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | `^11.15.0` | Micro-interactions, carousels, modals, card transitions |
| **State Management**| [Zustand](https://github.com/pmndrs/zustand) | `^5.0.2` | Global application state (active tab, profile, RSVP list) |
| **Client Rendering**| [html-to-image](https://github.com/bubkoo/html-to-image) | `^1.11.11` | Client-side 1080×1080 PNG banner & badge export |
| **QR Generation** | [qrcode.react](https://github.com/zpao/qrcode.react) | `^4.2.0` | Generates dynamic QR codes for Builder Passes and Verification URLs |
| **Icons** | [Lucide React](https://lucide.dev/) | `^0.468.0` | Consistent vector iconography |
| **Deployment** | Vercel / AWS S3 + CloudFront / Amplify | — | 100% Serverless / Static-compatible architecture |

---

## 3. High-Level Architecture

The application is structured as a **single-page rich web app (SPA)** using Next.js App Router, configured to run entirely client-side without requiring a persistent database or API server (mock data with browser local storage hydration).

```
                      ┌────────────────────────────────────────┐
                      │            User Browser                │
                      └──────────────────┬─────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │                                           │
                   ▼                                           ▼
       ┌───────────────────────┐                   ┌───────────────────────┐
       │   Next.js App Router  │                   │   Zustand Store       │
       │   `app/page.tsx`      │                   │   `lib/store.ts`      │
       └───────────┬───────────┘                   └───────────┬───────────┘
                   │                                           │
   ┌───────────────┼───────────────┐                           │
   ▼               ▼               ▼                           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐   ┌───────────────────┐
│ Hero Section │ │ Spotlight    │ │ Upcoming     │   │ Persistent State  │
│ & Top Header │ │ Sprints      │ │ Events &     │   │ (RSVPs, Pass Data,│
└──────────────┘ └──────────────┘ │ Lab 3 Kiosk  │   │ UI Modals)        │
                                  └──────────────┘   └───────────────────┘
   ┌───────────────┬───────────────┐
   ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Founder &    │ │ Interactive  │ │ Learning Hub │
│ Leadership   │ │ Tools Suite  │ │ & 3-Step     │
│ Dossier      │ │ (Pass, Canvas│ │ Path Gen     │
└──────────────┘ │ Banner, QR,  │ └──────────────┘
                 │ Attendance)  │
                 └──────┬───────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │ html-to-image & Canvas PNG  │
         │ (1080x1080 Client Export)   │
         └─────────────────────────────┘
```

---

## 4. Directory & Module Breakdown

```
AWS/
├── app/
│   ├── globals.css              # Custom scrollbars, glowing grid background, scanline effects
│   ├── layout.tsx               # Root HTML wrapper, metadata, Inter & JetBrains Mono fonts
│   ├── not-found.tsx            # Custom 404 handler
│   └── page.tsx                 # Core single-page orchestration with natural window scrolling
│
├── components/
│   ├── canvas/
│   │   └── BuilderBackground.tsx # Ambient retro grid & particle canvas
│   ├── chat/
│   │   └── AwsChatWidget.tsx    # "Ask SBG" Amazon Q-style assistant with simulated responses
│   ├── common/
│   │   └── AwsLogo.tsx          # Vector AWS logo (smile and badge variants)
│   ├── features/
│   │   ├── Announcements.tsx    # Broadcasts and critical notices
│   │   ├── AskSBGDrawer.tsx     # Full slide-over drawer version of the assistant
│   │   ├── AttendanceKiosk.tsx  # Computer Lab 3 fast PRN check-in kiosk
│   │   ├── BannerGenerator.tsx  # Client-side 1080x1080 banner generator using html-to-image
│   │   ├── BuilderProfiles.tsx  # Directory of student builder members
│   │   ├── CertificatesPortal.tsx # Cryptographic ID / PRN certificate verification portal
│   │   ├── CommunityBlog.tsx    # Student builder articles and tutorials
│   │   ├── DigitalBuilderPass.tsx # Holographic 3D mouse-tilt pass with dynamic QR code
│   │   ├── EventRSVPModal.tsx   # Seat reservation modal with PRN validation
│   │   ├── FounderStory.tsx     # Profile of Chapter Lead Disha Pure
│   │   ├── HeroSection.tsx      # re:Invent key visual hero with CTA triggers
│   │   ├── InteractiveToolsSuite.tsx # Tabbed switcher for Pass, Banner, Kiosk, and Certs
│   │   ├── JoinModal.tsx        # Registration modal to join the builder group
│   │   ├── LabKioskTerminal.tsx # Simulated terminal view for Lab 3 telemetry
│   │   ├── LearningHub.tsx      # Curated cloud certifications and resources
│   │   ├── MeetTeam.tsx         # Core leadership grid (Cloud, Cyber, DevOps leads)
│   │   ├── OpportunitiesHub.tsx # Internships, fellowships, and hackathon bounties
│   │   ├── PathGenerator.tsx    # Interactive 6-week curriculum generator
│   │   └── SpotlightCarousel.tsx# Carousel for active sprints and watch parties
│   └── layout/
│       ├── LeftSidebar.tsx      # Collapsible / desktop retro navigation rail
│       ├── RightSpacesRail.tsx  # Telemetry, Lab 3 live status, and spaces list
│       └── TopHeader.tsx        # Sticky glassmorphism header with quick actions
│
├── lib/
│   ├── mockData.ts              # Data source for members, events, certs, blogs, and curriculum
│   ├── store.ts                 # Zustand store with profile, active tabs, and RSVP state
│   └── types.ts                 # TypeScript type definitions for all domain entities
│
├── public/                      # Static assets, logos, and avatars
├── README.md                    # Project introduction and deployment guide
├── skills.md                    # Design tokens & color system specification
├── tailwind.config.ts           # Extended palette (obsidian, purple, AWS orange)
└── package.json                 # Node dependencies and scripts
```

---

## 5. Core Feature Matrix

### 1. Interactive 3D Digital Builder Pass
* **File:** `components/features/DigitalBuilderPass.tsx`
* **Features:** 3D perspective mouse-tilt card, dynamic QR code (`qrcode.react`) linked to AWS Builder ID, customizable tier badge (`ARCHITECT`, `PRO`, `FELLOW`, `MEMBER`), and instant download.

### 2. "I'm Attending" Event Banner Studio
* **File:** `components/features/BannerGenerator.tsx`
* **Features:** In-browser canvas using `html-to-image` rendering at 1080×1080 resolution. Allows attendees to input their name, select session type (e.g. re:Invent Watch Party, Zero-Trust Honeypot Lab), customize themes, and export high-res PNGs for LinkedIn/Twitter.

### 3. Lab 3 Kiosk & Real-time Attendance
* **File:** `components/features/AttendanceKiosk.tsx` & `LabKioskTerminal.tsx`
* **Features:** Simulated hardware check-in for SSPU Computer Lab 3. PRN-based lookup with local storage persistence and seat counter deduction.

### 4. Certificate Verification Portal
* **File:** `components/features/CertificatesPortal.tsx`
* **Features:** Instant credential validation by PRN or Issue ID (e.g., `SSPU-AWS-2024-001`), showcasing verified skills, issue date, and recipient details.

### 5. Ask SBG (Amazon Q Style Assistant)
* **File:** `components/chat/AwsChatWidget.tsx`
* **Features:** Context-aware floating assistant styled after the AWS Console / Amazon Q UI. Supports preset prompt chips and instant answers on AWS certifications (CLF-C02, SAA-C03), Lab 3 directions, and cloud patterns.

### 6. Interactive Learning Path Generator
* **File:** `components/features/PathGenerator.tsx`
* **Features:** 3-step dynamic quiz evaluating student background, goal track (Solutions Architect, Cloud Security, DevOps), and producing a customized 6-week study schedule.

---

## 6. Current Implementation Status ("Till-Now")

- [x] **Core UI / Theme:** Complete custom dark hybrid design system (re:Invent × Builder Center).
- [x] **Full Component Suite:** All 16+ visual components and feature widgets implemented.
- [x] **Client-Side Data Layer:** Unified `lib/mockData.ts` with real-world SSPU student leadership details and Lab 3 session structures.
- [x] **State Management:** Complete Zustand store handling modal visibility, event registrations, and pass profiles.
- [x] **Interactive Canvas Exports:** Client-side 1080p banner generation and holographic card export via `html-to-image`.
- [x] **Zero-Backend Dependency:** Entire app runs purely client-side; zero external database or secrets needed to build and run.
- [x] **Build & Static Compatibility:** Next.js 14 production build ready with prebuild scripts cleaning cache.

---

## 7. Recommended Next Steps / Roadmap

1. **Persistent Remote Database (Optional):** Integrate Supabase, AWS DynamoDB, or PostgreSQL via Prisma if live multi-user RSVP persistence and real admin check-in sync is desired.
2. **Real AI Integration:** Connect `AwsChatWidget` to Amazon Bedrock (Claude 3.5 Sonnet / Titan) via a Next.js API route (`/api/chat`).
3. **SSPU Single Sign-On / AWS Builder ID OAuth:** Connect authentication via AWS Cognito or AWS Builder ID OpenID Connect.

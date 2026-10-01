# AWS Student Builder Group (SBG) @ SSPU

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/AWS-Community_Builder-ff9900?logo=amazon-aws)](https://builder.aws)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

Official web application and developer portal for the **AWS Student Builder Group (SBG)** at **Symbiosis Skills and Professional University (SSPU)**, Kiwale Campus, Pune.

Inspired by the design language of [AWS Builder Center](https://builder.aws), AWS re:Invent, and modern university engineering societies.

---

## Key Features

1. **Spotlight Marquee & Sprints:** Live tracking of flagship initiatives including *re:Invent Watch Parties*, *Solutions Architect Associate (SAA-C03) Study Cohorts*, and *Zero-Trust AI Honeypot Labs*.
2. **Founder & Leadership Dossier:** Dedicated profile of Chapter Lead **Disha Pure** (AWS Student Captain & Cybersecurity Head) and core team leads across Architecture, DevOps, and Security.
3. **Lab 3 Event RSVPs & Attendance Kiosk:** Interactive lab seat reservations and a fast PRN check-in kiosk for Computer Lab 3 sessions with local persistence.
4. **Interactive 3D Digital Builder Pass:** Mouse-following holographic badge with dynamic QR generation pointing to AWS Builder ID.
5. **Event Banner Studio:** In-browser 1080×1080 canvas engine allowing students to generate and download personalized "I'm Attending" event badges.
6. **Certificate Verification Portal:** Cryptographic verification for chapter-issued workshop credentials and verifiable proof of attendance.
7. **Ask SBG • Amazon Q Chat Assistant:** Embedded floating assistant styled identically to AWS console / Amazon Q, providing instant guidance on AWS certifications, Lab 3 schedules, and cloud architecture patterns.
8. **AWS Learning Hub & 3-Step Path Generator:** Interactive 6-week curriculum builder based on student career goals and programming baseline.
9. **Retro Pixel-Art Ambient Canvas:** Floating 8-bit sparkles and subtle architectural data pulse reflecting the official AWS Builder Center aesthetic.

---

## Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom obsidian (`#080b10`) / dark slate (`#0f141c`) surfaces and AWS Smile Orange (`#ff9900`) / Bedrock Purple (`#c084fc`) accents
- **State Management:** Zustand with LocalStorage hydration
- **Icons:** Lucide React & Official AWS Vector Assets
- **Deployment:** 100% Serverless / Static-compatible (Zero separate backend required; natively deployable to Vercel, AWS Amplify, or AWS S3 + CloudFront).

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/alankolett/AWS.git
cd AWS

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Deployment on Vercel

This project is built to deploy out of the box on **Vercel** without any separate backend or database setup:

1. Push this repository to your GitHub account (`https://github.com/alankolett/AWS`).
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `AWS` repository.
4. Framework Preset: **Next.js** (auto-detected).
5. Click **Deploy**. Vercel will build and deploy the application globally in seconds!

---

## Community & Chapter Info

- **Institution:** Symbiosis Skills and Professional University (SSPU)
- **Campus Base:** Computer Lab 3, Academic Block, Kiwale Campus, Pune
- **Chapter Lead:** [Disha Pure](https://www.linkedin.com/in/disha-pure-96b43b354/?isSelfProfile=false) (AWS Student Captain)
- **Builder ID:** `disha-pure-sspu`

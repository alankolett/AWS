'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Sparkles, Layers, Terminal, ArrowRight, CheckCircle2, GitBranch } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

interface CertificationTrack {
  id: string;
  code: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  courseName: string;
  courseUrl: string;
  keyTopics: string[];
}

const CERT_TRACKS: CertificationTrack[] = [
  {
    id: 'clf-c02',
    code: 'CLF-C02',
    title: 'AWS Certified Cloud Practitioner',
    level: 'Foundational',
    duration: '6 Hours · Free Self-Paced',
    description: 'Master hyperscale cloud fundamentals, shared responsibility model, billing/pricing calculator, and global infrastructure.',
    courseName: 'AWS Cloud Practitioner Essentials',
    courseUrl: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    keyTopics: ['Cloud Value Proposition', 'IAM Security Basics', 'Core Compute & S3', 'AWS Cost Explorer'],
  },
  {
    id: 'saa-c03',
    code: 'SAA-C03',
    title: 'AWS Certified Solutions Architect – Associate',
    level: 'Associate',
    duration: '18 Hours · Free Self-Paced',
    description: 'Architect resilient, cost-optimized, and high-performing distributed systems using Multi-AZ VPCs, ALB/ASG, and RDS Aurora.',
    courseName: 'Exam Prep: AWS Solutions Architect Associate',
    courseUrl: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/14539/exam-prep-aws-certified-solutions-architect-associate-saa-c03',
    keyTopics: ['Multi-AZ VPC Peering', 'Auto Scaling & ALB', 'S3 Lifecycle & Glacier', 'Decoupled SQS/SNS'],
  },
  {
    id: 'scs-c02',
    code: 'SCS-C02',
    title: 'AWS Certified Security – Specialty',
    level: 'Specialty',
    duration: '14 Hours · Free Self-Paced',
    description: 'Comprehensive threat defense, IAM permission boundaries, KMS customer-managed key encryption, and GuardDuty threat detection.',
    courseName: 'AWS Security Fundamentals & Architecture',
    courseUrl: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/109/aws-security-fundamentals-second-edition',
    keyTopics: ['IAM Zero-Trust Boundaries', 'KMS Envelope Encryption', 'GuardDuty & Security Hub', 'AWS WAF Rule Tuning'],
  },
];

interface WeekPlan {
  week: string;
  title: string;
  focus: string;
  freeTierProject: string;
  deliverable: string;
}

export const LearningHub: React.FC = () => {
  // 3-Step Roadmap State
  const [selectedTrack, setSelectedTrack] = useState<'Cloud Architect' | 'DevOps' | 'Security'>('Cloud Architect');
  const [selectedBaseline, setSelectedBaseline] = useState<'Python' | 'Bash' | 'JavaScript' | 'Beginner'>('Python');
  const [generatedPlan, setGeneratedPlan] = useState<WeekPlan[] | null>(null);

  const generateCurriculum = () => {
    let week4Project = 'Deploy a 2-tier resilient web application with ALB and EC2 Auto-Scaling on Free Tier.';
    let week6Capstone = 'Host an architectural case study defending Multi-AZ resilience and CloudFront caching.';

    if (selectedTrack === 'DevOps') {
      week4Project = selectedBaseline === 'Python'
        ? 'Build an AWS CDK (Python) stack provisioning a containerized microservice with CloudWatch telemetry.'
        : 'Automate a GitHub Actions CI/CD pipeline deploying a static S3 site and Lambda API.';
      week6Capstone = 'Zero-downtime Blue/Green deployment using ECS Fargate and CloudWatch synthetic canaries.';
    } else if (selectedTrack === 'Security') {
      week4Project = selectedBaseline === 'Python'
        ? 'Write a Python Boto3 script auditing IAM users with active console passwords and unused access keys.'
        : 'Configure AWS WAF rate-limiting rules protecting an API Gateway endpoint against Layer-7 DDoS.';
      week6Capstone = 'Deploy an EC2 SSH honeypot streaming CloudWatch logs to an automated security alerting pipeline.';
    }

    const curriculum: WeekPlan[] = [
      {
        week: 'Week 1',
        title: 'Identity & Cloud CLI Baseline',
        focus: `AWS Organizations, IAM least-privilege boundary policies, and configuring AWS CLI / SDK for ${selectedBaseline}.`,
        freeTierProject: 'Configure a hardened root account with MFA and create an IAM Admin user with granular session policies.',
        deliverable: 'CLI verified credentials and $0 AWS Budget Alert configured.',
      },
      {
        week: 'Week 2',
        title: 'Network Topology & Isolation',
        focus: 'Design a custom VPC with 2 Public subnets, 2 Private subnets, Internet Gateway, and Route Tables.',
        freeTierProject: 'Deploy an EC2 t2.micro instance inside a private subnet and connect via AWS Systems Manager Session Manager (no bastion needed).',
        deliverable: 'Tested VPC peering or SSM session without public IP exposure.',
      },
      {
        week: 'Week 3',
        title: 'Serverless Compute & Storage',
        focus: 'Amazon S3 bucket policies, CORS, Lambda function triggers, and DynamoDB single-table schema basics.',
        freeTierProject: 'Build a serverless image resizer triggered on S3 object creation using an AWS Lambda function.',
        deliverable: 'Event-driven Lambda deployment within Free Tier limits.',
      },
      {
        week: 'Week 4',
        title: `${selectedTrack} Deep Dive Project`,
        focus: `Specialized implementation tailored to the ${selectedTrack} track using ${selectedBaseline}.`,
        freeTierProject: week4Project,
        deliverable: 'GitHub repository with architecture diagram and deployment README.',
      },
      {
        week: 'Week 5',
        title: 'Observability & Cost Governance',
        focus: 'CloudWatch metrics, metric alarms, CloudTrail log analysis, and AWS Cost Explorer forecast models.',
        freeTierProject: 'Set up an SNS notification topic alerting on EC2 CPU > 80% and anomaly billing spikes > $0.50.',
        deliverable: 'Active CloudWatch alarm with verified email/Discord webhook alerts.',
      },
      {
        week: 'Week 6',
        title: 'Production Capstone & Portfolio Showcase',
        focus: 'Full documentation, Well-Architected Review defense, and peer review in SSPU Computer Lab 3.',
        freeTierProject: week6Capstone,
        deliverable: 'Live architecture presented to the AWS Student Builder Group community.',
      },
    ];

    setGeneratedPlan(curriculum);
  };

  return (
    <section id="learning" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
              // FEATURE #9 • AWS SKILL BUILDER CURRICULUM
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              AWS Learning Hub
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Curated certification tracks and official free courses from AWS Skill Builder, matched to university academic schedules.
            </p>
          </div>

          <a
            href="https://explore.skillbuilder.aws"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#0f141c] border border-white/[0.08]"
          >
            <span>Browse All AWS Skill Builder</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#ff9900]" />
          </a>
        </div>

        {/* 3 Curated Certification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CERT_TRACKS.map((track) => (
            <div
              key={track.id}
              className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 px-1.5 rounded bg-black/40 border border-white/[0.1] inline-flex items-center">
                      <AwsLogo className="w-4 h-auto" variant="dual" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#ff9900]">
                      {track.code}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    {track.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-sans mb-2">
                  {track.title}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  {track.description}
                </p>

                {/* Key Syllabus Topics */}
                <div className="space-y-1.5 mb-6">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Core Exam Domains:
                  </div>
                  {track.keyTopics.map((topic) => (
                    <div key={topic} className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <span className="text-[#a855f7]">•</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Course Link */}
              <div className="pt-4 border-t border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-500 mb-2">
                  {track.duration}
                </div>
                <a
                  href={track.courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Start Free AWS Course</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* FEATURE #19: INTERACTIVE 3-STEP CAREER ROADMAP GENERATOR                  */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-8">
          <div>
            <div className="text-xs font-mono text-[#ff9900] tracking-wider uppercase mb-1">
              // FEATURE #19 • 3-STEP ROADMAP GENERATOR
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
              Personalized 6-Week AWS Free Tier Career Generator
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Select your career specialization and programming language baseline to receive an instant,
              actionable 6-week curriculum with specific projects deployable within the AWS Free Tier.
            </p>
          </div>

          {/* 3 Step Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-[#080b10] border border-white/[0.08]">
            {/* Question 1: Career Track */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-300 font-semibold uppercase">
                1. Select Primary Career Track
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Cloud Architect', 'DevOps', 'Security'] as const).map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setSelectedTrack(track)}
                    className={`py-2.5 px-2 rounded-lg text-xs font-mono text-center border transition-all ${
                      selectedTrack === track
                        ? 'bg-white text-[#080b10] font-bold border-white'
                        : 'bg-[#0f141c] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Programming Baseline */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-300 font-semibold uppercase">
                2. Select Programming Baseline
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Python', 'Bash', 'JavaScript', 'Beginner'] as const).map((baseline) => (
                  <button
                    key={baseline}
                    type="button"
                    onClick={() => setSelectedBaseline(baseline)}
                    className={`py-2.5 px-2 rounded-lg text-xs font-mono text-center border transition-all ${
                      selectedBaseline === baseline
                        ? 'bg-white text-[#080b10] font-bold border-white'
                        : 'bg-[#0f141c] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {baseline}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Trigger Generation */}
            <div className="md:col-span-2 pt-2">
              <button
                type="button"
                onClick={generateCurriculum}
                className="w-full h-11 rounded-lg bg-gradient-to-r from-purple-600 to-[#ff9900] hover:opacity-95 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate 6-Week {selectedTrack} Roadmap ({selectedBaseline}) →</span>
              </button>
            </div>
          </div>

          {/* Generated 6-Week Curriculum Output */}
          {generatedPlan && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Synthesized 6-Week AWS Free Tier Curriculum</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Track: <strong className="text-white">{selectedTrack}</strong> · Code: <strong className="text-white">{selectedBaseline}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedPlan.map((plan) => (
                  <div
                    key={plan.week}
                    className="p-4 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#a855f7] font-bold">{plan.week}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          Free Tier Safe
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white font-sans mt-1">
                        {plan.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                        {plan.focus}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                      <div className="text-[10px] font-mono text-[#ff9900] font-semibold uppercase">
                        Hands-on Project:
                      </div>
                      <div className="text-xs font-mono text-slate-300 leading-snug">
                        {plan.freeTierProject}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Deliverable: {plan.deliverable}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

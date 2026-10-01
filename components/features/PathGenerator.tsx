'use client';

import React, { useState } from 'react';
import { GitFork, Sparkles, CheckCircle2, Award, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  timeframe: string;
  title: string;
  certification: string;
  practicalLabs: string[];
}

export const PathGenerator: React.FC = () => {
  const [year, setYear] = useState('Year 2');
  const [role, setRole] = useState('Solutions Architect');
  const [commitment, setCommitment] = useState('8-10 hrs / week');
  const [generatedRoadmap, setGeneratedRoadmap] = useState<RoadmapPhase[] | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    let certTarget = 'AWS Certified Solutions Architect – Associate (SAA-C03)';
    let labs = ['VPC Multi-AZ Architecture', 'Application Load Balancer & Auto Scaling', 'S3 Lifecycle & Glacier Deep Archive'];

    if (role === 'GenAI / ML Engineer') {
      certTarget = 'AWS Certified Machine Learning – Specialty / AI Practitioner';
      labs = ['Amazon Bedrock RAG with Claude 3.5', 'OpenSearch Serverless Vector Indexing', 'SageMaker JumpStart Model Fine-Tuning'];
    } else if (role === 'DevOps & SRE') {
      certTarget = 'AWS Certified SysOps Administrator / DevOps Engineer';
      labs = ['AWS CDK Infrastructure as Code', 'ECS Fargate Blue-Green Deployments', 'CloudWatch Alarms & SNS Alerting'];
    } else if (role === 'Cloud Security') {
      certTarget = 'AWS Certified Security – Specialty';
      labs = ['IAM Permission Boundaries & SCPs', 'AWS KMS Envelope Encryption', 'AWS GuardDuty & Security Hub Automation'];
    }

    const phases: RoadmapPhase[] = [
      {
        phase: 'PHASE 01: FOUNDATION',
        timeframe: 'Weeks 1 – 3',
        title: 'Core Hyperscale Mechanics',
        certification: 'AWS Certified Cloud Practitioner (Optional fast-track)',
        practicalLabs: ['IAM Least-Privilege Setup', 'EC2 Linux Web Server Hosting', 'S3 Static Site Hosting with CloudFront'],
      },
      {
        phase: 'PHASE 02: ARCHITECTURAL RIGOR',
        timeframe: 'Weeks 4 – 8',
        title: 'High Availability & Resiliency',
        certification: 'Preparation for ' + certTarget,
        practicalLabs: labs,
      },
      {
        phase: 'PHASE 03: ACCREDITATION SPRINT',
        timeframe: 'Weeks 9 – 12',
        title: 'Official AWS Certification Target',
        certification: certTarget,
        practicalLabs: ['Official AWS Sample Exam Scenarios', 'SSPU Voucher Application', 'Mock Architecture Defense with Leads'],
      },
      {
        phase: 'PHASE 04: CAPSTONE SHOWCASE',
        timeframe: 'Weeks 13 – 16',
        title: 'Production Capstone & Portfolio',
        certification: 'SSPU Gold Builder Honor',
        practicalLabs: ['Deploy live application on AWS', 'Document architecture on Community Blog', 'Submit project to re:Invent Hackathon'],
      },
    ];

    setGeneratedRoadmap(phases);
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="text-[10px] font-mono text-aws-smile font-bold uppercase tracking-wider">
          FEATURE #11: ADAPTIVE MENTORSHIP
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight mb-2">
          Cloud Career & Certification Roadmap Generator
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Input your engineering year, career aspirations, and weekly commitment to receive an AI-tailored
          roadmap aligned with SSPU academic schedules and AWS industry standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (5 cols) */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 p-6 rounded-xl bg-aws-card border border-aws-border space-y-5">
          <div className="flex items-center gap-2 text-aws-smile text-xs font-mono font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>ROADMAP PARAMETERS</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">Current Academic Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-xs text-white font-mono focus:border-aws-purple focus:outline-none"
            >
              <option value="Year 1">Year 1 (Freshman / Early Discovery)</option>
              <option value="Year 2">Year 2 (Sophomore / Core Foundations)</option>
              <option value="Year 3">Year 3 (Pre-Final / Certification & Projects)</option>
              <option value="Year 4">Year 4 (Final Year / Placements & Production)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">Target Cloud Track</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-xs text-white font-mono focus:border-aws-purple focus:outline-none"
            >
              <option value="Solutions Architect">Solutions Architect (General Cloud & Systems)</option>
              <option value="GenAI / ML Engineer">GenAI & ML Engineer (Bedrock, SageMaker)</option>
              <option value="DevOps & SRE">DevOps & SRE (Containers, CDK, CI/CD)</option>
              <option value="Cloud Security">Cloud Security & IAM Governance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">Weekly Study Bandwidth</label>
            <select
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-xs text-white font-mono focus:border-aws-purple focus:outline-none"
            >
              <option value="4-6 hrs / week">Light (4 – 6 hours / week)</option>
              <option value="8-10 hrs / week">Balanced (8 – 10 hours / week)</option>
              <option value="12+ hrs / week">Intensive Sprint (12+ hours / week)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-aws-smile hover:opacity-95 text-white font-bold font-mono text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-aws-glow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Customized Roadmap</span>
          </button>
        </form>

        {/* Right: Generated Roadmap Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {generatedRoadmap ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-purple-300 uppercase font-bold">
                    TAILORED ROADMAP FOR {year.toUpperCase()}
                  </div>
                  <div className="text-base font-bold text-white font-sans">
                    Track: {role}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-purple-500/30 text-xs font-mono text-aws-smile">
                  {commitment}
                </span>
              </div>

              <div className="space-y-3">
                {generatedRoadmap.map((p, idx) => (
                  <div
                    key={p.phase}
                    className="p-5 rounded-xl bg-aws-card border border-aws-border space-y-2.5 relative pl-6"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-gradient-to-b from-purple-500 to-aws-smile" />

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-purple-400 font-bold">{p.phase}</span>
                      <span className="text-slate-400">{p.timeframe}</span>
                    </div>

                    <h4 className="text-base font-bold text-white font-sans">
                      {p.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-aws-smile">
                      <Award className="w-3.5 h-3.5" />
                      <span>{p.certification}</span>
                    </div>

                    <div className="pt-2 border-t border-aws-border">
                      <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                        Recommended Hands-On Labs:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.practicalLabs.map((lab) => (
                          <span
                            key={lab}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                          >
                            ✓ {lab}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-xl bg-aws-card border border-aws-border text-center text-slate-400 space-y-3">
              <GitFork className="w-10 h-10 text-purple-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">Generate Your Personalized Roadmap</h3>
              <p className="text-xs font-sans max-w-md mx-auto leading-relaxed">
                Select your engineering year and cloud track on the left to synthesize a step-by-step
                certification sprint and hands-on laboratory schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

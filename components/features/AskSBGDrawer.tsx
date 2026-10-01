'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, Send, Bot, Sparkles, CornerDownLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';

interface TerminalMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const INITIAL_LOGS: TerminalMessage[] = [
  {
    role: 'system',
    content: `AWS Student Builder Group @ SSPU [Region: ap-south-1]
Computer Lab 3 Architecture Intelligence Terminal v3.2
Type a query or select a preset prompt below.`,
  },
];

const ARCHITECTURE_PRESETS = [
  'How to design a resilient Multi-AZ VPC on AWS?',
  'Best practices for IAM zero-trust boundaries?',
  'When to choose Amazon Bedrock vs SageMaker for GenAI?',
];

const SCHEDULE_PRESETS = [
  'What is the Computer Lab 3 weekly schedule?',
  'When is the next hands-on session at SSPU?',
  'How do students get access to Lab 3?',
];

export const AskSBGDrawer: React.FC = () => {
  const { isAskSbgOpen, setAskSbgOpen } = useAppStore();
  const [messages, setMessages] = useState<TerminalMessage[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  if (!isAskSbgOpen) return null;

  const handleExecute = (cmdText?: string) => {
    const query = cmdText !== undefined ? cmdText : input;
    if (!query.trim()) return;

    const userEntry: TerminalMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userEntry]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      let output = '';
      const q = query.toLowerCase();

      if (q.includes('vpc') || q.includes('multi-az')) {
        output = `[ARCHITECTURE INTEL — AWS VPC MULTI-AZ DESIGN]
1. Subnet Topology:
   - Minimum 2 Availability Zones (ap-south-1a & ap-south-1b).
   - Public Subnets (CIDR /24): Internet Gateway for ALB & NAT Gateways.
   - Private App Subnets (CIDR /22): Workloads (EC2, ECS, Lambda in VPC) without public IPs.
   - Isolated Database Subnets (CIDR /24): RDS Aurora Multi-AZ DB subnet group.
2. Security Boundaries:
   - Security Group chaining: ALB SG -> App SG -> DB SG (strictly port 5432/3306).
   - Network ACLs as stateless secondary subnet firewalls.`;
      } else if (q.includes('iam') || q.includes('zero-trust')) {
        output = `[ARCHITECTURE INTEL — IAM ZERO-TRUST BOUNDARIES]
1. Least Privilege:
   - Never use AWS root account for daily operations.
   - Use IAM Roles with temporary STS credentials; avoid long-lived IAM user access keys.
2. Permission Boundaries:
   - Attach IAM Permission Boundaries to delegatable developer roles to cap max permissions.
3. Service Control Policies (SCPs):
   - Enforce region restrictions (deny all non-ap-south-1 actions) and prevent disabling CloudTrail.`;
      } else if (q.includes('bedrock') || q.includes('sagemaker')) {
        output = `[ARCHITECTURE INTEL — AMAZON BEDROCK VS SAGEMAKER]
1. Amazon Bedrock:
   - Fully serverless API access to foundation models (Claude 3.5 Sonnet, Amazon Titan, Llama 3).
   - Zero infrastructure management; pay per token processed.
   - Best for RAG pipelines, chatbots, knowledge indexing, and rapid MVP delivery.
2. Amazon SageMaker:
   - Full ML lifecycle platform for pre-training, fine-tuning, and hosting custom model weights.
   - Complete control over GPU compute clusters (p4d/g5 instances), MLflow tracking, and container images.`;
      } else if (q.includes('schedule') || q.includes('lab 3')) {
        output = `[SSPU CAMPUS SCHEDULE — COMPUTER LAB 3, ACADEMIC BLOCK]
• Wednesday 04:30 PM – 06:30 PM IST:
  Solutions Architect (SAA-C03) Study Cohort & VPC lab.
• Saturday 10:00 AM – 01:00 PM IST:
  re:Invent Watch Party & Bedrock GenAI Sprint.
• Saturday 02:00 PM – 05:30 PM IST:
  Cloud Security & AI Honeypot Defense Lab.
Access: Free for all registered SSPU students with a valid Student PRN.`;
      } else if (q.includes('next') || q.includes('session')) {
        output = `[UPCOMING CHAPTER EVENT]
Title: "re:Invent Watch Party & Bedrock GenAI Sprint"
Date & Time: Saturday, 10:00 AM – 01:00 PM IST
Venue: Computer Lab 3, Academic Block, SSPU Kiwale Campus
Mentors: Disha Pure & AWS Community Mentors
Status: 18 seats remaining. RSVP via the Events section.`;
      } else if (q.includes('access') || q.includes('how do students')) {
        output = `[LAB 3 ACCESS PROTOCOL]
1. Complete Chapter Registration under "Join Chapter" to receive your Builder ID.
2. Carry your university ID card and Digital Builder Pass on your mobile device.
3. At the Lab 3 entrance, check in at the Attendance Kiosk Terminal using your SSPU PRN.`;
      } else {
        output = `[QUERY PROCESSED]
No direct shell match for "${query}".
Recommended actions:
1. Try our preset architecture queries or schedule lookups below.
2. Visit the Learning Hub for official AWS Skill Builder curriculum.
3. Connect with chapter leads in Computer Lab 3 during open lab hours.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: output }]);
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl h-full bg-[#080b10] border-l border-white/[0.12] flex flex-col justify-between shadow-2xl">
        {/* Terminal Titlebar (macOS / CloudShell Style) */}
        <div className="p-3.5 px-4 bg-[#0f141c] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Terminal Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 px-1.5 rounded bg-black/40 border border-white/[0.1] inline-flex items-center">
                <AwsLogo className="w-4 h-auto" variant="dual" />
              </div>
              <span className="text-xs font-mono font-bold text-white">sbg-ap-south-1:~/lab3-terminal</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAskSbgOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output Area */}
        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className="space-y-1">
              {m.role === 'user' ? (
                <div className="flex items-start gap-2 text-white">
                  <span className="text-[#a855f7] select-none font-bold">sbg-ap-south-1:~$</span>
                  <span>{m.content}</span>
                </div>
              ) : m.role === 'system' ? (
                <div className="text-slate-400 whitespace-pre-wrap leading-relaxed border-b border-white/[0.06] pb-3">
                  {m.content}
                </div>
              ) : (
                <div className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed pl-4 border-l-2 border-emerald-500/40">
                  {m.content}
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 pl-4">
              <span className="animate-pulse">●</span>
              <span>Querying AWS architecture & Lab 3 registry...</span>
            </div>
          )}
        </div>

        {/* Preset Prompts Section */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0f141c]/60 space-y-3">
          {/* Architecture Questions */}
          <div>
            <div className="text-[10px] font-mono text-[#ff9900] uppercase font-semibold mb-1.5 flex items-center gap-1">
              <span>// AWS Architecture Intel</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ARCHITECTURE_PRESETS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleExecute(prompt)}
                  className="px-2.5 py-1 rounded bg-[#080b10] hover:bg-[#161c28] border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-white transition-colors truncate max-w-full text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* SSPU Lab 3 Schedules */}
          <div>
            <div className="text-[10px] font-mono text-[#a855f7] uppercase font-semibold mb-1.5 flex items-center gap-1">
              <span>// Lab 3 Schedules & Access</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SCHEDULE_PRESETS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleExecute(prompt)}
                  className="px-2.5 py-1 rounded bg-[#080b10] hover:bg-[#161c28] border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-white transition-colors truncate max-w-full text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Command Input Line */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#080b10]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute();
            }}
            className="flex items-center gap-2"
          >
            <span className="text-[#a855f7] font-mono text-xs font-bold select-none pl-1">
              $
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an architecture question or Lab 3 query..."
              className="flex-1 h-9 px-2 bg-transparent text-xs text-white placeholder-slate-600 font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-8 px-3 rounded bg-white hover:bg-slate-200 disabled:opacity-30 text-[#080b10] font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              <span>Exec</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

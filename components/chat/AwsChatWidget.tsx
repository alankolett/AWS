'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'How do I join AWS SBG at SSPU?',
  'Where and when is Lab 3 meeting?',
  'Recommended path for Cloud Practitioner (CLF-C02)?',
  'How to host a static site on S3 + CloudFront?',
];

export const AwsChatWidget: React.FC = () => {
  const { isAskSbgOpen, setAskSbgOpen, setJoinModalOpen } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'bot',
      content: `Hello! I'm **Ask SBG**, your official AWS Assistant at Symbiosis Skills and Professional University.\n\nI can help you with:\n- AWS architecture & Well-Architected design\n- Certification paths (CLF-C02, SAA-C03, Security)\n- Computer Lab 3 workshops & re:Invent watch parties\n\nPick a quick question below or ask anything!`,
      timestamp: 'Just now',
    },
  ]);

  // Sync with global store state (e.g. if opened via TopHeader "Ask SBG" button)
  useEffect(() => {
    if (isAskSbgOpen) {
      setIsOpen(true);
      setShowToast(false);
      setHasUnread(false);
    }
  }, [isAskSbgOpen]);

  // Initial greeting toast (appears 2s after load if not previously dismissed)
  useEffect(() => {
    const isDismissed = typeof window !== 'undefined' ? localStorage.getItem('aws_sbg_toast_dismissed') : null;
    if (!isDismissed) {
      const timer = setTimeout(() => {
        if (!isOpen && !isAskSbgOpen) {
          setShowToast(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAskSbgOpen]);

  // Auto-scroll to bottom of message thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setAskSbgOpen(true);
    setShowToast(false);
    setHasUnread(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setAskSbgOpen(false);
  };

  const handleDismissToast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowToast(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aws_sbg_toast_dismissed', 'true');
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Intelligent built-in knowledge response engine
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('join') || q.includes('membership') || q.includes('register')) {
        reply = `**How to Join AWS Student Builder Group @ SSPU:**\n\n1. **Zero Membership Fees:** Chapter membership is free for all enrolled SSPU students across B.Tech CSIT, Cybersecurity, AI/Data Science, and Mechatronics.\n2. **Registration:** Click the **"Join Chapter Cohort"** button in our hero section or top bar to input your Student PRN.\n3. **Builder Pass & Channels:** You'll immediately receive your **Digital Builder Pass** and invite links to our official WhatsApp Community and Chapter Discord.\n4. **Computer Lab 3 Access:** Gives you guaranteed seating for weekly Saturday workshops.`;
      } else if (q.includes('lab 3') || q.includes('when') || q.includes('where') || q.includes('meeting') || q.includes('schedule')) {
        reply = `**SSPU Computer Lab 3 Weekly Schedule:**\n\n- **Venue:** Computer Lab 3, Academic Block, SSPU Kiwale Campus (Pune).\n- **Wednesdays (04:30 PM – 06:30 PM IST):** Solutions Architect Associate (SAA-C03) Study Cohort & VPC lab reviews.\n- **Saturdays (10:00 AM – 01:00 PM IST):** re:Invent Watch Party & Bedrock GenAI Sprint.\n- **Saturdays (02:00 PM – 05:30 PM IST):** Cloud Security & AI Honeypot Defense Lab.\n\n*Check in at the entrance using the Attendance Kiosk with your Student PRN.*`;
      } else if (q.includes('clf-c02') || q.includes('practitioner') || q.includes('cert')) {
        reply = `**AWS Cloud Practitioner (CLF-C02) Roadmap:**\n\n1. **Official Free Course:** Start with [AWS Cloud Practitioner Essentials](https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials) on AWS Skill Builder (6 hours, self-paced).\n2. **Core Exam Domains:**\n   - Cloud Concepts & Value Proposition (24%)\n   - Security & Compliance / Shared Responsibility Model (30%)\n   - Core AWS Technology & S3/EC2/Lambda (34%)\n   - Billing, Pricing & Support Models (12%)\n3. **SSPU Chapter Study Sprints:** Join our weekly Wednesday peer sessions in Lab 3 to practice sample exam scenarios.`;
      } else if (q.includes('s3') && (q.includes('cloudfront') || q.includes('static') || q.includes('host'))) {
        reply = `**Best-Practice Architecture for Static Web on AWS:**\n\n1. **S3 Bucket Configuration:**\n   - Keep **Block Public Access** ENABLED (do not make your S3 bucket public).\n   - Enable default SSE-S3 AES-256 encryption.\n2. **Amazon CloudFront:**\n   - Attach CloudFront with **Origin Access Control (OAC)** to securely retrieve objects from S3.\n   - Configure an S3 Bucket Policy allowing read-only access exclusively from the CloudFront distribution ARN.\n3. **DNS & HTTPS:**\n   - Point your Route 53 Alias record to CloudFront.\n   - Attach a free SSL/TLS certificate from **AWS Certificate Manager (ACM)** in \`us-east-1\`.`;
      } else if (q.includes('disha') || q.includes('founder') || q.includes('lead')) {
        reply = `**Disha Pure** is the **Founder & President** of the AWS Student Builder Group and **AWS Student Captain** at Symbiosis Skills and Professional University (B.Tech CSIT Cybersecurity '26).\n\nShe spearheads the "AWS Student Builder 101" initiative and hands-on cloud/security lab sprints in Computer Lab 3. Connect with her on [LinkedIn](https://www.linkedin.com/in/disha-pure-96b43b354/?isSelfProfile=false) or verified Builder ID: \`disha-pure-sspu\`.`;
      } else if (q.includes('free tier') || q.includes('credit') || q.includes('cost')) {
        reply = `**AWS Free Tier Best Practices for Students:**\n\n1. **Always Set a Zero-Dollar Budget Alert:** In AWS Budgets, create an alert triggering an email whenever actual or forecasted spend exceeds **$0.01**.\n2. **Free Tier Allowances:**\n   - 750 hours/month of EC2 \`t2.micro\` (or \`t3.micro\` where supported)\n   - 5 GB of standard S3 storage\n   - 1 Million free AWS Lambda requests/month\n   - 25 GB of Amazon DynamoDB NoSQL storage\n3. Always terminate resources when done or automate scheduled shutdowns with Lambda.`;
      } else {
        reply = `Thanks for asking about "${query}".\n\nFor deep-dive exploration:\n- Visit our **Learning Hub** for free AWS Skill Builder certification tracks.\n- Generate a tailored 6-week curriculum with our **3-Step Roadmap Generator**.\n- Check out upcoming hands-on labs in **Computer Lab 3** under the Sessions tab!\n\nCan I connect you with a chapter mentor or help with another question?`;
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. COLLAPSED FLOATING LAUNCHER & GREETING TOAST                          */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-auto">
          {/* Greeting Toast (Appears 2s after page load) */}
          {showToast && (
            <div
              onClick={handleOpenChat}
              role="button"
              tabIndex={0}
              className="cursor-pointer max-w-sm p-3.5 pr-4 rounded-xl bg-[#0f172a] border border-[#283344] shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 hover:border-purple-500/50 transition-colors"
            >
              {/* Gradient Amazon Q Sparkle Icon with Violet/Cyan border */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c084fc] via-[#818cf8] to-[#38bdf8] p-[1px] shrink-0">
                <div className="w-full h-full rounded-[7px] bg-[#0f172a] flex items-center justify-center text-[#c084fc]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Toast Message Content */}
              <div className="flex-1 pr-1">
                <div className="text-xs font-sans text-slate-200 leading-snug">
                  Hi, I can connect you with an AWS SBG mentor or answer questions you have on AWS & SSPU.
                </div>
                <div className="text-[10px] font-mono text-[#ff9900] mt-1 font-medium">
                  Click to open Assistant →
                </div>
              </div>

              {/* Dismiss '✕' Button */}
              <button
                type="button"
                onClick={handleDismissToast}
                className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                title="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Launcher Button (52px x 52px dark slate container) */}
          <button
            type="button"
            onClick={handleOpenChat}
            className="relative w-[52px] h-[52px] rounded-xl bg-[#0f172a] hover:bg-[#161e2e] border border-[#283344] hover:border-white/[0.25] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            title="Open Ask SBG Assistant"
            aria-label="Open Ask SBG Assistant"
          >
            <MessageSquare className="w-5 h-5 text-white" />

            {/* Red Notification Badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444] text-white font-mono font-bold text-[10px] flex items-center justify-center border-2 border-[#080b10] shadow-sm animate-pulse">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXPANDED AMAZON Q STYLE CHAT DRAWER (OPEN STATE)                       */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[390px] h-[580px] max-h-[85vh] max-w-[calc(100vw-2rem)] bg-[#0f141c] border border-[#283344] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="h-14 px-4 bg-[#161e2e] border-b border-[#283344] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Amazon Q Style Sparkle Gradient Icon */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c084fc] via-[#ec4899] to-[#ff9900] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>

              <div>
                <div className="text-xs font-bold font-sans text-white flex items-center gap-1.5">
                  <span>Ask SBG • AWS Assistant</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ap-south-1 • Lab 3 Active</span>
                </div>
              </div>
            </div>

            {/* Minimize / Close Button */}
            <button
              type="button"
              onClick={handleCloseChat}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Thread Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#ff9900] text-slate-950 font-medium rounded-tr-none'
                      : 'bg-[#161e2e] border border-[#283344] text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {/* Simple Markdown Parser (Bold & Lists) */}
                  {msg.content.split('\n').map((line, lIdx) => {
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 my-0.5">
                          <span className="text-[#a855f7]">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 my-0.5">
                          <span className="text-[#ff9900] font-mono font-bold">{line.substring(0, 3)}</span>
                          <span>{line.substring(3)}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={lIdx} className={line ? 'mb-1' : 'h-2'}>
                        {line}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#161e2e] border border-[#283344] text-slate-400 text-xs font-mono max-w-[80%]">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9900] animate-spin" />
                <span>Assistant is drafting response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Starter Chips (Always Accessible) */}
          <div className="px-3 py-2 bg-[#080b10] border-t border-[#283344] overflow-x-auto">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#161e2e] hover:bg-[#1f293d] border border-[#283344] text-[10px] font-sans text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0f141c] border-t border-[#283344]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about AWS or SSPU..."
                className="flex-1 h-10 px-3 rounded-lg bg-[#161e2e] border border-[#283344] text-xs text-white placeholder-slate-500 font-sans focus:border-[#a855f7] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-[#080b10] flex items-center justify-center transition-colors shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] font-mono text-slate-500 text-center mt-2">
              Powered by AWS Builder Center & SSPU Chapter Mentors
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AwsChatWidget;

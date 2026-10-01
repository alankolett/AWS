'use client';

import React, { useState } from 'react';
import { FileText, Heart, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/mockData';

export const CommunityBlog: React.FC = () => {
  const [likes, setLikes] = useState<Record<string, number>>({
    'blog-1': 48,
    'blog-2': 62,
    'blog-3': 89,
  });

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
          PEER TECHNICAL WRITING
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight mb-2">
          SSPU Student Cloud Engineering Blog
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Deep-dive architecture breakdowns, production post-mortems, and cloud certification notes authored
          by undergraduate builders at Symbiosis Skills University.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-xl bg-aws-card border border-aws-border hover:border-purple-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-3 font-sans leading-snug hover:text-purple-300 transition-colors">
                {post.title}
              </h2>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-aws-border flex items-center justify-between text-xs font-mono">
              <div>
                <div className="text-white font-semibold">{post.author}</div>
                <div className="text-[10px] text-slate-400">{post.authorRole}</div>
              </div>

              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors border border-slate-700"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500/40" />
                <span>{likes[post.id] || post.likes}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="w-10 h-10 rounded bg-[#ff9900] text-slate-950 font-black text-sm flex items-center justify-center mb-4">
        AWS
      </div>
      <h1 className="text-2xl font-bold mb-2">404 · Page Not Found</h1>
      <p className="text-xs text-slate-400 mb-6 max-w-sm">
        The requested resource is not available in the AWS SBG @ SSPU directory.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded bg-white text-slate-950 text-xs font-semibold hover:bg-slate-200 transition-colors"
      >
        Return to Console
      </Link>
    </div>
  );
}

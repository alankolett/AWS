import type { Metadata } from 'next';
import './globals.css';
import { TopHeader } from '@/components/layout/TopHeader';
import { AwsLogo } from '@/components/common/AwsLogo';
import { AwsGridLoader } from '@/components/common/AwsGridLoader';

export const metadata: Metadata = {
  title: 'AWS Student Builder Group @ SSPU | Builder Center & re:Invent',
  description: 'Official chapter portal for AWS Student Builder Group at Symbiosis Skills and Professional University (SSPU), Pune. Powered by AWS Builder Center & re:Invent design systems.',
  keywords: ['AWS', 'Student Builder Group', 'SSPU', 'Cloud Computing', 're:Invent', 'DevOps', 'Disha Pure'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-aws-canvas text-slate-200 antialiased min-h-screen selection:bg-purple-600 selection:text-white">
        <AwsGridLoader />
        <div className="min-h-screen bg-[#080b10] text-[#f1f5f9] flex flex-col selection:bg-[#ff9900]/30 selection:text-white">
          <TopHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#080b10] text-slate-400 text-xs font-sans">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="h-6 px-1.5 rounded bg-[#0f141c] border border-white/[0.12] flex items-center justify-center">
                  <AwsLogo className="w-5 h-auto" variant="dual" />
                </div>
                <span className="font-semibold text-white">
                  AWS Student Builder Group
                </span>
                <span>·</span>
                <span>Symbiosis Skills and Professional University</span>
              </div>
              <div className="flex items-center gap-6 text-slate-400 text-xs">
                <span>Kiwale Campus, Pune (ap-south-1)</span>
                <span>·</span>
                <a href="https://builder.aws.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  builder.aws.com
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


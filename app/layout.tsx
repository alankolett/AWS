import type { Metadata } from 'next';
import './globals.css';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-aws-canvas text-slate-200 antialiased min-h-screen selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

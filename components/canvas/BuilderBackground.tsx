'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Geometric Sparkle Types
type SparkleShape = 'cross' | 'square' | 'diamond' | 'cluster';

interface SparkleParticle {
  id: string;
  shape: SparkleShape;
  color: string;
  top: string;
  left: string;
  size: number;
  duration: number; // in seconds
  delay: number; // in seconds
  driftY: number; // in pixels
}

// Authentic AWS Builder Center Color Palette
const COLORS = {
  magenta: '#e879f9', // Vibrant Magenta / Pink
  orange: '#ff9900',  // AWS Smile Orange
  cyan: '#38bdf8',    // Electric Cyan / Blue
  mint: '#4ade80',    // Mint Green
  purple: '#c084fc',  // Bedrock Purple
};

// Rich 8-Bit Pixel Sparkles distributed across the ENTIRE full-page canvas (0% to 98%)
const PARTICLES: SparkleParticle[] = [
  // Band 1: 0% - 20% (Hero section & Display Title)
  { id: 'p1', shape: 'cross', color: COLORS.purple, top: '4%', left: '8%', size: 14, duration: 6.2, delay: 0.2, driftY: 16 },
  { id: 'p2', shape: 'diamond', color: COLORS.cyan, top: '7%', left: '26%', size: 12, duration: 7.4, delay: 1.5, driftY: 18 },
  { id: 'p3', shape: 'square', color: COLORS.orange, top: '5%', left: '72%', size: 6, duration: 5.1, delay: 0.8, driftY: 12 },
  { id: 'p4', shape: 'cluster', color: COLORS.magenta, top: '9%', left: '88%', size: 14, duration: 6.8, delay: 2.1, driftY: 20 },
  { id: 'p5', shape: 'cross', color: COLORS.orange, top: '14%', left: '5%', size: 12, duration: 5.6, delay: 1.1, driftY: 14 },
  { id: 'p6', shape: 'diamond', color: COLORS.mint, top: '16%', left: '84%', size: 14, duration: 8.0, delay: 2.7, driftY: 18 },
  { id: 'p7', shape: 'square', color: COLORS.cyan, top: '18%', left: '94%', size: 7, duration: 4.8, delay: 0.4, driftY: 12 },
  { id: 'p8', shape: 'cross', color: COLORS.magenta, top: '19%', left: '16%', size: 15, duration: 7.1, delay: 3.2, driftY: 16 },

  // Band 2: 20% - 40% (Chapter Squad & Photo section)
  { id: 'p9', shape: 'cluster', color: COLORS.purple, top: '23%', left: '4%', size: 13, duration: 6.5, delay: 1.8, driftY: 15 },
  { id: 'p10', shape: 'square', color: COLORS.mint, top: '26%', left: '22%', size: 6, duration: 5.4, delay: 0.9, driftY: 12 },
  { id: 'p11', shape: 'diamond', color: COLORS.orange, top: '28%', left: '78%', size: 13, duration: 7.2, delay: 2.4, driftY: 17 },
  { id: 'p12', shape: 'cross', color: COLORS.cyan, top: '32%', left: '91%', size: 14, duration: 6.0, delay: 1.3, driftY: 16 },
  { id: 'p13', shape: 'diamond', color: COLORS.magenta, top: '35%', left: '12%', size: 12, duration: 7.8, delay: 2.0, driftY: 18 },
  { id: 'p14', shape: 'square', color: COLORS.purple, top: '37%', left: '46%', size: 6, duration: 5.9, delay: 0.6, driftY: 13 },
  { id: 'p15', shape: 'cross', color: COLORS.mint, top: '38%', left: '68%', size: 13, duration: 6.7, delay: 3.0, driftY: 15 },
  { id: 'p16', shape: 'cluster', color: COLORS.orange, top: '39%', left: '85%', size: 14, duration: 7.5, delay: 1.7, driftY: 19 },

  // Band 3: 40% - 60% (Featured Events / Sprints Section)
  { id: 'p17', shape: 'cross', color: COLORS.cyan, top: '43%', left: '7%', size: 14, duration: 6.1, delay: 0.5, driftY: 15 },
  { id: 'p18', shape: 'diamond', color: COLORS.magenta, top: '46%', left: '25%', size: 12, duration: 7.3, delay: 1.9, driftY: 17 },
  { id: 'p19', shape: 'square', color: COLORS.orange, top: '48%', left: '60%', size: 7, duration: 5.2, delay: 1.2, driftY: 13 },
  { id: 'p20', shape: 'cluster', color: COLORS.purple, top: '51%', left: '92%', size: 15, duration: 6.9, delay: 2.5, driftY: 18 },
  { id: 'p21', shape: 'cross', color: COLORS.mint, top: '54%', left: '14%', size: 13, duration: 6.3, delay: 0.7, driftY: 14 },
  { id: 'p22', shape: 'diamond', color: COLORS.orange, top: '57%', left: '75%', size: 14, duration: 7.6, delay: 2.8, driftY: 16 },
  { id: 'p23', shape: 'square', color: COLORS.cyan, top: '59%', left: '38%', size: 6, duration: 4.9, delay: 1.6, driftY: 11 },

  // Band 4: 60% - 80% (Founder Section & Narrative Timeline)
  { id: 'p24', shape: 'cluster', color: COLORS.magenta, top: '63%', left: '6%', size: 14, duration: 7.0, delay: 1.0, driftY: 17 },
  { id: 'p25', shape: 'cross', color: COLORS.purple, top: '66%', left: '88%', size: 13, duration: 6.4, delay: 2.2, driftY: 15 },
  { id: 'p26', shape: 'diamond', color: COLORS.cyan, top: '69%', left: '18%', size: 12, duration: 7.1, delay: 0.4, driftY: 16 },
  { id: 'p27', shape: 'square', color: COLORS.mint, top: '72%', left: '82%', size: 7, duration: 5.5, delay: 1.7, driftY: 12 },
  { id: 'p28', shape: 'cross', color: COLORS.orange, top: '75%', left: '11%', size: 14, duration: 6.6, delay: 3.1, driftY: 18 },
  { id: 'p29', shape: 'cluster', color: COLORS.cyan, top: '78%', left: '94%', size: 13, duration: 6.8, delay: 1.4, driftY: 15 },

  // Band 5: 80% - 98% (Lower Timeline & Page Finale)
  { id: 'p30', shape: 'diamond', color: COLORS.purple, top: '82%', left: '22%', size: 13, duration: 7.5, delay: 2.1, driftY: 17 },
  { id: 'p31', shape: 'square', color: COLORS.orange, top: '85%', left: '70%', size: 6, duration: 5.0, delay: 0.9, driftY: 12 },
  { id: 'p32', shape: 'cross', color: COLORS.mint, top: '88%', left: '8%', size: 14, duration: 6.2, delay: 1.5, driftY: 16 },
  { id: 'p33', shape: 'cluster', color: COLORS.magenta, top: '91%', left: '86%', size: 14, duration: 7.4, delay: 2.6, driftY: 19 },
  { id: 'p34', shape: 'diamond', color: COLORS.cyan, top: '94%', left: '32%', size: 12, duration: 6.7, delay: 0.8, driftY: 15 },
  { id: 'p35', shape: 'square', color: COLORS.purple, top: '97%', left: '76%', size: 7, duration: 5.3, delay: 1.9, driftY: 13 },
];

/**
 * 8-Bit Pixel Shape Renderers (SVG with crispEdges)
 */
const renderPixelShape = (shape: SparkleShape, color: string, size: number) => {
  switch (shape) {
    case 'cross':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_6px_currentColor]"
        >
          <rect x="5" y="1" width="2" height="10" />
          <rect x="1" y="5" width="10" height="2" />
          <rect x="4" y="4" width="4" height="4" opacity="0.9" />
        </svg>
      );

    case 'square':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 6 6"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_4px_currentColor]"
        >
          <rect x="1" y="1" width="4" height="4" />
        </svg>
      );

    case 'diamond':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_6px_currentColor]"
        >
          <rect x="5" y="1" width="2" height="2" />
          <rect x="3" y="3" width="2" height="2" />
          <rect x="7" y="3" width="2" height="2" />
          <rect x="1" y="5" width="2" height="2" />
          <rect x="9" y="5" width="2" height="2" />
          <rect x="3" y="7" width="2" height="2" />
          <rect x="7" y="7" width="2" height="2" />
          <rect x="5" y="9" width="2" height="2" />
        </svg>
      );

    case 'cluster':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_8px_currentColor]"
        >
          <rect x="6" y="2" width="2" height="10" />
          <rect x="2" y="6" width="10" height="2" />
          <rect x="5" y="5" width="4" height="4" />
          <rect x="1" y="1" width="2" height="2" opacity="0.75" />
          <rect x="11" y="1" width="2" height="2" opacity="0.75" />
          <rect x="1" y="11" width="2" height="2" opacity="0.75" />
          <rect x="11" y="11" width="2" height="2" opacity="0.75" />
        </svg>
      );

    default:
      return null;
  }
};

export const BuilderBackground: React.FC = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Don't render public background on the ops console
  if (pathname?.startsWith('/ops/console')) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >

      {/* ========================================================================= */}
      {/* 1. Official Blueprint Engineering Grid Layer (Spans 100% of entire page)   */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. Cursor-Responsive Ambient Radial Glow (Bedrock Purple & AWS Amber)      */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 w-full h-full transition-[background] duration-500 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}% ${mousePos.y}%, rgba(168, 85, 247, 0.10), rgba(255, 153, 0, 0.025) 40%, transparent 70%)`,
        }}
      />

      {/* Static ambient corner sweeps */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-purple-900/10 via-transparent to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#ff9900]/5 via-transparent to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-[75%] right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#a855f7]/5 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* ========================================================================= */}
      {/* 3. Luminous Data Packets Traveling Along Grid Lines Across Page Sections   */}
      {/* ========================================================================= */}
      {/* Packet 1: Horizontal Cyan Packet (Hero area) */}
      <div
        className="data-packet-h-1 absolute h-[2px] w-[32px] rounded-full bg-gradient-to-r from-transparent via-[#38bdf8] to-white shadow-[0_0_10px_#38bdf8]"
        style={{ top: '160px' }}
      />

      {/* Packet 2: Horizontal Orange Packet (Mid area) */}
      <div
        className="data-packet-h-2 absolute h-[2px] w-[38px] rounded-full bg-gradient-to-r from-transparent via-[#ff9900] to-white shadow-[0_0_10px_#ff9900]"
        style={{ top: '680px' }}
      />

      {/* Packet 3: Horizontal Purple Packet (Events area) */}
      <div
        className="data-packet-h-1 absolute h-[2px] w-[36px] rounded-full bg-gradient-to-r from-transparent via-[#c084fc] to-white shadow-[0_0_10px_#c084fc]"
        style={{ top: '1440px', animationDelay: '4s' }}
      />

      {/* Packet 4: Horizontal Cyan Packet (Founder area) */}
      <div
        className="data-packet-h-2 absolute h-[2px] w-[34px] rounded-full bg-gradient-to-r from-transparent via-[#38bdf8] to-white shadow-[0_0_10px_#38bdf8]"
        style={{ top: '2200px', animationDelay: '2s' }}
      />

      {/* Packet 5: Vertical Cyan Packet (Right side) */}
      <div
        className="data-packet-v-1 absolute w-[2px] h-[34px] rounded-full bg-gradient-to-b from-transparent via-[#38bdf8] to-white shadow-[0_0_10px_#38bdf8]"
        style={{ right: '120px' }}
      />

      {/* Packet 6: Vertical Orange Packet (Left side) */}
      <div
        className="data-packet-v-1 absolute w-[2px] h-[34px] rounded-full bg-gradient-to-b from-transparent via-[#ff9900] to-white shadow-[0_0_10px_#ff9900]"
        style={{ left: '80px', animationDelay: '4.5s' }}
      />

      {/* ========================================================================= */}
      {/* 4. Ambient 8-Bit Pixel Sparkles & Star Particles (Full Page Coverage)      */}
      {/* ========================================================================= */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="pixel-sparkle absolute flex items-center justify-center"
          style={{
            top: p.top,
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift-y' as any]: `-${p.driftY}px`,
          }}
        >
          {renderPixelShape(p.shape, p.color, p.size)}
        </div>
      ))}

      {/* ========================================================================= */}
      {/* CSS Animation Keyframes & Motion-Reduction Fallback                        */}
      {/* ========================================================================= */}
      <style jsx>{`
        /* Pixel Sparkle Gentle Floating & Twinkling */
        .pixel-sparkle {
          animation-name: retroPixelFloat;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: transform, opacity;
        }

        @keyframes retroPixelFloat {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          50% {
            transform: translateY(var(--drift-y, -16px));
            opacity: 0.95;
          }
        }

        /* Data Packet 1 (Horizontal Cyan / Purple along grid lines) */
        .data-packet-h-1 {
          animation: dataTravelH1 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dataTravelH1 {
          0% {
            left: -50px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: 105%;
            opacity: 0;
          }
        }

        /* Data Packet 2 (Horizontal Orange / Reverse along grid lines) */
        .data-packet-h-2 {
          animation: dataTravelH2 11s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dataTravelH2 {
          0% {
            left: 105%;
            opacity: 0;
            transform: scaleX(-1);
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: -50px;
            opacity: 0;
            transform: scaleX(-1);
          }
        }

        /* Data Packet 3 (Vertical packet) */
        .data-packet-v-1 {
          animation: dataTravelV1 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes dataTravelV1 {
          0% {
            top: -40px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            top: 105%;
            opacity: 0;
          }
        }

        /* Route Change Scanning Laser Beam across navbar switches */
        .route-scan-laser {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #00f0ff 20%, #ff9900 50%, #a855f7 80%, transparent 100%);
          box-shadow: 0 0 16px #00f0ff, 0 0 32px #ff9900;
          animation: laserScan 0.85s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }

        @keyframes laserScan {
          0% {
            top: 0%;
            opacity: 1;
            transform: scaleY(1);
          }
          70% {
            opacity: 0.9;
          }
          100% {
            top: 100%;
            opacity: 0;
            transform: scaleY(0.5);
          }
        }

        /* Respect prefers-reduced-motion: disable animations */
        @media (prefers-reduced-motion: reduce) {
          .pixel-sparkle,
          .data-packet-h-1,
          .data-packet-h-2,
          .data-packet-v-1,
          .route-scan-laser {
            animation: none !important;
            opacity: 0.5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BuilderBackground;

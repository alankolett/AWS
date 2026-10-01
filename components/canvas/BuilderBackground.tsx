'use client';

import React, { useEffect, useState, useRef } from 'react';

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

// Curated 8-Bit Pixel Sparkles distributed harmoniously across the canvas
const PARTICLES: SparkleParticle[] = [
  // Top Region (Atmospheric Header Dust)
  { id: 'p1', shape: 'cross', color: COLORS.purple, top: '12%', left: '8%', size: 14, duration: 6.2, delay: 0.2, driftY: 16 },
  { id: 'p2', shape: 'diamond', color: COLORS.cyan, top: '18%', left: '26%', size: 12, duration: 7.4, delay: 1.5, driftY: 18 },
  { id: 'p3', shape: 'square', color: COLORS.orange, top: '10%', left: '72%', size: 6, duration: 5.1, delay: 0.8, driftY: 12 },
  { id: 'p4', shape: 'cluster', color: COLORS.magenta, top: '15%', left: '88%', size: 14, duration: 6.8, delay: 2.1, driftY: 20 },

  // Mid-Upper Region (Surrounding Headline & Eyebrow)
  { id: 'p5', shape: 'cross', color: COLORS.orange, top: '32%', left: '5%', size: 12, duration: 5.6, delay: 1.1, driftY: 14 },
  { id: 'p6', shape: 'diamond', color: COLORS.mint, top: '28%', left: '84%', size: 14, duration: 8.0, delay: 2.7, driftY: 18 },
  { id: 'p7', shape: 'square', color: COLORS.cyan, top: '38%', left: '94%', size: 7, duration: 4.8, delay: 0.4, driftY: 12 },
  { id: 'p8', shape: 'cross', color: COLORS.magenta, top: '44%', left: '16%', size: 15, duration: 7.1, delay: 3.2, driftY: 16 },

  // Mid-Lower Region (Flanking Action Buttons & Context)
  { id: 'p9', shape: 'cluster', color: COLORS.purple, top: '56%', left: '3%', size: 13, duration: 6.5, delay: 1.8, driftY: 15 },
  { id: 'p10', shape: 'square', color: COLORS.mint, top: '62%', left: '22%', size: 6, duration: 5.4, delay: 0.9, driftY: 12 },
  { id: 'p11', shape: 'diamond', color: COLORS.orange, top: '52%', left: '78%', size: 13, duration: 7.2, delay: 2.4, driftY: 17 },
  { id: 'p12', shape: 'cross', color: COLORS.cyan, top: '68%', left: '91%', size: 14, duration: 6.0, delay: 1.3, driftY: 16 },

  // Bottom Region (Border Interface)
  { id: 'p13', shape: 'diamond', color: COLORS.magenta, top: '82%', left: '12%', size: 12, duration: 7.8, delay: 2.0, driftY: 18 },
  { id: 'p14', shape: 'square', color: COLORS.purple, top: '86%', left: '46%', size: 6, duration: 5.9, delay: 0.6, driftY: 13 },
  { id: 'p15', shape: 'cross', color: COLORS.mint, top: '78%', left: '68%', size: 13, duration: 6.7, delay: 3.0, driftY: 15 },
  { id: 'p16', shape: 'cluster', color: COLORS.orange, top: '88%', left: '85%', size: 14, duration: 7.5, delay: 1.7, driftY: 19 },
];

/**
 * 8-Bit Pixel Shape Renderers (SVG with crispEdges)
 */
const renderPixelShape = (shape: SparkleShape, color: string, size: number) => {
  switch (shape) {
    // 4-armed pixel plus cross (+)
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
          {/* Vertical Arm */}
          <rect x="5" y="1" width="2" height="10" />
          {/* Horizontal Arm */}
          <rect x="1" y="5" width="10" height="2" />
          {/* Center 2x2 Accent */}
          <rect x="4" y="4" width="4" height="4" opacity="0.9" />
        </svg>
      );

    // Tiny pixel square dot (▪)
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

    // Hollow 8-bit diamond (◆)
    case 'diamond':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_8px_currentColor]"
        >
          {/* 8-bit stepped diamond outline */}
          <rect x="6" y="1" width="2" height="2" />
          <rect x="4" y="3" width="2" height="2" />
          <rect x="8" y="3" width="2" height="2" />
          <rect x="2" y="5" width="2" height="2" />
          <rect x="10" y="5" width="2" height="2" />
          <rect x="4" y="7" width="2" height="2" />
          <rect x="8" y="7" width="2" height="2" />
          <rect x="6" y="9" width="2" height="2" />
        </svg>
      );

    // Mini pixel cluster (3-dot constellation)
    case 'cluster':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill={color}
          style={{ shapeRendering: 'crispEdges' }}
          className="drop-shadow-[0_0_6px_currentColor]"
        >
          <rect x="2" y="2" width="3" height="3" />
          <rect x="8" y="5" width="4" height="4" />
          <rect x="3" y="9" width="3" height="3" />
        </svg>
      );
  }
};

export const BuilderBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  // Subtle cursor tracking for smooth radial ambient lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ========================================================================= */}
      {/* 1. Fine 40px Blueprint Grid Base with Subtle Grid Lines                    */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. Cursor-Responsive Ambient Radial Glow (Bedrock Purple & AWS Amber)      */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(168, 85, 247, 0.12), rgba(255, 153, 0, 0.03) 40%, transparent 70%)`,
        }}
      />

      {/* Static ambient corner sweep */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-purple-900/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* ========================================================================= */}
      {/* 3. Luminous Data Packets Traveling Along Grid Lines (ap-south-1 Traffic)   */}
      {/* ========================================================================= */}
      {/* Packet 1: Horizontal Cyan Packet (moves along top grid line 120px) */}
      <div
        className="data-packet-h-1 absolute h-[2px] w-[28px] rounded-full bg-gradient-to-r from-transparent via-[#38bdf8] to-white shadow-[0_0_8px_#38bdf8]"
        style={{ top: '120px' }}
      />

      {/* Packet 2: Horizontal Orange Packet (moves along mid grid line 280px) */}
      <div
        className="data-packet-h-2 absolute h-[2px] w-[34px] rounded-full bg-gradient-to-r from-transparent via-[#ff9900] to-white shadow-[0_0_8px_#ff9900]"
        style={{ top: '280px' }}
      />

      {/* Packet 3: Vertical Cyan Packet (moves along right grid line) */}
      <div
        className="data-packet-v-1 absolute w-[2px] h-[30px] rounded-full bg-gradient-to-b from-transparent via-[#38bdf8] to-white shadow-[0_0_8px_#38bdf8]"
        style={{ right: '160px' }}
      />

      {/* ========================================================================= */}
      {/* 4. Ambient 8-Bit Pixel Sparkles & Star Particles                           */}
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

        /* Data Packet 1 (Horizontal Cyan along ap-south-1) */
        .data-packet-h-1 {
          animation: dataTravelH1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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

        /* Data Packet 2 (Horizontal Orange along ap-south-1) */
        .data-packet-h-2 {
          animation: dataTravelH2 10s cubic-bezier(0.4, 0, 0.2, 1) 3.5s infinite;
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

        /* Data Packet 3 (Vertical Cyan packet) */
        .data-packet-v-1 {
          animation: dataTravelV1 9s cubic-bezier(0.4, 0, 0.2, 1) 1.5s infinite;
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

        /* Respect prefers-reduced-motion: disable animations */
        @media (prefers-reduced-motion: reduce) {
          .pixel-sparkle,
          .data-packet-h-1,
          .data-packet-h-2,
          .data-packet-v-1 {
            animation: none !important;
            opacity: 0.5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BuilderBackground;

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoxStyle {
  border: string;
  bg: string;
  glow: string;
}

export const AwsGridLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show once per session
    const hasLoaded = sessionStorage.getItem('has_loaded_sbg');
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('has_loaded_sbg', 'true');
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const gridVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const tileVariants = {
    initial: { scale: 0.7, opacity: 0.2 },
    animate: (custom: number) => ({
      scale: [0.88, 1.08, 0.88],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.2,
        delay: custom * 0.07,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  // 5 distinct high-tech palettes (Translucent fill + Solid color border + Neon Glow)
  // No dark or invisible colors so the second-to-last column is clearly visible!
  const boxStyles: BoxStyle[] = [
    {
      border: '#ff9900', // AWS Orange
      bg: 'rgba(255, 153, 0, 0.16)',
      glow: '0 0 16px rgba(255, 153, 0, 0.45)',
    },
    {
      border: '#00f0ff', // Cyber Cyan
      bg: 'rgba(0, 240, 255, 0.16)',
      glow: '0 0 16px rgba(0, 240, 255, 0.45)',
    },
    {
      border: '#a855f7', // Cloud Violet
      bg: 'rgba(168, 85, 247, 0.16)',
      glow: '0 0 16px rgba(168, 85, 247, 0.45)',
    },
    {
      border: '#10b981', // Emerald Tech Green (Col 4 - fully visible)
      bg: 'rgba(16, 185, 129, 0.16)',
      glow: '0 0 16px rgba(16, 185, 129, 0.45)',
    },
    {
      border: '#ec4899', // Electric Rose
      bg: 'rgba(236, 72, 153, 0.16)',
      glow: '0 0 16px rgba(236, 72, 153, 0.45)',
    },
  ];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="aws-grid-loader"
          className="fixed inset-0 z-[9999] bg-[#080b10] flex flex-col items-center justify-center overflow-hidden selection:bg-transparent"
          variants={gridVariants}
          initial="initial"
          exit="exit"
        >
          {/* Background Ambient Grid Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(#ff9900_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Bigger Grid Matrix (5x5) */}
          <div className="grid grid-cols-5 gap-3 sm:gap-4 p-4 w-72 h-72 sm:w-88 sm:h-88 md:w-[380px] md:h-[380px] relative z-10">
            {Array.from({ length: 25 }).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              const style = boxStyles[col];

              return (
                <motion.div
                  key={i}
                  className="w-full h-full rounded-xl backdrop-blur-sm transition-all"
                  style={{
                    backgroundColor: style.bg,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: style.border,
                    boxShadow: style.glow,
                  }}
                  custom={col + row}
                  variants={tileVariants}
                  initial="initial"
                  animate="animate"
                />
              );
            })}
          </div>

          {/* Loader Status Bar */}
          <div className="relative z-10 mt-8 flex flex-col items-center gap-1.5 font-mono text-center">
            <div className="text-xs sm:text-sm text-[#ff9900] font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff9900] animate-ping" />
              <span>INITIALIZING AWS SBG PORTAL</span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-wider">
              ap-south-1 · Symbiosis Skills & Professional Univ.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

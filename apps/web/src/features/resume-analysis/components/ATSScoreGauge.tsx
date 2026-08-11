import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ATSScoreGaugeProps {
  score: number;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to actual score on mount
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score thresholds
  let color = 'stroke-rose-500';
  let bgColor = 'text-rose-500';
  let glowColor = 'rgba(244, 63, 94, 0.4)';
  let label = 'Needs Work';

  if (score >= 80) {
    color = 'stroke-emerald-500';
    bgColor = 'text-emerald-500';
    glowColor = 'rgba(16, 185, 129, 0.4)';
    label = 'Excellent';
  } else if (score >= 60) {
    color = 'stroke-amber-500';
    bgColor = 'text-amber-500';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    label = 'Good';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-10 transition-colors duration-1000 blur-3xl pointer-events-none" 
        style={{ backgroundColor: glowColor }} 
      />
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Track */}
        <svg className="w-full h-full -rotate-90 transform absolute" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Value */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            className={color}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${bgColor}`}>
            {animatedScore}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            ATS Score
          </span>
        </div>
      </div>
      
      <div className={`mt-4 font-bold text-sm px-3 py-1 rounded-full bg-opacity-10 ${bgColor} bg-current`}>
        {label}
      </div>
    </div>
  );
};

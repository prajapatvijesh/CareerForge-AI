import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round(((current) / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Question {current} <span className="text-slate-400 font-normal">of {total}</span>
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {percentage}% Completed
        </span>
      </div>
      
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
        />
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: total }).map((_, idx) => {
          const isCompleted = idx < current - 1;
          const isActive = idx === current - 1;
          
          return (
            <div 
              key={idx} 
              className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : isActive
                    ? 'bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/50'
                    : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-2.5 h-2.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

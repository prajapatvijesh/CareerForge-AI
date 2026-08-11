import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle } from 'lucide-react';

interface FeedbackCardProps {
  type: 'strength' | 'weakness';
  items: string[];
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ type, items }) => {
  const isStrength = type === 'strength';
  
  const bgClass = isStrength 
    ? 'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900/50 border-indigo-100 dark:border-indigo-900/30' 
    : 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900/50 border-amber-100 dark:border-amber-900/30';
  
  const iconClass = isStrength ? 'text-indigo-500' : 'text-amber-500';
  const title = isStrength ? 'Core Strengths' : 'Areas for Improvement';
  const Icon = isStrength ? Sparkles : AlertTriangle;

  return (
    <div className={`p-6 rounded-3xl border shadow-sm ${bgClass}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      
      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start"
            >
              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isStrength ? 'bg-indigo-400' : 'bg-amber-400'}`} />
              <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 italic">No feedback available in this category.</p>
      )}
    </div>
  );
};

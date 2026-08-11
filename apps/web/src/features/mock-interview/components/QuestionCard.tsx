import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Code2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  text: string;
  type: 'TECHNICAL' | 'BEHAVIORAL';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ text, type }) => {
  const isTechnical = type === 'TECHNICAL';

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 ${
          isTechnical ? 'bg-indigo-500' : 'bg-emerald-500'
        }`}
      />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Badge 
          variant="outline" 
          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            isTechnical 
              ? 'text-indigo-600 border-indigo-200 bg-indigo-50 dark:text-indigo-400 dark:border-indigo-900/50 dark:bg-indigo-950/30'
              : 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900/50 dark:bg-emerald-950/30'
          }`}
        >
          {isTechnical ? <Code2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
          {type}
        </Badge>
      </div>

      <motion.h2 
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed relative z-10"
      >
        {text}
      </motion.h2>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface SuggestionCardProps {
  suggestions: string[];
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Actionable Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="group flex items-start p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 mt-1 mr-3 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

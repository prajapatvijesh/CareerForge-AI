import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeywordBadgesProps {
  present: string[];
  missing: string[];
}

export const KeywordBadges: React.FC<KeywordBadgesProps> = ({ present, missing }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
          Keywords Found
        </h3>
        {present.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2">
            {present.map((kw, i) => (
              <motion.div key={i} variants={item}>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 px-3 py-1 text-sm font-medium">
                  {kw}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-slate-400 italic">No exact matches found.</p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
          <XCircle className="w-4 h-4 mr-2 text-rose-500" />
          Missing Keywords
        </h3>
        {missing.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <motion.div key={i} variants={item}>
                <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50/50 dark:text-rose-400 dark:border-rose-900/50 dark:bg-rose-950/10 px-3 py-1 text-sm font-medium border-dashed">
                  {kw}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-slate-400 italic">Excellent! You matched all expected keywords.</p>
        )}
      </div>
    </div>
  );
};

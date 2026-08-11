import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ message?: string }> = ({ message = "Preparing Interview..." }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6 z-10">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 z-10 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-500" /> {message}
      </h2>
      <p className="text-slate-500 text-sm z-10 max-w-sm">
        Please wait while our AI engine gets everything ready.
      </p>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export const AnalysisSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-slate-200 dark:border-slate-800">
      {/* Animated glowing background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI is Analyzing Your Resume
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 text-sm">
          Please wait while our AI engine evaluates your resume against industry standards and ATS requirements.
        </p>

        {/* Fake processing steps */}
        <div className="w-full max-w-xs space-y-3">
          {[
            'Extracting text...',
            'Evaluating structure...',
            'Cross-referencing keywords...',
            'Calculating ATS score...'
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.8, duration: 0.5 }}
              className="flex items-center gap-3 text-sm text-slate-400"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

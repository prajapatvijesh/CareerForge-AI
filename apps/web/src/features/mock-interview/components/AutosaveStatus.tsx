import React, { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutosaveStatusProps {
  status: 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR';
}

export const AutosaveStatus: React.FC<AutosaveStatusProps> = ({ status }) => {
  const [displayStatus, setDisplayStatus] = useState(status);

  useEffect(() => {
    if (status === 'SAVED') {
      setDisplayStatus('SAVED');
      const timer = setTimeout(() => setDisplayStatus('IDLE'), 2000);
      return () => clearTimeout(timer);
    }
    setDisplayStatus(status);
  }, [status]);

  return (
    <div className="flex items-center text-xs font-medium">
      <AnimatePresence mode="wait">
        {displayStatus === 'SAVING' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center text-slate-500 dark:text-slate-400"
          >
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Saving...
          </motion.div>
        )}
        
        {displayStatus === 'SAVED' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Saved
          </motion.div>
        )}

        {displayStatus === 'ERROR' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-rose-600 dark:text-rose-400"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Failed. Retrying...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

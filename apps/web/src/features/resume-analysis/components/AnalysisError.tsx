import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisErrorProps {
  message?: string;
  onRetry: () => void;
}

export const AnalysisError: React.FC<AnalysisErrorProps> = ({ 
  message = "An error occurred while analyzing your resume.", 
  onRetry 
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-100 dark:border-rose-900/50">
      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-rose-100 dark:border-rose-900 flex items-center justify-center mb-6 text-rose-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-sm">
        {message}
      </p>

      <Button onClick={onRetry} variant="outline" className="border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900 dark:hover:bg-rose-950/50 dark:text-rose-400 rounded-xl">
        <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
      </Button>
    </div>
  );
};

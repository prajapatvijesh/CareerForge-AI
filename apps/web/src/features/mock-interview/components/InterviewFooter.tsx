import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface InterviewFooterProps {
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  isFinishing?: boolean;
}

export const InterviewFooter: React.FC<InterviewFooterProps> = ({ isFirst, isLast, onNext, onPrev, onFinish, isFinishing }) => {
  return (
    <footer className="mt-8 flex items-center justify-between bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <Button 
        variant="outline" 
        onClick={onPrev} 
        disabled={isFirst || isFinishing}
        className="rounded-xl font-bold"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
      </Button>

      {isLast ? (
        <Button 
          onClick={onFinish} 
          disabled={isFinishing}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none"
        >
          {isFinishing ? 'Finishing...' : 'Finish Interview'} <Check className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={onNext} 
          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-bold"
        >
          Next Question <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </footer>
  );
};

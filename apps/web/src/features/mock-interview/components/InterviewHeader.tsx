import React from 'react';
import { Bot, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewHeaderProps {
  onExit: () => void;
  role: string;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({ onExit, role }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">AI Mock Interview</h1>
          <p className="text-xs text-slate-500 font-medium">{role}</p>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
        <LogOut className="w-4 h-4 mr-2" /> Exit
      </Button>
    </header>
  );
};

import React from 'react';
import { format } from 'date-fns';
import { History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMockInterview } from '../api/mockInterview.api';

export const HistoryCard: React.FC<{ interview: IMockInterview }> = ({ interview }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/interviews/${interview._id}/result`)}
      className="bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {interview.config.role}
          </h4>
          <p className="text-xs text-slate-500">
            {format(new Date(interview.createdAt), 'MMM d, yyyy')} • {interview.config.difficulty}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {interview.overallResult?.totalScore ?? '--'}/100
          </p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Score</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  );
};

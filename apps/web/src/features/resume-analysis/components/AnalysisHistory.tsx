import React from 'react';
import { IResumeAnalysis } from '../api/analysis.api';
import { format } from 'date-fns';
import { History, ArrowRight } from 'lucide-react';

interface AnalysisHistoryProps {
  history: IResumeAnalysis[];
  onSelect: (analysis: IResumeAnalysis) => void;
  currentId?: string;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelect, currentId }) => {
  if (!history || history.length <= 1) return null; // Don't show if there's no history to compare

  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          <History className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis History</h3>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const isActive = item._id === currentId;
          return (
            <div 
              key={item._id}
              onClick={() => !isActive && onSelect(item)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isActive 
                  ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-900/20' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30 cursor-pointer'
              }`}
            >
              <div>
                <p className={`font-semibold ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  Score: {item.atsScore || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {format(new Date(item.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              
              {!isActive && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Target, FileText, CheckCircle, Briefcase } from 'lucide-react';

export const CareerContextCard = ({ context }: { context: any }) => {
  if (!context) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-xl p-4 mb-4 text-sm shadow-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        Career Snapshot
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Target Role</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">{context.targetRole || 'Not available'}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Resume Score
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {context.resumeScore ? `${context.resumeScore}/100` : 'Not available'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Interview Score
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {context.interviewScore ? `${context.interviewScore}/100` : 'Not available'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Applications
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">{context.totalApplications ?? 0}</p>
        </div>
      </div>
      {context.resumeWeaknesses && context.resumeWeaknesses.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">Resume Weaknesses</p>
          <div className="flex flex-wrap gap-2">
            {context.resumeWeaknesses.map((weakness: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-md">
                {weakness}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

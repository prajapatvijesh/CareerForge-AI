import React from 'react';
import { Bot, AlertCircle, TrendingUp, CheckCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300';
    case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300';
    default: return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'RESUME': return <AlertCircle className="w-4 h-4" />;
    case 'JOB': return <TrendingUp className="w-4 h-4" />;
    case 'INTERVIEW': return <CheckCircle className="w-4 h-4" />;
    default: return <Lightbulb className="w-4 h-4" />;
  }
};

const getActionLink = (action: string) => {
  const lower = action.toLowerCase();
  if (lower.includes('resume')) return '/resumes';
  if (lower.includes('interview')) return '/interviews';
  if (lower.includes('job') || lower.includes('application')) return '/jobs';
  return '/profile';
};

export const AssistantMessage = ({ 
  content, 
  recommendations, 
  nextActions 
}: { 
  content: string, 
  recommendations?: any[],
  nextActions?: string[]
}) => {
  return (
    <div className="flex gap-4 items-start max-w-[90%]">
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 text-blue-600">
        <Bot className="w-5 h-5" />
      </div>
      <div className="flex-1 space-y-4">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm whitespace-pre-wrap leading-relaxed">
          {content}
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)} flex flex-col gap-2`}>
                <div className="flex items-center gap-2 font-medium">
                  {getCategoryIcon(rec.category)}
                  <span>{rec.title}</span>
                </div>
                <p className="text-sm opacity-90">{rec.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Next Actions */}
        {nextActions && nextActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-2">
            <span className="text-xs font-medium text-gray-500 uppercase flex items-center mr-2">Suggested Actions:</span>
            {nextActions.map((action, idx) => (
              <Link
                key={idx}
                to={getActionLink(action)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full transition-colors border shadow-sm flex items-center"
              >
                {action}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

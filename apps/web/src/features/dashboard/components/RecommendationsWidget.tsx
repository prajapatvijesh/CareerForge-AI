import React from 'react';
import { DashboardSummary } from '../api/dashboard.api';
import { ArrowRight, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendationsWidget: React.FC<{ recommendations: DashboardSummary['recommendations'] }> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-3xl p-6 border border-green-100 dark:border-green-900/50">
        <div className="flex items-center space-x-3 text-green-600 dark:text-green-400 mb-2">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="font-bold text-lg">All caught up!</h3>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300/80 leading-relaxed">
          Your command center is in perfect shape. Keep applying and tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Suggested Actions</h3>
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isWarning = rec.type === 'WARNING';
          
          return (
            <div 
              key={rec.id} 
              className={`p-5 rounded-2xl border transition-shadow hover:shadow-md ${
                isWarning 
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' 
                  : 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                {isWarning ? (
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                )}
                <div>
                  <h4 className={`font-bold ${isWarning ? 'text-amber-900 dark:text-amber-400' : 'text-indigo-900 dark:text-indigo-400'}`}>
                    {rec.title}
                  </h4>
                  <p className={`text-sm mt-1 mb-3 ${isWarning ? 'text-amber-700 dark:text-amber-300/80' : 'text-indigo-700 dark:text-indigo-300/80'}`}>
                    {rec.description}
                  </p>
                  <Link 
                    to={rec.actionLink}
                    className={`inline-flex items-center text-sm font-semibold transition-transform hover:translate-x-1 ${
                      isWarning ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                    }`}
                  >
                    {rec.actionText} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

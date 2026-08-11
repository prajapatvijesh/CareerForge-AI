import React from 'react';
import { DashboardSummary } from '../api/dashboard.api';
import { Plus, User, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Plus: <Plus className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
};

export const QuickActionsGrid: React.FC<{ actions: DashboardSummary['quickActions'] }> = ({ actions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
      </div>
      
      <div className="space-y-3">
        {actions.map((action) => {
          const content = (
            <div 
              className={`flex items-center p-4 rounded-2xl transition-all duration-200 ${
                action.disabled 
                  ? 'bg-slate-50 dark:bg-slate-950 opacity-50 cursor-not-allowed' 
                  : 'bg-slate-50 dark:bg-slate-950 hover:bg-primary/5 hover:border-primary/30 border border-slate-100 dark:border-slate-800 cursor-pointer group'
              }`}
            >
              <div className={`p-2.5 rounded-xl mr-4 ${action.disabled ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm group-hover:text-primary group-hover:shadow-md transition-all'}`}>
                {iconMap[action.icon] || <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h4 className={`font-semibold ${action.disabled ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-primary'}`}>
                  {action.label}
                </h4>
                {action.disabled && <p className="text-xs text-muted-foreground mt-0.5">Coming soon</p>}
              </div>
            </div>
          );

          if (action.disabled) return <div key={action.id}>{content}</div>;
          
          return (
            <Link key={action.id} to={action.link} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

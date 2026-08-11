import React from 'react';
import { DashboardSummary } from '../api/dashboard.api';
import { FileText, Clock, ChevronRight, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const RecentActivityWidget: React.FC<{ recentResumes: DashboardSummary['resumes']['recent'] }> = ({ recentResumes }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-1">Pick up where you left off</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-primary font-medium hover:bg-primary/10">
          <Link to="/resumes">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </div>

      {recentResumes.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-slate-500 font-medium text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentResumes.map((resume) => (
            <div 
              key={resume._id} 
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-xl text-indigo-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                    {resume.title}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 font-medium">
                    <Clock className="w-3 h-3 mr-1 opacity-70" />
                    Edited {new Date(resume.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl shadow-sm">
                <Link to={`/resumes/${resume._id}`}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Continue
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { IJobApplication, JobStatus } from '../api/jobs.api';
import { JobCard } from './JobCard';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: IJobApplication[];
  onEditJob: (job: IJobApplication) => void;
  onDeleteJob: (id: string) => void;
}

const statusColors: Record<JobStatus, string> = {
  SAVED: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  APPLIED: 'bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  SCREENING: 'bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  INTERVIEW_1: 'bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  INTERVIEW_2: 'bg-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
  INTERVIEW_3: 'bg-pink-200 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  OFFER_RECEIVED: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  REJECTED: 'bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  WITHDRAWN: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, jobs, onEditJob, onDeleteJob }) => {
  const formatStatus = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 h-full max-h-full overflow-hidden">
      
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm z-10 sticky top-0 rounded-t-3xl">
        <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {formatStatus(status)}
        </h2>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusColors[status]}`}>
          {jobs.length}
        </span>
      </div>

      {/* Column Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {jobs.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-sm font-medium text-slate-400">No applications</p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onEdit={onEditJob} 
              onDelete={onDeleteJob} 
            />
          ))
        )}
      </div>

    </div>
  );
};

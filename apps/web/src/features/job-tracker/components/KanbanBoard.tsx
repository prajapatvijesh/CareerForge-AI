import React from 'react';
import { IJobApplication, JOB_STATUSES } from '../api/jobs.api';
import { KanbanColumn } from './KanbanColumn';
import { Briefcase } from 'lucide-react';

interface KanbanBoardProps {
  jobs: IJobApplication[];
  onEditJob: (job: IJobApplication) => void;
  onDeleteJob: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobs, onEditJob, onDeleteJob }) => {
  // Group jobs by status
  const jobsByStatus = JOB_STATUSES.reduce((acc, status) => {
    acc[status] = jobs.filter(job => job.status === status);
    return acc;
  }, {} as Record<string, IJobApplication[]>);

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 h-[60vh]">
        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-6 rounded-full mb-6 text-indigo-500">
          <Briefcase className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your pipeline is empty</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Start tracking your job applications. Add your first job to the pipeline and keep your search organized.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto pb-4 -mx-6 px-6 sm:-mx-8 sm:px-8 custom-scrollbar">
      <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[600px] items-start">
        {JOB_STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobsByStatus[status]}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
          />
        ))}
      </div>
    </div>
  );
};

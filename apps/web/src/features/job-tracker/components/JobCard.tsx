import React from 'react';
import { IJobApplication, JOB_STATUSES, JobStatus, useUpdateJob } from '../api/jobs.api';
import { Building2, Calendar, MapPin, MoreHorizontal, ExternalLink, Briefcase } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface JobCardProps {
  job: IJobApplication;
  onEdit: (job: IJobApplication) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  HIGH: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const updateJob = useUpdateJob();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === job.status) return;
    updateJob.mutate({ id: job._id, data: { status: newStatus as JobStatus } });
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityColors[job.priority]}`}>
          {job.priority}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(job)}>Edit Details</DropdownMenuItem>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={job.status} onValueChange={handleStatusChange}>
                  {JOB_STATUSES.map(status => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => onDelete(job._id)}>
              Delete Application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 flex items-center">
          {job.jobTitle}
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </h3>
        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center line-clamp-1">
          <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0" /> {job.companyName}
        </p>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {job.location && (
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <span className="line-clamp-1">{job.location} {job.workModel ? `· ${job.workModel}` : ''}</span>
          </div>
        )}
        
        {job.salary?.min && (
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <Briefcase className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <span>
              {job.salary.currency} {job.salary.min.toLocaleString()} {job.salary.max ? `- ${job.salary.max.toLocaleString()}` : '+'} /{job.salary.period?.charAt(0)}
            </span>
          </div>
        )}

        {job.nextFollowUpDate && (
          <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 p-2 rounded-lg mt-2">
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Follow up: {format(new Date(job.nextFollowUpDate), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};

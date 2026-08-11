import { useState, useEffect } from 'react';
import { useGetJobs, useCreateJob, useUpdateJob, useDeleteJob, IJobApplication, GetJobsQuery } from '../api/jobs.api';
import { JobFilters } from '../components/JobFilters';
import { KanbanBoard } from '../components/KanbanBoard';
import { JobFormModal } from '../components/JobFormModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Local simple debounce hook for search
function useLocalDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const JobTrackerPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useLocalDebounce(search, 300);
  const [priority, setPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<IJobApplication | null>(null);

  // Queries & Mutations
  const queryParams: GetJobsQuery = {
    limit: 100, // Load enough for Kanban board
    search: debouncedSearch || undefined,
    priority: priority === 'ALL' ? undefined : (priority as any),
    sortBy: sortBy as any,
  };
  
  const { data, isLoading } = useGetJobs(queryParams);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  // Handlers
  const handleOpenModal = (job?: IJobApplication) => {
    setEditingJob(job || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = (formData: any) => {
    if (editingJob) {
      updateJob.mutate({ id: editingJob._id, data: formData }, {
        onSuccess: handleCloseModal
      });
    } else {
      createJob.mutate(formData, {
        onSuccess: handleCloseModal
      });
    }
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteJob.mutate(id);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container max-w-[1600px] mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Job Tracker</h1>
            <p className="text-slate-500 mt-1">Manage and track your job applications</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-full shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add Application
          </Button>
        </div>

        {/* Filters */}
        <JobFilters 
          search={search}
          setSearch={setSearch}
          priority={priority}
          setPriority={setPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Board */}
        {isLoading ? (
          <div className="animate-pulse bg-white dark:bg-slate-900 h-[60vh] rounded-3xl border border-slate-200 dark:border-slate-800"></div>
        ) : (
          <KanbanBoard 
            jobs={data?.items || []} 
            onEditJob={handleOpenModal}
            onDeleteJob={handleDeleteJob}
          />
        )}

        {/* Form Modal */}
        <JobFormModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveJob}
          initialData={editingJob}
          isLoading={createJob.isPending || updateJob.isPending}
        />
      </div>
    </div>
  );
};

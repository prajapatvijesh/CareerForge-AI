import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFormSchema, JobFormValues } from '../schemas/job.schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { JOB_STATUSES, WORK_MODELS, PRIORITIES, SALARY_PERIODS, IJobApplication } from '../api/jobs.api';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormValues) => void;
  initialData?: IJobApplication | null;
  isLoading?: boolean;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen, onClose, onSubmit, initialData, isLoading
}) => {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobUrl: '',
      location: '',
      workModel: 'REMOTE',
      status: 'SAVED',
      priority: 'MEDIUM',
      salary: {
        min: '' as any,
        max: '' as any,
        currency: 'USD',
        period: 'YEARLY'
      }
    }
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          companyName: initialData.companyName,
          jobTitle: initialData.jobTitle,
          jobUrl: initialData.jobUrl || '',
          location: initialData.location || '',
          workModel: initialData.workModel || 'REMOTE',
          status: initialData.status,
          priority: initialData.priority,
          salary: initialData.salary ? {
            min: initialData.salary.min || ('' as any),
            max: initialData.salary.max || ('' as any),
            currency: initialData.salary.currency || 'USD',
            period: initialData.salary.period || 'YEARLY'
          } : { min: '' as any, max: '' as any, currency: 'USD', period: 'YEARLY' },
          source: initialData.source || '',
          notes: initialData.notes || '',
        });
      } else {
        form.reset({
          companyName: '', jobTitle: '', jobUrl: '', location: '', workModel: 'REMOTE', status: 'SAVED', priority: 'MEDIUM', salary: { min: '' as any, max: '' as any, currency: 'USD', period: 'YEARLY' }
        });
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (values: JobFormValues) => {
    // Clean up empty numbers
    const cleanValues = { ...values };
    if (cleanValues.salary) {
      if (cleanValues.salary.min === '') delete cleanValues.salary.min;
      if (cleanValues.salary.max === '') delete cleanValues.salary.max;
    }
    onSubmit(cleanValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Application' : 'Add Application'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl><Input placeholder="e.g. Google" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl><Input placeholder="e.g. Frontend Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {JOB_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="e.g. San Francisco, CA" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Application'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

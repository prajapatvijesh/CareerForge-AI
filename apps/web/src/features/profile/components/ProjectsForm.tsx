import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateProfile, IProfile } from '../api/profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

const projectSchema = z.object({
  projects: z.array(z.object({
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(1, 'Description is required'),
    url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    technologies: z.string(), // We will store as string in form, convert to array on submit
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }))
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export const ProjectsForm: React.FC<{ profile: IProfile }> = ({ profile }) => {
  const updateMutation = useUpdateProfile();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: profile?.projects?.length 
        ? profile.projects.map(p => ({ ...p, technologies: p.technologies.join(', '), url: p.url || '' }))
        : [{ title: '', description: '', url: '', technologies: '', startDate: '', endDate: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'projects',
    control: form.control
  });

  const onSubmit = (data: ProjectFormValues) => {
    const formattedData = data.projects.map(p => ({
      ...p,
      url: p.url === '' ? undefined : p.url,
      technologies: p.technologies.split(',').map(t => t.trim()).filter(Boolean)
    }));
    updateMutation.mutate({ projects: formattedData as any });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 relative">
              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Project Title</FormLabel>
                    <FormControl><Input placeholder="CareerForge AI" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`projects.${index}.technologies`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Technologies</FormLabel>
                    <FormControl><Input placeholder="React, Node.js, MongoDB" {...field} /></FormControl>
                    <FormDescription>Comma separated list</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`projects.${index}.url`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Project URL / Repo</FormLabel>
                    <FormControl><Input placeholder="https://github.com/yourusername/project" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                  <FormField control={form.control} name={`projects.${index}.startDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="month" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`projects.${index}.endDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="What did you build? What problems did it solve?" rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => append({ title: '', description: '', url: '', technologies: '', startDate: '', endDate: '' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
          
          <Button type="submit" disabled={updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Projects
          </Button>
        </div>
      </form>
    </Form>
  );
};

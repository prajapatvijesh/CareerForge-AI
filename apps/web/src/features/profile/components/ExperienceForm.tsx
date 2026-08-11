import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateProfile, IProfile } from '../api/profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const expSchema = z.object({
  experience: z.array(z.object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
  }))
});

type ExpFormValues = z.infer<typeof expSchema>;

export const ExperienceForm: React.FC<{ profile: IProfile }> = ({ profile }) => {
  const updateMutation = useUpdateProfile();
  
  const form = useForm<ExpFormValues>({
    resolver: zodResolver(expSchema),
    defaultValues: {
      experience: profile?.experience?.length ? profile.experience : [{ company: '', position: '', startDate: '', current: false, description: '', location: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'experience',
    control: form.control
  });

  const onSubmit = (data: ExpFormValues) => {
    // If current is true, clear endDate
    const cleanedData = data.experience.map(exp => ({
      ...exp,
      endDate: exp.current ? undefined : exp.endDate
    }));
    updateMutation.mutate({ experience: cleanedData as any });
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
                <FormField control={form.control} name={`experience.${index}.position`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position / Title</FormLabel>
                    <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input placeholder="Google" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="Mountain View, CA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="month" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" disabled={form.watch(`experience.${index}.current`)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name={`experience.${index}.current`} render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md col-span-1 md:col-span-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe your achievements and responsibilities..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => append({ company: '', position: '', startDate: '', current: false, description: '', location: '' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
          
          <Button type="submit" disabled={updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Experience
          </Button>
        </div>
      </form>
    </Form>
  );
};

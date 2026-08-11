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

const eduSchema = z.object({
  education: z.array(z.object({
    school: z.string().min(1, 'School is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
  }))
});

type EduFormValues = z.infer<typeof eduSchema>;

export const EducationForm: React.FC<{ profile: IProfile }> = ({ profile }) => {
  const updateMutation = useUpdateProfile();
  
  const form = useForm<EduFormValues>({
    resolver: zodResolver(eduSchema),
    defaultValues: {
      education: profile?.education?.length ? profile.education : [{ school: '', degree: '', fieldOfStudy: '', startDate: '', current: false, description: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'education',
    control: form.control
  });

  const onSubmit = (data: EduFormValues) => {
    const cleanedData = data.education.map(edu => ({
      ...edu,
      endDate: edu.current ? undefined : edu.endDate
    }));
    updateMutation.mutate({ education: cleanedData as any });
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
                <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>School / University</FormLabel>
                    <FormControl><Input placeholder="Stanford University" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl><Input placeholder="B.S." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`education.${index}.fieldOfStudy`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl><Input placeholder="Computer Science" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="month" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`education.${index}.endDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date / Expected</FormLabel>
                      <FormControl>
                        <Input type="month" disabled={form.watch(`education.${index}.current`)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name={`education.${index}.current`} render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md col-span-1 md:col-span-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently study here</FormLabel>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Description / Activities (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="Societies, GPA, relevant coursework..." rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => append({ school: '', degree: '', fieldOfStudy: '', startDate: '', current: false, description: '' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
          
          <Button type="submit" disabled={updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Education
          </Button>
        </div>
      </form>
    </Form>
  );
};

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateProfile, IProfile } from '../api/profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

const skillSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    proficiency: z.enum(['Beginner', 'Intermediate', 'Expert'])
  }))
});

type SkillsFormValues = z.infer<typeof skillSchema>;

export const SkillsForm: React.FC<{ profile: IProfile }> = ({ profile }) => {
  const updateMutation = useUpdateProfile();
  
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: profile?.skills?.length ? profile.skills : [{ name: '', proficiency: 'Intermediate' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'skills',
    control: form.control
  });

  const onSubmit = (data: SkillsFormValues) => {
    updateMutation.mutate({ skills: data.skills });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React, Python, UI Design" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`skills.${index}.proficiency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select proficiency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="button" variant="ghost" size="icon" className="mt-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => append({ name: '', proficiency: 'Intermediate' })}>
            <Plus className="w-4 h-4 mr-2" /> Add Skill
          </Button>
          
          <Button type="submit" disabled={updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Skills
          </Button>
        </div>
      </form>
    </Form>
  );
};

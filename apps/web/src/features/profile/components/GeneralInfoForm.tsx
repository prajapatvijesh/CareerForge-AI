import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile, IProfile } from '../api/profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const generalInfoSchema = z.object({
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

type FormValues = z.infer<typeof generalInfoSchema>;

export const GeneralInfoForm: React.FC<{ profile?: IProfile }> = ({ profile }) => {
  const updateMutation = useUpdateProfile();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      headline: profile?.headline || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
    },
  });

  // Update form if profile loads later
  useEffect(() => {
    if (profile) {
      form.reset({
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="headline" render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Headline</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Senior Software Engineer at Tech Corp" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <FormLabel>Bio / Summary</FormLabel>
            <FormControl>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="A short professional bio..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="e.g. San Francisco, CA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

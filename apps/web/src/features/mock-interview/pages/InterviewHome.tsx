
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStartInterview, useGetInterviewHistory } from '../api/mockInterview.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bot, Play, History as HistoryIcon, Target } from 'lucide-react';
import { HistoryCard } from '../components/HistoryCard';

const formSchema = z.object({
  role: z.string().min(2, 'Role must be at least 2 characters'),
  company: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
});

export const InterviewHome: React.FC = () => {
  const navigate = useNavigate();
  const startMutation = useStartInterview();
  const { data: history } = useGetInterviewHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      company: '',
      difficulty: 'MEDIUM',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startMutation.mutate({
      ...values,
      durationMinutes: 30, // Hardcoded for MVP as per requirements
      questionCount: 5,
    }, {
      onSuccess: (data) => {
        navigate(`/interviews/${data._id}`);
      }
    });
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Configuration */}
        <div className="lg:col-span-7">
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              AI Mock Interview
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Practice for your dream job. Our AI generates dynamic questions, simulates a timed environment, and evaluates your answers instantly.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <Target className="w-5 h-5 text-indigo-500" /> Configure Interview
            </h2>

            {(startMutation.error as any)?.response?.status === 429 && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-2">
                  You have reached your monthly AI usage limit for Mock Interviews.
                </p>
                <Button asChild variant="outline" size="sm" className="bg-white dark:bg-slate-900 text-orange-600 border-orange-200 hover:bg-orange-50">
                  <Link to="/subscription">Upgrade Plan</Link>
                </Button>
              </div>
            )}
            {(startMutation.error as any)?.response?.status !== 429 && startMutation.isError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 text-sm">
                {(startMutation.error as any)?.response?.data?.message || 'Failed to start interview.'}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700 dark:text-slate-300">Target Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior React Developer" className="rounded-xl h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700 dark:text-slate-300">Target Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Google, Stripe" className="rounded-xl h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700 dark:text-slate-300">Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-12">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={startMutation.isPending}
                  className="w-full rounded-xl h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                  {startMutation.isPending ? 'Preparing Interview...' : 'Start Interview'} 
                  {!startMutation.isPending && <Play className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Side: History */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <HistoryIcon className="w-5 h-5 text-slate-400" /> Past Interviews
            </h2>
            
            {!history ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>No past interviews found.</p>
                <p className="text-sm mt-2">Start your first mock interview today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map(interview => (
                  <HistoryCard key={interview._id} interview={interview} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

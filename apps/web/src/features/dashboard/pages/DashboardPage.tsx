
import { useGetDashboardSummary } from '../api/dashboard.api';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { StatCard } from '../components/StatCard';
import { RecentActivityWidget } from '../components/RecentActivityWidget';
import { RecommendationsWidget } from '../components/RecommendationsWidget';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { AIUsageWidget } from '../components/AIUsageWidget';
import { useAppSelector } from '@/store/hooks';
import { User, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { data: summary, isLoading, error } = useGetDashboardSummary();
  const { user } = useAppSelector((state) => state.auth);

  if (isLoading) return <DashboardSkeleton />;
  if (error || !summary) return <div className="p-12 text-center text-destructive">Failed to load command center data.</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 py-10 px-6">
      <div className="container max-w-7xl mx-auto space-y-8">
        
        {/* Onboarding Banner / Welcome Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {/* Abstract background gradient */}
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                {summary.profile.isOnboarding 
                  ? "Let's get your profile set up so you can start crafting winning resumes." 
                  : "Here's what's happening with your job search today."}
              </p>
            </div>
            
            {summary.profile.isOnboarding && (
              <Button asChild className="rounded-full px-8 shadow-md hover:shadow-lg transition-all" size="lg">
                <Link to="/profile">Complete Profile</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Command Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Metrics & Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard 
                title="Profile Setup" 
                value={`${summary.profile.completionPercentage}%`} 
                icon={User}
                colorClass="text-blue-600 dark:text-blue-400"
                bgClass="bg-blue-100 dark:bg-blue-900/50"
                linkTo="/profile"
              />
              <StatCard 
                title="Total Resumes" 
                value={summary.resumes.totalCount} 
                icon={FileText}
                colorClass="text-indigo-600 dark:text-indigo-400"
                bgClass="bg-indigo-100 dark:bg-indigo-900/50"
                linkTo="/resumes"
              />
              <StatCard 
                title="Applications" 
                value={summary.jobs.activeApplications} 
                subtitle={summary.jobs.status === 'COMING_SOON' ? 'Coming Soon' : 'Active'}
                icon={Briefcase}
                colorClass="text-amber-600 dark:text-amber-400"
                bgClass="bg-amber-100 dark:bg-amber-900/50"
              />
            </div>

            {/* Recent Activity (Resumes) */}
            <RecentActivityWidget recentResumes={summary.resumes.recent} />
            
          </div>

          {/* Right Column: Actions & Intelligence */}
          <div className="space-y-8">
            <AIUsageWidget />
            <QuickActionsGrid actions={summary.quickActions} />
            <RecommendationsWidget recommendations={summary.recommendations} />
          </div>

        </div>
      </div>
    </div>
  );
};

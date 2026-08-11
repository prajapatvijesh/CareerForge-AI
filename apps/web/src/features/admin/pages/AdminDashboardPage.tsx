import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { StatCard } from '../components/StatCard';
import { Users, Crown, CreditCard, Activity, Briefcase, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="animate-pulse space-y-8 p-4">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>)}
    </div>
  </div>;
  if (error) return <div className="text-red-500 p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/50">Unable to load analytics. <button onClick={() => window.location.reload()} className="underline ml-2">Try Again</button></div>;
  if (!data) return null;

  const { users, revenue, subscriptions, ai, resumes, jobs } = data;

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const subscriptionData = [
    { name: 'FREE', value: subscriptions.totalFree || users.total - subscriptions.totalPro },
    { name: 'PRO', value: subscriptions.totalPro }
  ];
  const COLORS = ['#9ca3af', '#4f46e5'];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Command Center</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time platform analytics and overview.</p>
      </div>

      {/* Top row cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={users.total.toLocaleString()} 
          icon={Users} 
          trend={{ value: `${users.newThisMonth} this month`, isPositive: true }}
        />
        <StatCard 
          title="PRO Users" 
          value={subscriptions.totalPro.toLocaleString()} 
          icon={Crown} 
          trend={{ value: `${subscriptions.active} active`, isPositive: true }}
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(revenue.total)} 
          icon={CreditCard} 
          subtitle={`${formatCurrency(revenue.thisMonth)} this month`}
        />
        <StatCard 
          title="AI Requests" 
          value={ai.totalRequests.toLocaleString()} 
          icon={Activity} 
          subtitle={`$${ai.estimatedCost.toFixed(2)} est. cost`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5 text-indigo-500" /> Platform Content
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400">Total Resumes</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{resumes.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400">Tracked Jobs</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{jobs.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400">Resume Analyses</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{ai.resumeAnalyses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-600 dark:text-gray-400">Mock Interviews</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{ai.mockInterviews.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Subscription Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {subscriptionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
